# simple-data-table

[![npm version](https://badge.fury.io/js/simple-data-table.svg)](https://badge.fury.io/js/simple-data-table)
[![downloads count](https://img.shields.io/npm/dt/simple-data-table.svg)](https://www.npmjs.com/package/simple-data-table)
[![travis-ci](https://api.travis-ci.com/piecioshka/simple-data-table.svg?branch=master)](https://app.travis-ci.com/github/piecioshka/simple-data-table)

:hammer: Lightweight and simple data table with no dependencies

## Features

* :white_check_mark: Display any data (array with objects) in simple table layout
* :white_check_mark: Support custom skins _(style children of `div.simple-data-table`)_
* :white_check_mark: Small size of package
* :white_check_mark: No dependencies
* :white_check_mark: Support custom events (`on`, `emit`)
  * Updated cell content
  * Row removed
  * Row added
  * Sorted table
* :white_check_mark: Fluent API _(not available in all public methods)_
* :white_check_mark: API
  * Lazy loading of data (`load()`)
  * Read number of rows (`getRowsCount()`)
  * Get content from concrete cell (`getCell`)
  * Find cells which contains concrete text (`findCellsByContent()`)
  * Highlight cells (`highlightCell`, `clearHighlightedCells()`)
  * Support put value into single cell (`setInputCellContent()`)
  * Sorting by a concrete cell with a given function (`sortByColumn()`)
  * Define headers, as a first row (`setHeaders()`)
* :white_check_mark: Readonly Mode

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
const t = new SimpleDataTable($container, options);
t.load([
    {
        column1: 'Cell 1',
        column2: 'Cell 2',
        column3: 'Cell 3'
    },
    {
        column1: 'Cell 4',
        column2: 'Cell 5',
        column3: 'Cell 6'
    },
    {
        column1: 'Cell 7',
        column2: 'Cell 8',
        column3: 'Cell 9'
    },
    {
        column1: 'Cell 10',
        column2: 'Cell 11',
        column3: 'Cell 12'
    }
]);
t.render();
```

## Examples

![](./screenshots/example-1.png)

More examples: <https://piecioshka.github.io/simple-data-table/demo/>

## Options

#### `addButtonLabel` _(Default: '✚')_

Change value od button which add new row.

```js
const t = new SimpleDataTable($container, {
    addButtonLabel: 'New record'
});
t.load(...);
t.render();
```

#### `defaultColumnPrefix` _(Default: 'column')_

Define what "name" should have cells in new added columns.

```js
const t = new SimpleDataTable($container, {
    defaultColumnPrefix: 'random'
});
t.load(...);
t.render();
```

#### `defaultColumnNumber` _(Default: null)_

Define how much columns should contain row in empty table.

By default, use the size of headers or the number of cells in the first row.

```js
const t = new SimpleDataTable($container, {
    defaultColumnNumber: '7'
});
t.load(...);
t.render();
```

#### `defaultHighlightedCellClass` _(Default: 'highlighted-cell')_

Define class of highlighted cell.

```js
const t = new SimpleDataTable($container, {
    defaultHighlightedCellClass: 'my-highlight'
});
t.load(...);
t.render();
```

#### `readonly` _(Default: false)_

Define class of highlighted cell.

```js
const t = new SimpleDataTable($container, {
    readonly: true
});
t.load(...);
t.render();
```

## API

#### `render(): SimpleDataTable`

Render table into DOM.

#### `getRowsCount(): number`

Get number of rows.

#### `findCellsByContent( ...content: Array<string> ): Array<{ rowIndex: number, cellIndex: number }>`

Get list of cell positions which contains passed strings.

#### `getCell( rowIndex: number , cellIndex: number ): HTMLElement || null`

Get DOM reference of concrete cell.

#### `highlightCell( rowIndex: number, cellIndex: number )`

Add class to concrete cell.

#### `clearHighlightedCells()`

Remove CSS class of all highlighted cells.

#### `setInputCellContent( rowIndex: number, cellIndex: number, content: string )`

Put content into input in concrete cell.

#### `setHeaders( items: Array<string> )`

Setup column headers. Sorting is enabled by default.

#### `load( data: Array<object> )`

Loading data into table component.

#### `emit( name: string, payload: any )`

Trigger event on SimpleDataTable instance.

#### `on( name: string, handler: Function )`

Listen on events.

#### `sortByColumn( cellIndex : number, comparingFunction : Function )`

Sorts data and triggers `DATA_SORTED` event.

By default takes `cellIndex=0` and sorts as [`String.prototype.localeCompare`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).

**WARNING**: Function `sortByColumn()` runs `render()` under the hood.

## Events

#### `SimpleDataTable.EVENTS.UPDATE`

Event is dispatching when you change any of input in table.

```js
const t = new SimpleDataTable($container);
t.on(SimpleDataTable.EVENTS.UPDATE, (data) => {
    // do some stuff with the updated data...
});
```

#### `SimpleDataTable.EVENTS.ROW_ADDED`

Event is dispatching when you add new record.

```js
const t = new SimpleDataTable($container);
t.on(SimpleDataTable.EVENTS.ROW_ADDED, () => {
    // do some stuff...
});
```

#### `SimpleDataTable.EVENTS.ROW_REMOVED`

Event is dispatching when you remove any record.

```js
const t = new SimpleDataTable($container);
t.on(SimpleDataTable.EVENTS.ROW_REMOVED, () => {
    // do some stuff...
});
```

#### `SimpleDataTable.EVENTS.DATA_SORTED`

Event is dispatching after data is sorted with `sortByColumn` function.

```js
const t = new SimpleDataTable($container);
t.on(SimpleDataTable.EVENTS.DATA_SORTED, () => {
    // do some stuff...
});
```

## Static

#### `SimpleDataTable.clearElement( $element: HTMLElement )`

Recursive remove children from passed HTMLElement.

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
