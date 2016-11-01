var ieh = {}

var GRID_SIBLING_MAX_HEIGHT_RATIO = 1.1
var GRID_SIBLING_MAX_WIDTH_RATIO = 1.1
var ADJACENT_INTERMEDIATE_LEEWAY = 5

ieh.inGrid = function(element) {
    //get parent's children (includes itself but that's fine)
    var children = element.parent().children()
    //if the parent has less than 3 children, return false
    if(children.length < 3) return false
    //check for each child
    for(var i = 0; i < children.length; i++) {
        var child = $(children.get(i))
        //tags match
        var matchingTags = child.prop('tagName') === element.prop('tagName')
        if(!matchingTags) return false
        //sizes are close
        var heightRatio = Math.max(child.height()/element.height(),element.height()/child.height())
        var widthRatio = Math.max(child.width()/element.width(),element.width()/child.width())
        if(heightRatio > GRID_SIBLING_MAX_HEIGHT_RATIO) return false
        if(widthRatio > GRID_SIBLING_MAX_WIDTH_RATIO) return false
    }
    //return true
    return true
}

ieh.getGrid = function(element) {
    return element.parent()
}


//get similar items 
ieh.getGridChildren = function(element) {
    return element.parent().children()
}

ieh.getSimlarTargets = function(similarItems, target) {
    queue = []
    res = []
    var level = 0
    for (var i = 0; i < similarItems.length; i++) {
        var similarItem = $(similarItems.get(i))  //normal jquery object
        queue.push(similarItem)
    }
    
    while (queue.length > 0 && level < 3) {   //depth limit search for only three levels 
        level = level + 1
        for ( var count = 0; count < queue.length; count ++) {
            var item = queue.shift() 
            if (ieh.similar(item, target) == true) {
                res.push(item)
            }
            else if (item.children().length > 0) {
                var children = item.children()
                for(var i = 0; i < children.length; i++) {
                    var child = $(children.get(i))
                    queue.push(child)
                }
            }
        }
    }
    return res
}

ieh.similar = function(item, target) {
    var matchingTags = item.prop('tagName') === target.prop('tagName')  
    console.log("enter")
    if(!matchingTags) return false
    //sizes are close
    var heightRatio = Math.max(item.height()/target.height(),target.height()/item.height())
    var widthRatio = Math.max(item.width()/target.width(),target.width()/item.width())
    if(heightRatio > GRID_SIBLING_MAX_HEIGHT_RATIO) return false
    if(widthRatio > GRID_SIBLING_MAX_WIDTH_RATIO) return false
    console.log("go to true")
    return true;
}



ieh.atTopOfContainer = function(element, side) {
    //see if element 1px above contains this element
    var currentOffset = utility.getOffsets(element)
    //make sure the possibleContainer is not itself
    var possibleContainer = element.parent()
    // do {
        // currentOffset[side]--
    //     possibleContainer = $(document.elementFromPoint(currentOffset.left, currentOffset.top))
    // } while(possibleContainer.is(element) && currentOffset[side] >= 0)
    //if you reach the top of the page then you probably don't have a container
    // if(currentOffset[side] < 0) return false
    
    //check if one is inside the other
    if(!contains(possibleContainer, element)) return false
    //make sure there's no elements in between here and the top of the container
    do {
        currentOffset[side]--
        var elementAtPoint = $(document.elementFromPoint(currentOffset.left, currentOffset.top))
        if(!elementAtPoint.is(possibleContainer)) return false
    } while(currentOffset[side] > utility.getOffsets(possibleContainer)[side])
    
    return true
}

function contains(haystack, needle) {
    var haystackSpacing = removeSpacing(haystack)
    var needleSpacing = removeSpacing(needle)
    
    var needleOffset = utility.getOffsets(needle)
    var haystackOffset = utility.getOffsets(haystack)
    
    var needleHeight = needle.height()
    var haystackHeight = haystack.height()
    
    var needleWidth = needle.width()
    var haystackWidth = haystack.width()
    var needleRightPoint = needleOffset.left + needleWidth
    var haystackRightPoint = haystackOffset.left + haystackWidth
    
    restoreSpacing(haystack, haystackSpacing)
    restoreSpacing(needle, needleSpacing)
    
    if(needleOffset.top < haystackOffset.top) return false
    if(needleOffset.left < haystackOffset.left) return false
    
    
    if(needleOffset.top + needleHeight > haystackOffset.top + haystackHeight) return false
    
    
    if(needleRightPoint > haystackRightPoint) return false
    
    return true
}

function removeSpacing(element) {
    var spacing = {}
    //save
    spacing.margin = element.css('margin')
    spacing.padding = element.css('padding')
    spacing.border = element.css('border')
    //remove
    element
        .css('margin', 0)
        .css('padding', 0)
        .css('border', 'none')
    //return for restoration later
    return spacing
}

function restoreSpacing(element, spacing) {
    spacing.margin = element.css('margin', spacing.margin)
    spacing.padding = element.css('padding', spacing.padding)
    spacing.border = element.css('border', spacing.border)
}

ieh.getContainer = function(element, side) {
    return element.parent()
}

ieh.getAdjacent = function(element, side) { 
    var currentOffset = utility.getOffsets(element)
    var dimension = encoderUtility.getDimension(side)

    var reachedEdge = false
    var distanceFromPrevious = 0
    
    var intermediate;
    while(!isValidIntermediate(intermediate, currentOffset, side, dimension) && !reachedEdge) {
        currentOffset[side]--
        reachedEdge = currentOffset[side] < 0
        distanceFromPrevious++
        
        var intermediateElement = document.elementFromPoint(currentOffset.left, currentOffset.top)
        if(intermediateElement) {
            intermediate = $(intermediateElement)
        }
    }
    
    if(reachedEdge) {
        //didn't find an intermediate
        return null;
    }
    
    //find largest parent that's still an intermediate
    for(var candidate = intermediate.parent(); isValidIntermediate(candidate, currentOffset, side, dimension);) {
            intermediate = candidate
            candidate = candidate.parent()
    }
    //return adjacent intermediate
    return intermediate
}

var isValidIntermediate = function(intermediate, currentOffset, side, dimension) {
    if(!intermediate || !currentOffset || !side || !dimension) return false
    var intermediateExtremePoint = utility.getOffsets(intermediate)[side] + intermediate[dimension]()
    var currentOffsetSide = currentOffset[side] + ADJACENT_INTERMEDIATE_LEEWAY
    //addedleeway tentatively since it seems like offset calculations can be off.
    return intermediateExtremePoint < currentOffsetSide
}

ieh.getUniqueSelector = function(jqElement) {
    var classes = jqElement.attr('class').split(/\s+/)
    for(var i = 0; i < classes.length; i++) {
        var c = classes[i]
        if(c.substring(0, 4) === 'uid-') {
            return c
        }
    }
}

/**
 * attempts to get the offset from an element with such an anchor. if none exists, null is returned
 */
ieh.getElementOffsetAnchor = function(element, anchor) {
    for(var offsetIndex in element.offsets) {
        var offset = element.offsets[offsetIndex]
        if(offset.anchor === anchor) {
            return offset
        }
    }
    return null
}