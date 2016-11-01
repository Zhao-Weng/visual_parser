var Size = function(anchor) {
  var size = this
  this.anchor = anchor ? anchor : ''
  this.height = null
  this.width = null
  var values = [
    {
      value: 'tiny',
      min: -0.01,
      max: 0.03
    },
    {
      value: 'small',
      min: 0.03,
      max: 0.10
    },
    {
      value: 'medium',
      min: 0.10,
      max: 0.30
    },
    {
      value: 'large',
      min: 0.30,
      max: 0.50
    },
    {
      value: 'x-large',
      min: 0.50,
      max: 1.00
    },
    {
        value: 'xx-large',
        min: 1.00,
        max: Number.MAX_VALUE
    }
  ]

  this.setHeight = function(percentage) {
    size.height = getValue(percentage)
  }

  this.setWidth = function(percentage) {
    size.width = getValue(percentage)
  }

  function getValue(percentage) {
    if(percentage < 0) {
      return null
    }

    for (var i = 0; i < values.length; i++) {
        var value = values[i]
        if(percentage > value.min && percentage <= value.max) {
            return value.value
        }
    }
    return null
  }
}
