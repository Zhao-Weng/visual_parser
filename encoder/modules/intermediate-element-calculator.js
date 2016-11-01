var intermediateElementCalculator = {}

intermediateElementCalculator.drawCornerCross = function(target) {
  target.addClass('visual-encoder-target')
  var offset = target.offset()
  //add vertical line
  $('body').prepend('<div class="visual-encoder-corner-cross vertical" style="left: ' + offset.left + 'px;"></div>')
  //add horizontal line
  $('body').prepend('<div class="visual-encoder-corner-cross horizontal" style="top: ' + offset.top + 'px;"></div>')
}

intermediateElementCalculator.calculateIntermediateElements = function(target, viewportDimensions) {
    prepareDocument()
    
    clearPreviousClasses()
    var rawElements = findIntermediateElements(target)
    var elements = createAllElements(rawElements, viewportDimensions)
    
    resetDocument()
    convertTemporaryClassesToStyledClasses()
    return elements
}

//clean up body for jquery
var body_margin, body_padding, body_border
var scroll_top
function prepareDocument() {
    var body = $(document.body)
    //save
    body_margin = body.css('margin')
    body_padding = body.css('padding')
    body_border = body.css('border')
    scroll_top = body.scrollTop()
    //delete
    body
        .css('margin', 0)
        .css('padding', 0)
        .css('border', 'none')
        .scrollTop(0)
}

//undo changes to body
function resetDocument() {
    var body = $(document.body)
    body
        .css('margin', body_margin)
        .css('padding', body_padding)
        .css('border', body_border)
        .scrollTop(scroll_top)
}

intermediateElementCalculator.clearStyles = function() {
    clearPreviousClasses()
}

function clearPreviousClasses() {
  $('.visual-encoder-target').removeClass('visual-encoder-target')
  $('.visual-encoder-intermediate-grid').removeClass('visual-encoder-intermediate-grid')
  $('.visual-encoder-intermediate-container').removeClass('visual-encoder-intermediate-container')
  $('.visual-encoder-intermediate-adjacent').removeClass('visual-encoder-intermediate-adjacent')
  $('.visual-encoder-intermediate-similar').removeClass('visual-encoder-intermediate-similar')
  $('.visual-encoder-corner-cross').remove()
  $('.encoder-intermediate').removeClass('encoder-intermediate') 
}

function convertTemporaryClassesToStyledClasses() {
  $('.visual-encoder-intermediate-grid-temp')
    .addClass('visual-encoder-intermediate-grid')
    .removeClass('visual-encoder-intermediate-grid-temp')
  $('.visual-encoder-intermediate-container-temp')
    .addClass('visual-encoder-intermediate-container')
    .removeClass('visual-encoder-intermediate-container-temp')
  $('.visual-encoder-intermediate-adjacent-temp')
    .addClass('visual-encoder-intermediate-adjacent')
    .removeClass('visual-encoder-intermediate-adjacent-temp')
    $('.visual-encoder-intermediate-similar-temp')
    .addClass('visual-encoder-intermediate-similar')
    .removeClass('visual-encoder-intermediate-similar-temp')
    $('.visual-encoder-similar-target-temp')
    .addClass('visual-encoder-similar-target')
    .removeClass('visual-encoder-similar-target-temp')
}

function findIntermediateElements(target) {
    //using an object to behave like a set
    var intermediates = {}
    //add self to intermediates
    storeIntermediate(target, intermediates)
    
    encoderUtility.SIDES.forEach(function(side) {
        //initialize current to the target
        var current = intermediates[ieh.getUniqueSelector(target)]
        //while we aren't at the extreme edge
        while(current && current.offset()[side] > 0) {
            var previous = current
            var similarItems, similarTargets
            var previousInsideCurrent = null
            if(ieh.inGrid(current)) {
                similarItems = ieh.getGridChildren(current)  //get similar items 
                similarItems.addClass('visual-encoder-intermediate-similar-temp')  //array-like jquery object 
                similarTargets = ieh.getSimlarTargets(similarItems, target)
                for ( var i = 0; i < similarTargets.length; i++) {    //array of jquery objects 
                    (similarTargets[i]).addClass('visual-encoder-similar-target-temp')
                }
                current = ieh.getGrid(current)
                current.addClass('visual-encoder-intermediate-grid-temp')
                previousInsideCurrent = true
            } else if(ieh.atTopOfContainer(current, side)) {
                current = ieh.getContainer(current, side)
                current.addClass('visual-encoder-intermediate-container-temp')
                previousInsideCurrent = true
            } else {
                current = ieh.getAdjacent(current, side)
                if(current) current.addClass('visual-encoder-intermediate-adjacent-temp')
                previousInsideCurrent = false
            }
            
            if(!current) {
                //done with this side
                continue
            }
            
            if(!current.hasClass('encoder-intermediate')) {
                //new
                storeIntermediate(current, intermediates)
            } else {
                //get existing
                var uniqueSelector = ieh.getUniqueSelector(current)
                current = intermediates[uniqueSelector]
            }
            
            //set previous's offsets
            var anchorEdge = previousInsideCurrent ? side : encoderUtility.getOppositeDirection(side)
            var previousOffsets = utility.getOffsets(previous)
            var currentOffsets = utility.getOffsets(current) 
            var distance = previousOffsets[side] - currentOffsets[anchorEdge]
            var sideValue = {
                anchorEdge: anchorEdge,
                value: distance
            }    
            var offset = {
                anchor: current.uniqueSelector
            }
            offset[side] = sideValue
            intermediates[previous.uniqueSelector].offsets.push(offset)
        }
    })
    
    return intermediates
}

function storeIntermediate(jqElement, intermediates) {
    jqElement.uniqueSelector = encoderUtility.generateUniqueSelector(jqElement)
    jqElement.selector = encoderUtility.getIdentifier(jqElement)
    jqElement.offsets = []
    intermediates[jqElement.uniqueSelector] = jqElement
}

function createAllElements(rawElements, viewportDimensions) {
    var elements = []
    for(var rawElementsKey in rawElements) {
        var rawElement = rawElements[rawElementsKey]
        var element = new Element(rawElement.selector, rawElement.uniqueSelector)
        for(var rawOffsetKey in rawElement.offsets) {
            var rawOffset = rawElement.offsets[rawOffsetKey]
            var anchor = rawOffset.anchor
            
            var offset = null
            var elementOffsetWithAnchor = ieh.getElementOffsetAnchor(element, anchor)
            if(elementOffsetWithAnchor) {
                offset = elementOffsetWithAnchor
            } else {
                offset = new Offset(anchor)
            }
            for(var side in rawOffset) {
                //filter out the anchor key
                if(side === 'anchor') {
                    continue
                }
                var direction = side
                var anchorEdge = rawOffset[side].anchorEdge
                var dimension = encoderUtility.getDimension(side)
                var percentage = rawOffset[side].value / viewportDimensions[dimension]
                offset.setDirection(direction, anchorEdge, percentage)
            }
            //only add offset if it's new
            if(!elementOffsetWithAnchor) {
                element.offsets.push(offset)
            }
        }
        elements.push(element)
    }
    return elements
}