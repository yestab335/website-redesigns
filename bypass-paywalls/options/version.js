var ext_api = (typeof browser === 'object') ? browser : chrome;
var url_loc = (typeof browser === 'object') ? 'firefox' : 'chrome';

var manifestData = ext_api.runtime.getManifest();
var versionString = 'v' + manifestData.version;
document.getElementById('version').innerText = versionString;
var versionString_new = document.getElementById('version_new');
versionString_new.setAttribute('style', 'font-weight: bold;');
var anchorEl;

function show_update(ext_version_new, check = true) {
  if (ext_version_new) {
    ext_api.management.getSelf(function (result) {
      var installType = result.installType;
    })
  }
}