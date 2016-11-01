var Element = function(selector, uniqueSelector) {
  this.selector = selector !== null ? selector : ""
  this.uniqueSelector = uniqueSelector !== null ? uniqueSelector : ""
  this.offsets = []
  this.sizes = []
  this.contents = []
  this.colors = []
  this.grid = {
    value: false
  }
}
