var encoder = {}

var LAST_ENCODED_DESCRIPTION = null
var VIEWPORT_DIM = {
    width: 1920,
    height: 1080
}

/**
 * Listen for mousedown events so that we know what the last element clicked was
 */
var LAST_ELEMENT_CLICKED = null
document.addEventListener("mousedown", function(event){
  //right click
  if(event.button == 2 || event.button == 0) {
    LAST_ELEMENT_CLICKED = event.target
  }
}, true);

chrome.extension.onMessage.addListener(function(request, send, sendResponse) {
  if(request.action !== 'encode') {
    return
  }
  //note that element is actually an array  
  var jqElement = $(LAST_ELEMENT_CLICKED)

  var elements = intermediateElementCalculator.calculateIntermediateElements(jqElement, VIEWPORT_DIM)
  elements = elementSizeCalculator.calculateSizes(elements, VIEWPORT_DIM)
  
  intermediateElementCalculator.drawCornerCross(jqElement)
  console.log(elements)
  
  //store for decoder
  LAST_ENCODED_DESCRIPTION = elements

})

encoder.clearStyles = function() {
  intermediateElementCalculator.clearStyles()
}
