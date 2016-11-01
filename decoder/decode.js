/**
 * Configuration
 */
var VIEWPORT_KEYWORD = '@viewport'

var VIEWPORT_SIZE = {
  height: 1080,
  width: 1920
}
var VIEWPORT_OFFSET = {
  top: 0,
  left: 0,
  bottom: VIEWPORT_SIZE.height,
  right: VIEWPORT_SIZE.width
}
var EDGES = [
  {
    'side': 'top',
    'dimension': 'height'
  },
  {
    'side': 'left',
    'dimension': 'width'
  },
  {
    'side': 'bottom',
    'dimension': 'height'
  },
  {
    'side': 'right',
    'dimension': 'width'
  }
]
var DIMENSIONS = ['height', 'width']
//@Todo: get actual viewport

var OFFSET_BREAKPOINTS = [
  {
    'offset': 'touching',
    'upperLimit': 0.03
  },
  {
    'offset': 'adjacent',
    'upperLimit': 0.10
  },
  {
    'offset': 'near',
    'upperLimit': 0.30
  },
  {
    'offset': 'far',
    'upperLimit': 1
  },
  {
    'offset': 'outside',
    'upperLimit': Number.MAX_VALUE
  }
]

var SIZE_BREAKPOINTS = [
  {
    'size': 'tiny',
    'upperLimit': 0.03
  },
  {
    'size': 'small',
    'upperLimit': 0.10
  },
  {
    'size': 'medium',
    'upperLimit': 0.30
  },
  {
    'size': 'large',
    'upperLimit': 0.50
  },
  {
    'size': 'x-large',
    'upperLimit': 1
  },
  {
    'size': 'xx-large',
    'upperLimit': Number.MAX_VALUE
  }
]

var REPEAT_MAX_DIFFERENCE = {
  width: 0.2,
  height: 0.2
}
/**
 * Main Method
 */
chrome.extension.onMessage.addListener(function(request, send, sendResponse) {
  //make sure it's a decode action
  if(request.action !== 'decode') {
    return
  }
  
  var input= null
  if(LAST_ENCODED_DESCRIPTION) {
    input = LAST_ENCODED_DESCRIPTION
  } else {
    // var input = JUMBOTRON_H1
    input = COL_MD_4_2
  }
  
  console.log('Input: ')
  console.log(input)
  
  input = topologicalSort(input)
  
  var elements = {}
  var currentMatches
  for(var i = 0; i < input.length; i++) {
    currentMatches = findElements(input[i], elements, VIEWPORT_SIZE)
    elements[input[i].uniqueSelector] = currentMatches
    if(currentMatches.length > 0) {
      for(var j = 0; j < currentMatches.length; j++) {
        var currentMatch = $(currentMatches[j])
        currentMatch.css('border', '2px solid red')
      }
    } else {
      console.log('element failed to be found. Decoding aborted: ' + input[i].uniqueSelector)
      break;
    }
  }
  if(currentMatches && currentMatches.length > 0) {
    for(var j = 0; j < currentMatches.length; j++) {
      var currentMatch = $(currentMatches[j])
      currentMatch.css('border', '2px solid green')
    }
  }
})

/**
 * Topologically sorts elements so that there's no dependency issues
 * @Todo: currently O(n^2) so could be improved
 */
function topologicalSort(elements) {
  var sortedInput = []
  var sortedElements = {}
  
  var i
  for(i = 0; elements.length > 0 && i < elements.length; i++) {
    var element = elements[i]
    if(parentsInMap(element, sortedElements)) {
      sortedInput.push(element)
      sortedElements[element.uniqueSelector] = 1
      elements.splice(i, 1)
      //reset i
      i = -1
    }
  }
  if(elements.length > 0) {
    throw 'Elements can\'t be sorted topologically'                   
  }
  return sortedInput
}

/**
 * Helper method for topologicalSort that checks if all the element's parents are in the map
 */
