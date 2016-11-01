var Offset = function(anchor) {
  var offset = this
  this.anchor = anchor ? anchor : null
  this.top = null
  this.left = null
  this.bottom = null
  this.right = null

    var values = [
        {
            value: 'touching',
            min: -0.01,
            max: 0.03
        },
        {
            value: 'adjacent',
            min: 0.03,
            max: 0.10
        },
        {
            value: 'near',
            min: 0.10,
            max: 0.30
        },
        {
            value: 'far',
            min: 0.30,
            max: 1.00
        },
        {
            value: 'outside',
            min: 1.00,
            max: Number.MAX_VALUE
        }
    ]

  this.setDirection = function(direction, anchorEdge, percentage) {
    var value = new OffsetValue(anchorEdge, getValue(percentage))
    offset[direction] = value
  }

  this.hasValue = function() {
    return offset.top || offset.left || offset.bottom || offset.right
  }

  function getValue(percentage) {
    if (percentage < 0) {
      return null
    }
    for (var i = 0; i < values.length; i++) {
      var value = values[i]
      if (percentage > value.min && percentage <= value.max) {
        return value.value
      }
    }
    return null
  }
}
