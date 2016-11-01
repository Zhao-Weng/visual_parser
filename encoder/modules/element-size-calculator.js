var elementSizeCalculator = {}

elementSizeCalculator.calculateSizes = function(elements, viewportDimensions) {
    for(var i in elements) {
        var element = elements[i]
        
        var size = new Size('@viewport')
        var jqElement = $('.'+element.uniqueSelector);
        var widthPercentage = jqElement.width()/viewportDimensions.width
        size.setWidth(widthPercentage)
        
        var heightPercentage = jqElement.height()/viewportDimensions.height
        size.setHeight(heightPercentage)
        
        element.sizes.push(size)
    }
    return elements
}