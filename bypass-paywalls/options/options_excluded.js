var ext_api = chrome || browser;

// Saves Options To ext_api.storage
function save_options() {
  var textareaEl = document.querySelector('#excluded_sites textarea');
  var sites_excluded = [];
  if (textareaEl.value !== '') {
    var sites_excluded = textareaEl.value.split(',').map(function(item) { return item.trim().replace('www.', ''); });
  }
  ext_api.storage.local.set({
    sites_excluded: sites_excluded
  }, function() {
    // Update Status To Let User Know Excluded Sites Were Saved
    var status = document.getElementById('status');
    status.textContent = 'Excluded sites saved.';
  });
}

// Sort JSON By Key In Textarea
function sort_options() {
  var textareaEl = document.querySelector('#excluded_sites textarea');
  var sites_excluded = [];
  if (textareaEl.value !== '') {
    var sites_excluded = textareaEl.value.split(',').map(function(item) { return item.trim().replace('www.', ''); });
    var sites_excluded_sorted = sites_excluded.sort();
    textareaEl.value = sites_excluded_sorted.join();
  }

  // Update Status To Let User Know Excluded Sites Were Sorted
  var status = document.getElementById('status');
  status.textContent = 'Excluded sites sorted (not saved yet)';
}

function renderOptions() {
  ext_api.storage.local.get({
    sites_excluded: []
  }, function(items) {
    var sites_excluded = items.sites_excluded;
    var sitesEl = document.getElementById('excluded_sites');
    sitesEl.innerHTML = '';
    var labelEl = document.createElement('label');
    var textareaEl = document.createElement('textarea');
    textareaEl.placeholder = 'example1.com, example2.com';
    textareaEl.value = sites_excluded.join();
    textareaEl.rows = 12;
    textareaEl.cols = 40;
    labelEl.appendChild(textareaEl);
    sitesEl.appendChild(labelEl);
  });
}

document.addEventListener('DOMContentLoaded', renderOptions);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('sort').addEventListener('click', sort_options);