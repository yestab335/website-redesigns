'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;
var url_loc = (typeof browser === 'object') ? 'firefox' : 'chrome';
var manifestData = ext_api.runtime.getManifest();
var ext_name = manifestData.name;
var ext_version = manifestData.version;
var navigator_ua = navigator.userAgent;
var navigator_ua_mobile = navigator_ua.toLowerCase().includes('mobile');
var kiwi_browser = navigator_ua_mobile && (url_loc === 'chrome') && !navigator_ua.toLowerCase().includes('yabrowser');

const dompurify_sites = ['arcinfo.ch', 'asiatimes.com', 'bloomberg.com', 'cicero.de', 'dn.no', 'ilmanifesto.it', 'iltalehti.fi', 'iltirreno.it', 'ipolitics.ca', 'italiaoggi.it', 'lanuovasardegna.it', 'lequipe.fr', 'lesechos.fr', 'marianne.net', 'newleftreview.org', 'newscientist.com', 'nzherald.co.nz', 'outlookbusiness.com', 'prospectmagazine.co.uk', 'stratfor.com', 'techinasia.com', 'timesofindia.com', 'valor.globo.com', 'vn.nl'].concat(nl_mediahuis_region_domains, no_nhst_media_domains);
var optin_setcookie = false;
var optin_update = true;
var blocked_referer = false;

// defaultSites are loaded from sites.js at installation extension

var restrictions = {
  'bloomberg.com': /^((?!\.bloomberg\.com\/news\/terminal\/).)*$/,
  'dailywire.com': /^((?!\.dailywire\.com\/(episode|show|videos|watch)).)*$/,
  'economictimes.com': /\.economictimes\.com($|\/($|(__assets|prime)(\/.+)?|.+\.cms))/,
  'elespanol.com': /^((?!\/cronicaglobal\.elespanol\.com\/).)*$/,
  'espn.com': /^((?!espn\.com\/watch).)*$/,
  'esquire.com': /^((?!\/classic\.esquire\.com\/).)*$/,
  'lastampa.it': /^((?!\/video\.lastampa\.it\/).)*$/,
  'lequipe.fr': /^((?!\.lequipe\.fr\/.+\/les-notes\/).)*$/,
  'nknews.org': /^((?!nknews\.org\/pro\/).)*$/,
  'nytimes.com': /^((?!\/timesmachine\.nytimes\.com\/).)*$/,
  'science.org': /^((?!\.science\.org\/doi\/).)*$/,
  'timesofindia.com': /\.timesofindia\.com($|\/($|toi-plus(\/.+)?|.+\.cms))/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'repubblica.it': /^((?!\/video\.repubblica\.it\/).)*$/,
  'seekingalpha.com': /\/seekingalpha\.com($|\/($|(amp\/)?(article|news)\/|samw\/))/,
  'statista.com': /^((?!\.statista\.com\/(outlook|study)\/).)*$/,
  'techinasia.com': /\.techinasia\.com\/.+/,
  'theatlantic.com': /^((?!\/newsletters\.theatlantic\.com\/).)*$/,
  'thetimes.co.uk': /^((?!epaper\.thetimes\.co\.uk).)*$/,
  'timeshighereducation.com': /\.timeshighereducation\.com\/((features|news|people)\/|.+((\w)+(\-)+){3,}.+|sites\/default\/files\/)/,
  'uol.com.br': /^((?!(conta|email)\.uol\.com\.br).)*$/,
}

for (let domain of au_news_corp_domains) {
  restrictions[domain] = new RegExp('^((?!todayspaper\\.' + domain.replace(/\./g, '\\.') + '\\/).)*$');
}

if (typeof browser !== 'object') {
  for (let domain of []) {
    restrictions[domain] = new RegExp('((\\/|\\.)' + domain.replace(/\./g, '\\.') + '\\/$|' + restrictions[domain].toString().replace(/(^\/|\/$)/g, '') + ')');
  }
}

// Don't Remove Cookie Before/After Page Load
var allow_cookies = [];
var remove_cookies = [];

// Select Speific Cookie(s) To Hold/Drop From remove_cookies Domains
var remove_cookies_select_hold, remove_cookies_select_drop;

// Set User-Agent
var use_google_bot, use_bing_bot, use_msn_bot;

// Set Referer
var use_facebook_referer, use_google_referer, use_twitter_referer;

// Set Random IP-Address
var random_ip = {};
var use_random_ip = [];

// Concat All Sites With Change Of Headers (useragent,referer or random ip)
var change_headers;

// Block Paywall-Scripts
var blockedRegexes = {};
var blockedRegexesDomains = [];
var blockedRegexesGeneral = {};
var blockedJsInline = {};
var blockedJsInlineDomains = [];

// unhide text on amp-page
var amp_unhide;

// redirect to amp-page
var amp_redirect;

// code for contentScript
var cs_code;

// load text from json
var ld_json;

// load text from Google webcache
var ld_google_webcache;

// Custom: Block JavaScipt
var block_js_custom = [];
var block_js_custom_ext = [];

function initSetRules() {
  allow_cookies = [];
  remove_cookies = [];
  remove_cookies_select_drop = {};
  remove_cookies_select_hold = {};
  use_google_bot = [];
  use_bing_bot = [];
  use_msn_bot = [];
  use_facebook_referer = [];
  use_google_referer = [];
  use_twitter_referer = [];
  random_ip = {};
  change_headers = [];
  amp_unhide = [];
  amp_redirect = {};
  cs_code = {};
  ld_json = {};
  ld_google_webcache = {};
  block_js_custom = [];
  block_js_custom_ext = [];
  blockedRegexes = {};
  blockedRegexesDomains = [];
  blockedRegexesGeneral = {};
  blockedJsInline = {};
  blockedJsInlineDomains = [];
  init_custom_domains();
}

const userAgentDesktopG = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const userAgentMobileG = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)";

const userAgentDesktopB = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)";
const userAgentMobileB = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)";

const userAgentDesktopM = 'Mozilla/5.0 (compatible; MSNbot/1.1; +http://search.msn.com/msnbot.htm)';
const userAgentMobileM = 'Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; MSNbot/1.1 +http://search.msn.com/msnbot.htm)';

var enabledSites = [];
var disabledSites = [];
var optionSites = {};
var customSites = {};
var customSites_domains = [];
var updatedSites = {};
var updatedSites_new = [];
var updatedSites_domains_new = [];
var excludedSites = [];

function setDefaultOptions() {
  ext_api.storage.local.set({
    sites: filterObject(defaultSites, function (val, key) {
      return val.domain && !val.domain.match(/^(###$|#options_(disable|optin)_)/)
    },
      function (val, key) {
      return [key, val.domain]
    })
  }, function () {
    ext_api.runtime.openOptionsPage();
  });
}

function check_sites_updated() {
  let sites_updated_json = 'https://gitlab.com/magnolia1234/bypass-paywalls-' + url_loc + '-clean/-/raw/master/sites_updated.json';
  fetch(sites_updated_json)
  .then(response => {
    if (response.ok) {
      response.json().then(json => {
        expandSiteRules(json, true);
        ext_api.storage.local.set({
          sites_updated: json
        });
      })
    }
  }).catch(function (err) {
    false;
  });
}

function prep_regex_str(str, domain = '') {
  if (domain) {
    str = str.replace(/{domain}/g, domain.replace(/\./g, '\\.'));
  }
  return str.replace(/^\//, '').replace(/\/\//g, '/').replace(/([^\\])\/$/, "$1")
}