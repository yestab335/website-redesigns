var ext_api = chrome || browser;
var url_loc = (typeof browser === 'object') ? 'firefox' : 'chrome';

var useragent_options = ['', 'googlebot', 'bingbot'];
var referer_options = ['', 'facebook', 'google', 'twitter'];
var random_ip_options = ['', 'all', 'eu'];

function capitalize(str) {
  return (typeof str === 'string') ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function sortJson(json) {
  return Object.keys(json)
  .sort().reduce(function(Obj,key) {
    Obj[key] = json[key];
    return Obj;
  }, {});
}

// Saves Options To ext_api.storage
function save_options() {
  var textareaEl = document.querySelector('#bypass_sites textarea');
  var sites_custom = {};
  if (textareaEl.value !== '') {
    var sites_custom = JSON.parse(textareaEl.value);
  }
  ext_api.storage.local.set({
    sites_custom: sites_custom
  }, function() {
    // Update Status To Let User Know Custom Sites Were Saved
    var status = document.getElementById('status');
    status.textContent = 'Custom sites saved.';
    setTimeout(function() {
      status.textContent = '',
      location.href = 'options.html';
      // window.close();
    }, 800);
  });
}

// Sort JSON By Key In Textarea
function sort_options() {
  var textareaEl = document.querySelector('#bypass_sites textarea');
  var sites_custom = {};
  if(textareaEl.value !== '') {
    var sites_custom = JSON.parse(textareaEl.value);
    var sites_custom_sorted = sortJson(sites_custom);
    textareaEl.value = JSON.stringify(sites_custom_sorted);
  }
}

// Export Custom Sites To File
function export_options() {
  ext_api.storage.local.get({
    sites_custom: {}
  }, function(items) {
    var result = JSON.stringify(items.sites_custom);
    var a = document.createElement("a");
    var file = new Blob([result], {type: "text/plain"});
    a.href = window.URL.createObjectURL(file);
    let date = new Date();
    let dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    a.download = 'bypass_paywalls_clean_custom_' + dateStr + '.txt';
    a.click();
  });
}

function import_json(result) {
  ext_api.storage.local.get({
    sites_custom: {}
  }, function(items) {
    var sites_custom = items.sites_custom;
    var sites_custom_new = JSON.parse(result);
    for (let site in sites_custom_new) {
      sites_custom[site] = sites_custom_new[site];
    }
    ext_api.storage.local.set({
      sites_custom: sites_custom
    }, function() {
      // Update Status To Let User Know Custom Sites Were Imported
      var status = document.getElementById('status');
      status.textContent = 'Custom sites imported.';
      setTimeout(function() {
        // status.textContent = '';
        importInput.value = '';
        renderOptions();
      }, 800);
    });
  });
}

// Import Custom Sites From GitLab
function import_gitlab_options(e) {
  let url = 'https://gitlab.com/magnolia1234/bypass-paywalls-' + url_loc + '-clean/-/raw/master/custom/sites_custom.json';
}