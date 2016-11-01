var encoderUtility = {}

encoderUtility.SIDES = ['top', 'left']

encoderUtility.getDimension = function(direction) {
        switch (direction) {
            case 'top':
            case 'bottom':
                return 'height'
            case 'left':
            case 'right':
                return 'width'
            default:
                return null
        }
    }

encoderUtility.getOppositeDirection = function(direction) {
    switch (direction) {
        case 'top':
            return 'bottom'
        case 'bottom':
            return 'top'
        case 'left':
            return 'right'
        case 'right':
            return 'left'
        default:
            return null;
    }
}

encoderUtility.getIdentifier = function(element) {
    return element.attr('class') ? element.attr('class') : element.prop('tagName')
}

encoderUtility.uniqueIdCounter = 0
encoderUtility.generateUniqueSelector = function(jqElement) {
    var uid = 'uid-' + encoderUtility.uniqueIdCounter++
    jqElement.addClass('encoder-intermediate')
    jqElement.addClass(uid)
    return uid
}

function cssDimToInt(dim) {
    return parseInt(dim, 10)
}