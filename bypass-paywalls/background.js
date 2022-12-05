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