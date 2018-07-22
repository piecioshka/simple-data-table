# simple-data-table ([npm](https://www.npmjs.com/package/simple-data-table))

[![npm version](https://badge.fury.io/js/simple-data-table.svg)](https://badge.fury.io/js/simple-data-table)
[![downloads count](https://img.shields.io/npm/dt/simple-data-table.svg)](https://www.npmjs.com/~piecioshka)
[![travis](https://img.shields.io/travis/piecioshka/simple-data-table.svg?maxAge=2592000)](https://travis-ci.org/piecioshka/simple-data-table)

Lightweight and simple data table with no dependencies

## Installation

```bash
npm install simple-data-table
```

```html
<link rel="stylesheet" href="src/skins/default.css"/>
<script src="src/index.js"></script>
```

```javascript
const d = new SimpleDataTable(document.querySelector('#example-1'));
d.load(FIXTURE_2_ROWS);
d.render();
```

## Examples

More examples: <https://piecioshka.github.io/simple-data-table/demo/>

## Options

### `addButtonLabel` _(Default: '✚')_

Change value od button which add new row.

Example:

```js
const d = new SimpleDataTable($container, {
    addButtonLabel: 'Add new row'
});
d.load(...);
d.render();
```

### `defaultColumnPrefix` _(Default: 'column')_

Define what "name" should have cells in new added columns.

Example:

```js
const d = new SimpleDataTable($container, {
    defaultColumnPrefix: 'random'
});
d.load(...);
d.render();
```

### `defaultColumnNumber` _(Default: 3)_

Define how much columns should contain row in empty table. 

Example:

```js
const d = new SimpleDataTable($container, {
    defaultColumnNumber: '7'
});
d.load(...);
d.render();
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

Get code coverage ratio with [Istanbul](https://github.com/gotwarlost/istanbul):

```bash
npm run coverage
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2018
