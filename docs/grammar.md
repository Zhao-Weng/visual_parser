# Visual Language Grammar for Webpages #

 A description of a webpage should follow the [Language Spec](language-spec.md). It should also adhere to the following rules.

1. There should always be a reference to the top left element on the page. We'll call this the initial anchor.
  * This element will be the first element found and used as a reference to find all other Elements
* If the initial anchor isn't above and/or to the left of the primary element, intermediate elements should be defined such that a top most anchor above the primary element and a left most anchor to the left of the primary element are defined.
* Intermediate elements should be chosen such that they are as large as possible to minimize the number of elements that need to be defined.
* Elements that are part of lists, grids, or tables should have their positions noted as part of a list or grid contained by another element instead of finding top and left intermediates.
