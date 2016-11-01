var utility = {}

utility.getOffsets = function(element) {
  var jqElement = $(element)
  var offset = jqElement.offset()
  if(!offset) {
    throw "offset is null!"
  }
  var top = offset.top
  var left = offset.left
  var right = left + jqElement.width()
  var bottom = top + jqElement.height()
  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right
  }
}