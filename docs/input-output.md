# Expected Input and Output #

Although not yet implemented, this will be the input and output of the extension upon completion. Both the Input and Output rely on the concept of [Primitives](#primitives).

## Primitives ##

A primitive is a value that can be output as a value. For example, "Amazing Watch" or "$530" are examples of primitives. The product tile itself however, is not a primitive since it can't be represented as a value.

### Types ###

- Text
  - String
  - Number
- Image (URL)

## Input ##

The basic syntax for the input is a JavaScript object specifying which [Primitives](#primitives) are desired for a single entry. That single object is a valid input. Another valid input is an array of objects to signify that multiple elements are desired. The keys will become the table headers in the output, but are non-essential and could just be numbers if the user doesn't want to provide context.

### Example 1: Single Element ###

    {
      title: <TITLE DOM ELEMENT>,
      image: <IMAGE DOM ELMEENT>,
      price: <PRICE DOM ELEMENT>
    }

### Example 2: Multiple Elements ###

In this example, there can be two or more total elements. The user doesn't need to specify every single element manually, but rather just two.

    [
      {
        title: <A TITLE DOM ELEMENT>,
        image: <A IMAGE DOM ELMEENT>,
        price: <A PRICE DOM ELEMENT>
      },
      {
        title: <B TITLE DOM ELEMENT>,
        image: <B IMAGE DOM ELMEENT>,
        price: <B PRICE DOM ELEMENT>
      }
    ]

### Example 3: Multiple Elements Depending on Grid/List Elements ###

Imagine if each product tile had a list of tags, where there can be a variable number of tags from 1-n.

    [
      {
        title: <A TITLE DOM ELEMENT>,
        image: <A IMAGE DOM ELMEENT>,
        price: <A PRICE DOM ELEMENT>,
        tags: [
          <A TAG DOM ELEMENT 1>,
          <A TAG DOM ELEMENT 2>
        ]
      },
      {
        title: <B TITLE DOM ELEMENT>,
        image: <B IMAGE DOM ELMEENT>,
        price: <B PRICE DOM ELEMENT>,
        tags: [
          <B TAG DOM ELEMENT>
        ]
      }
    ]

## Output ##
Given the above input and a webpage, the output will be tables with each entry as a row and any one-to-many relational table represented in a manner similar to relational databases. The examples here will correspond to the example inputs above.

### Example 1: Single Element ###

| title              | image                       | price |
|--------------------|-----------------------------|-------|
| AmazonBasics Mouse | http://placehold.it/100x100 | 7.98  |

### Example 2: Multiple Elements ###

Note that even though only two elements were specified in the input, the output includes all other elements that are part of the grid/list.

| title              | image                       | price |
|--------------------|-----------------------------|-------|
| AmazonBasics Mouse | http://placehold.it/100x100 | 7.98  |
| Redragon M601      | http://placehold.it/100x100 | 13.99 |
| HAVIT HV_MS672     | http://placehold.it/100x100 | 8.66  |


### Example 3: Multiple Elements Depending on Grid/List Elements ###

Imagine if each product tile had a list of tags, where there can be a variable number of tags from 1-n.

#### Output Table 1 ####

| ID | title              | image                       | price |
|----|--------------------|-----------------------------|-------|
| 1  | AmazonBasics Mouse | http://placehold.it/100x100 | 7.98  |
| 2  | Redragon M601      | http://placehold.it/100x100 | 13.99 |
| 3  | HAVIT HV_MS672     | http://placehold.it/100x100 | 8.66  |

#### Output Table 2 #####

| Table 1 ID | tag           |
|------------|---------------|
| 1          | Amazon Basics |
| 1          | Prime         |
| 2          | Prime         |
| 3          | Prime         |
| 3          | Color LED     |
| 3          | Ergonomic     |
