# simple-data-table

[![npm version](https://badge.fury.io/js/simple-data-table.svg)](https://badge.fury.io/js/simple-data-table)
[![downloads count](https://img.shields.io/npm/dt/simple-data-table.svg)](https://www.npmjs.com/~piecioshka)
[![travis](https://img.shields.io/travis/piecioshka/simple-data-table.svg?maxAge=2592000)](https://travis-ci.org/piecioshka/simple-data-table)
[![dependencies](https://david-dm.org/piecioshka/simple-data-table.svg)](https://github.com/piecioshka/simple-data-table)

Lightweight and simple data table with no dependencies

## Features

* :checkered_flag: Display data (array with objects) in simple table
* :checkered_flag: Lazy loading of data (you can load data whenever you can)
* :checkered_flag: Support custom skins
* :checkered_flag: Small size of package
* :checkered_flag: No dependencies
* :checkered_flag: Support custom events (update, add, remove)
* :checkered_flag: Fluent API
* :construction: Recognize data in input and change input type

## Installation

```bash
npm install simple-data-table
```

```html
<link rel="stylesheet" href="src/skins/default.css"/>
<script src="src/index.js"></script>
```

```javascript
const $container = document.querySelector('#place-to-render');
const d = new SimpleDataTable($container, options);
d.load([
    {
        column1: 'Cell 1',
        column2: 'Cell 2',
        column3: 'Cell 3'
    },
    {
        column1: 'Cell 1 (row 2)',
        column2: 'Cell 2 (row 2)',
        column3: 'Cell 3 (row 2)'
    }
]);
d.render();
```

## Examples

![](./screenshots/example-1.png)

More examples: <https://piecioshka.github.io/simple-data-table/demo/>

## Options

#### `addButtonLabel` _(Default: '✚')_

Change value od button which add new row.

Example:

```js
const d = new SimpleDataTable($container, {
    addButtonLabel: 'New record'
});
d.load(...);
d.render();
```

#### `defaultColumnPrefix` _(Default: 'column')_

Define what "name" should have cells in new added columns.

Example:

```js
const d = new SimpleDataTable($container, {
    defaultColumnPrefix: 'random'
});
d.load(...);
d.render();
```

#### `defaultColumnNumber` _(Default: 3)_

Define how much columns should contain row in empty table. 

Example:

```js
const d = new SimpleDataTable($container, {
    defaultColumnNumber: '7'
});
d.load(...);
d.render();
```

## Events

#### `SimpleDataTable.EVENTS.UPDATE`

Events is dispatching when you change any of input in table.

Example:

```js
const d = new SimpleDataTable($container);
d.on(SimpleDataTable.EVENTS.UPDATE, () => {
    // do some stuff...
});
```

#### `SimpleDataTable.EVENTS.ROW_ADDED`

Events is dispatching when you add new record.

Example:

```js
const d = new SimpleDataTable($container);
d.on(SimpleDataTable.EVENTS.ROW_ADDED, () => {
    // do some stuff...
});
```

#### `SimpleDataTable.EVENTS.ROW_REMOVED`

Events is dispatching when you remove any record.

Example:

```js
const d = new SimpleDataTable($container);
d.on(SimpleDataTable.EVENTS.ROW_REMOVED, () => {
    // do some stuff...
});
```

## Tested browsers

* Safari v10.1.2
* Firefox v61.0.1
* Chrome v67.0.3396.99
* Opera v51.0.2830.40

## Unit tests

```bash
npm test
```

## Code coverage

Check code coverage with [Istanbul](https://github.com/gotwarlost/istanbul):

```bash
npm run coverage
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2018
