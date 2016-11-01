chrome.extension.onMessage.addListener(function(request, send, sendResponse) {
  if(request.action !== 'clear-styles') {
    return
  }
  
  encoder.clearStyles()
})
