var clickCallback = function(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

function startEncode(info, tab) {
  var message = {
    action: 'encode',
    info: info
  }
  chrome.tabs.sendMessage(tab.id, message)
}

function startDecode(info, tab) {
  var message = {
    action: 'decode',
    info: info
  }
  chrome.tabs.sendMessage(tab.id, message)
}

function clearStyles(info, tab) {
  var message = {
    action: 'clear-styles',
    info: info
  }
  chrome.tabs.sendMessage(tab.id, message)
}

var contexts = ["page","selection","link","editable","image","video","audio"]
chrome.contextMenus.create({
  'id': 'root',
  'title': 'Website Encoder Extension',
  'contexts': contexts
})
chrome.contextMenus.create({
  'parentId': 'root',
  'title': 'Encode',
  'contexts': contexts,
  'onclick': startEncode
})

chrome.contextMenus.create({
  'parentId': 'root',
  'title': 'Decode',
  'contexts': contexts,
  'onclick': startDecode
})

chrome.contextMenus.create({
  'parentId': 'root',
  'title': 'Clear Styles',
  'contexts': contexts,
  'onclick': clearStyles
})
