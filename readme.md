# Website Encoder Extension#

This Chrome Extension takes a website and elements as an input and tries to extract any elements specified and store their relative visual attributes for later identification, even if the site structure changes moderately. The goal is to enable more robust scraping that recognizes elements by their size, shape, and location rather than position in the DOM tree. Specifications for the visual language are [here](docs/language-spec.md).

## Requirements ##

* Chrome

## Installation Instructions ##
1. Clone this repository
* Open Chrome
* Navigate to `chrome://extensions`
* Enable `Developer mode` in the top right corner
* Click `Load unpacked extensions...`
* Open this repository

## Usage Instructions ##
Once installed, you can right click on an element you want to encode and then select `Visually Encode`. The encoded JSON will be then printed to the console.
