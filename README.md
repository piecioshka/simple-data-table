# simple-data-table

[![npm version](https://badge.fury.io/js/simple-data-table.svg)](https://badge.fury.io/js/simple-data-table)
[![downloads count](https://img.shields.io/npm/dt/simple-data-table.svg)](https://www.npmjs.com/~piecioshka)
[![travis](https://img.shields.io/travis/piecioshka/simple-data-table.svg)](https://travis-ci.org/piecioshka/simple-data-table)
[![coveralls](https://coveralls.io/repos/github/piecioshka/simple-data-table/badge.svg?branch=master)](https://coveralls.io/github/piecioshka/simple-data-table?branch=master)

:hammer: Lightweight and simple data table with no dependencies

## Features

* :white_check_mark: Display data (array with objects) in simple table
* :white_check_mark: Lazy loading of data (you can load data whenever you can)
* :white_check_mark: Support custom skins
* :white_check_mark: Small size of package
* :white_check_mark: No dependencies
* :white_check_mark: Support custom events (update, add, remove)
* :white_check_mark: Fluent API
* :white_check_mark: API: Find cells with content
* :white_check_mark: API: Highlight cells
* :white_check_mark: API: Support put value into single cell

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

#### `defaultHighlightedCellClass` _(Default: 'highlighted-cell')_

Define class of highlighted cell.Example:

```js
const d = new SimpleDataTable($container, {
    defaultHighlightedCellClass: 'my-highlight'
});
d.load(...);
d.render();
```

## API

#### `render(): SimpleDataTable`

Render table into DOM.

#### `getRowsCount(): number`

Get number of rows.

#### `findCellsByContent(...content): Array<{ rowIndex: number, cellIndex: number }>`

Get list of cell positions which contains passed strings.

#### `getCell( rowIndex: number , cellIndex: number ): HTMLElement || null`

Get DOM reference of concrete cell.

#### `highlightCell( rowIndex: number, cellIndex: number )`

Add class to concrete cell.

#### `clearHighlightedCells()`

Remove CSS class of all highlighted cells.

#### `setInputCellContent( rowIndex: number, cellIndex: number, content: string )`

Put content into input in concrete cell.

#### `load( data: Array )`

Loading data into table component.

#### `emit( name: string, payload: any )`

Trigger event on SimpleDataTable instance.

#### `on( name: string, handler: Function )`

Listen on events.

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

```bash
npm run coverage
```

## License

[The MIT License](http://piecioshka.mit-license.org) @ 2018