function parentsInMap(element, map) {
  var anchorsMap = {}
  var offsets = element.offsets
  for(var i = 0; i < offsets.length; i++) {
    var anchor = offsets[i].anchor
    if(anchor !== VIEWPORT_KEYWORD) {
      anchorsMap[anchor] = 1
    }
  }
  var sizes = element.sizes
  for(var i = 0; i < sizes.length; i++) {
    var anchor = sizes[i].anchor
    if(anchor !== VIEWPORT_KEYWORD) {
      anchorsMap[anchor] = 1
    }
  }
  var anchors = Object.keys(anchorsMap)
  for(var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i]
    if(!(anchor in map) && anchor !== VIEWPORT_KEYWORD) {
      return false
    }
  }
  return true
}

function findElements(elementDescription, elements, viewportDimensions) {
  var current = $('body')
  var foundElements = findElementsRecursive(current, elementDescription, elements, viewportDimensions)
  if(!elementDescription.grid.value) {
    return foundElements
  }
  
  //find the grid siblings
  var elementsWithGridSiblings = []
  for(var i = 0; i < foundElements.length; i++) {
    var foundElement = foundElements[i]
    
    var siblings = foundElement.parent().children()
    var gridSiblings = siblings.filter(function(index, siblingNonJq) {
      var sibling = $(siblingNonJq)
      var matchingTagName = sibling.tagName === foundElement.tagName
      var matchingWidth = Math.abs(sibling.width() - foundElement.width())/foundElement.width() <=   REPEAT_MAX_DIFFERENCE.width
      var matchingHeight = Math.abs(sibling.height() - foundElement.height())/foundElement.height() <= REPEAT_MAX_DIFFERENCE.height
      return matchingTagName && matchingWidth && matchingHeight
      })
    var elementsWithGridSiblings = elementsWithGridSiblings.concat(gridSiblings.toArray())
    
  }
  return elementsWithGridSiblings
}

function findElementsRecursive(current, elementDescription, elements, viewportDimensions) {
  var matches = []
  //check this element
  if(isElement(current, elementDescription, elements, viewportDimensions)) {
    matches.push(current)
    return matches
  }
  //check children
  var children = current.children()
  for(var i = 0; i < children.length; i++) {
    var child = $(children[i])
    var match = findElementsRecursive($(child), elementDescription, elements, viewportDimensions)
    if(match.length > 0) {
      matches = $.merge(matches,match)
    }
  }
  return matches
}

function isElement(candidate, elementDescription, elements, viewportDimensions) {
  //match offsets
  if(!offsetsMatch(candidate, elementDescription, elements, viewportDimensions)) return false
  //match sizes
  if(!sizesMatch(candidate, elementDescription, elements, viewportDimensions)) return false
  //@Todo: match others
  return offsetsMatch
}

