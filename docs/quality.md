# Measuring Quality of a Visual Language Description #

The following are some quantitative attributes which can be used to objectively measure the quality of a visual language description.

1. [Precision](#precision)
* [Recall](#recall)
* [Volatility](#volatility)
* [Concision](#concision)

It should be noted that the measurement of the following metrics is dependent on the parser used to interpret the description. However, as long as the parser used is kept consistent, these measures of quality should remain useful.

---

## Precision

Precision is the measure of how many positively identified elements are actually relevant. The closer to 100%, the better.

**Precision = (True Positives) / (True Positives + False Positives)**

## Recall

Also known as Sensitivity/True Positive Rate/Hit Rate, Recall is the measure of how many elements that are relevant are actually positively identified. The closer to 100%, the better.

**Recall = (True Positives) / (Positives)**

## Volatility

Volatility is the measure of how the [intermediate elements](language-spec.md#terminology) change over each iteration of the site. This is requires historical data to measure. The fewer changes this element and is likely to receive, the more durable the description. The lower the Volatility, the better.

For example, the navigation bar's visual description probably has fewer value changes relative to that of a banner advertisement after each iteration of the website. The navigation bar may become taller or go from relatively positioned to fixed. The banner advertisement on the other hand may switch sides of the page or be removed completely. That makes the navigation bar a less "volatile" element to depend on relative to a banner advertisement.

**Description Volatility = Average of Intermediate Elements' Volatility**

**Element Volatility = Average Magnitude of Changes per Site Iteration**

Magnitude of Change in this case could be defined as the distance of changes in value. For example, a value that changes from "Touching" to "Near" would have a Magnitude of Change of 2.


## Concision

Concision is the measure of how many elements must be defined. It ultimately affects the performance of the parser and potentially the rest of the measures as well. The primary purpose of this metric is to omit intermediate elements that aren't relevant. The lower the Concision, the better.

**Concision = Number of Intermediate Elements**