function offsetsMatch(candidate, elementDescription, elements, viewportDimensions) {
  //get all relevant anchors in 2d array
  var anchorOffsetOptions = {}
  var descriptionOffsets = elementDescription.offsets
  for(var descriptionIndex = 0; descriptionIndex < descriptionOffsets.length; descriptionIndex++) {
    var descriptionOffset = descriptionOffsets[descriptionIndex]
    var anchorTag = descriptionOffset.anchor
    
    var anchorOffsets = []
    if(anchorTag === VIEWPORT_KEYWORD) {
      anchorOffsets.push(VIEWPORT_OFFSET)
    } else {
      var anchorElements = elements[anchorTag]
      for(var descriptionIndex = 0; descriptionIndex < anchorElements.length; descriptionIndex++) {
        anchorOffsets.push(utility.getOffsets(anchorElements[descriptionIndex]))
      }
    }
    anchorOffsetOptions[anchorTag] = anchorOffsets
  }
  //for loop incrementing through every combination
  //  if it matches on any of the combinations, then return true
  for(
    var anchorIndexes = initializeZeroArray(Object.keys(anchorOffsetOptions).length);
    anchorIndexes;
    anchorIndexes = getNextOffsetIndexes(anchorOffsetOptions, anchorIndexes)
    ) {
      var failAnyTests = false
      //this combination must satisfy all parts of the descriptionOffsets
      for(var descriptionIndex = 0; descriptionIndex < descriptionOffsets.length; descriptionIndex++) {
        var descriptionOffset = descriptionOffsets[descriptionIndex]
        
        var anchorOffsets
        var anchorTag = descriptionOffset.anchor
        if(anchorTag === VIEWPORT_KEYWORD) {
          anchorOffsets = VIEWPORT_OFFSET
        } else {
          anchorOffsets = anchorOffsetOptions[anchorTag][anchorIndexes[descriptionIndex]]
        }
        //check if distance between anchor offset and the candidate's offsets align with the description
        var candidateOffset = utility.getOffsets(candidate)
        //check each edge
        for(var edgeIndex = 0; edgeIndex < EDGES.length; edgeIndex++) {
          var edge = EDGES[edgeIndex].side
          if(!descriptionOffset[edge]) continue
          
          //check actual value
          var dimension = EDGES[edgeIndex].dimension
          var anchorEdge = descriptionOffset[edge].anchorEdge
          var oppositeEdge = getOppositeEdge(edge)
          var offsetPixels = Math.abs(candidateOffset[edge] - anchorOffsets[anchorEdge])
          var oppositeOffsetPixels = Math.abs(candidateOffset[oppositeEdge] - anchorOffsets[anchorEdge])
          var offset = getOffsetValue(offsetPixels, viewportDimensions[dimension])
          if(oppositeOffsetPixels < offsetPixels || offset !== descriptionOffset[edge].value) {
            failAnyTests = true
            break
          }
        }
      }
      if(!failAnyTests) {
        return true
      }
  }
  return false
}

/**
 * returns an array of zeros
 */
function initializeZeroArray(length) {
  var indexes = []
  for(var i = 0; i < length; i++) {
    indexes.push(0)
  }
  return indexes    
}

/**
 * it will find an index to increment so as to give the next "combination"
 * if no number can be incremented, it'll return null instead
 */
function getNextOffsetIndexes(anchorOffsetOptions, oldIndexes) {
  //find a number to increment
  for(var i = 0; i < oldIndexes.length; i++) {
    var key = Object.keys(anchorOffsetOptions)[i]
    if(oldIndexes[i] < anchorOffsetOptions[key].length - 1) {
      oldIndexes[i]++
      return oldIndexes
    }
  }
  //no number could be incremented, so return null
  return null
}

function getOppositeEdge(edge) {
  switch(edge) {
    case 'top':
      return 'bottom'
    case 'bottom':
      return 'top'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    default:
      throw "Illegal Argument"
  }
}

function sizesMatch(candidate, elementDescription, elements, viewportDimensions) {
  var descriptionSizes = elementDescription.sizes
  for(var i = 0; i < descriptionSizes.length; i++) {
    var descriptionSize = descriptionSizes[i]
    //check height and width
    for(var j = 0; j < DIMENSIONS.length; j++) {
      var dimension = DIMENSIONS[j]
      
      var sizePixels = candidate[dimension]()
      var size = getSize(sizePixels, viewportDimensions[dimension])
      if(size !== descriptionSize[dimension]) return false
    }
  }
  return true
}

function getOffsetValue(pixels, viewportDimension) {
  var ratio = pixels/viewportDimension
  for(var i = 0; i < OFFSET_BREAKPOINTS.length; i++) {
    var breakpoint = OFFSET_BREAKPOINTS[i]
    if(ratio <= breakpoint.upperLimit) {
      return breakpoint.offset
    }
  }
}

function getSize(pixels, viewportDimension) {
  var ratio = pixels/viewportDimension
  
  for(var i = 0; i < SIZE_BREAKPOINTS.length; i++) {
    var breakpoint = SIZE_BREAKPOINTS[i]
    if(ratio <= breakpoint.upperLimit) {
      return breakpoint.size
    }
  }
}