'use strict';

const test = require('ava');

const jsdom = require('jsdom');
const window = global.window = new jsdom.JSDOM().window;
const document = global.document = window.document;

const { SimpleDataTable } = require('../../src/index');
const { DUMMY_3_ROWS } = require('../dummies/3-rows');

let $target;

test.beforeEach(() => {
    $target = document.createElement('div');
});

test('should be a class', (assert) => {
    assert.regex(String(SimpleDataTable), /^class/);
});

test('clear passed container', (assert) => {
    $target.innerHTML = '<p>aaa</p>';
    assert.is($target.children.length, 1);
    assert.not($target.querySelector('p'), null);

    const t = new SimpleDataTable($target);
    t.render();
    assert.is($target.children.length, 1);
    assert.is($target.querySelector('p'), null);
});

test('not passed $target', (assert) => {
    const err = assert.throws(() => {
        const t = new SimpleDataTable();
        t.render();
    });
    assert.is(err.name, 'Error');
});

test('lazy load data', (assert) => {
    const t = new SimpleDataTable($target);
    assert.is(t.data.length, 0);

    t.load(DUMMY_3_ROWS);
    assert.is(t.data.length, 3);
    assert.not(t.data, DUMMY_3_ROWS);
});

test('render loaded data into DOM', (assert) => {
    const t = new SimpleDataTable($target);
    t.load(DUMMY_3_ROWS);
    t.render();

    assert.is($target.querySelectorAll('tr').length, DUMMY_3_ROWS.length);
});

test('add new record after clicking a button', (assert) => {
    const t = new SimpleDataTable($target);
    t.render();

    assert.is($target.querySelectorAll('tr').length, 0);

    const $addButton = $target.querySelector('button.add-row');
    assert.true($addButton instanceof window.HTMLElement);

    t.on(SimpleDataTable.EVENTS.ROW_ADDED, () => {
        assert.is($target.querySelectorAll('tr').length, 1);
    });
    $addButton.dispatchEvent(new window.Event('click'));
});

test('trigger custom event after changed data', (assert) => {
    const t = new SimpleDataTable($target);
    t.load([
        {
            foo: 'bar'
        }
    ]);
    t.render();
    assert.deepEqual(t.data[0].foo, 'bar');

    t.on(SimpleDataTable.EVENTS.UPDATE, (data) => {
        assert.deepEqual(t.data, data);
    });

    $target.querySelector('input').value = 'xxx';
    $target.querySelector('input')
        .dispatchEvent(new window.Event('change'));
    assert.deepEqual(t.data[0].foo, 'xxx');
});

test('support fluent API', (assert) => {
    let updates = 0;

    new SimpleDataTable($target)
        .render()
        .setHeaders([])
        .load([])
        .on(SimpleDataTable.EVENTS.UPDATE, () => updates++)
        .on(SimpleDataTable.EVENTS.UPDATE, () => updates++)
        .emit(SimpleDataTable.EVENTS.UPDATE)
        .render();

    assert.is(updates, 2);
});

test('add button text should be configurable', (assert) => {
    const label = 'Załaduj';
    const t = new SimpleDataTable($target, {
        addButtonLabel: label
    });
    t.render();
    const $addButton = $target.querySelector('button.add-row');
    assert.is($addButton.textContent, label);
});

test('removing row should be possible', (assert) => {
    const t = new SimpleDataTable($target);
    t.load([{ foo: 'bar' }]);
    t.render();

    const $removeButton = t.$el.querySelector('button.remove-row');
    assert.true($removeButton instanceof window.HTMLElement);
    assert.not($removeButton.textContent, '');
});

test('API: function to get rows count', (assert) => {
    const t = new SimpleDataTable($target);
    t.load([{ foo: 'bar' }]);
    t.render();

    assert.is(t.getRowsCount(), 1);
    t.load([{ foo: 'bar' }, { baz: 'boo' }]);
    assert.is(t.getRowsCount(), 1);
    t.render();
    assert.is(t.getRowsCount(), 2);
});

test('remove row after click button', (assert) => {
    const t = new SimpleDataTable($target);
    t.load([{ foo: 'bar' }]);
    t.render();

    assert.is(t.getRowsCount(), 1);
    assert.is(t.data.length, 1);

    const $removeButton = t.$el.querySelector('button.remove-row');
    $removeButton.dispatchEvent(new window.Event('click'));

    assert.is(t.getRowsCount(), 0);
    assert.is(t.data.length, 0);
});

test('just added row should have remove button', (assert) => {
    const t = new SimpleDataTable($target);
    t.load([{ foo: 'bar' }]);
    t.render();

    const $addButton = t.$el.querySelector('button.add-row');
    $addButton.dispatchEvent(new window.Event('click'));

    const buttonsNumber = t.$el.querySelectorAll('button.remove-row').length;
    assert.is(buttonsNumber, 2);
});

test('remove row action should trigger custom event', (assert) => {
    assert.plan(1);

    const t = new SimpleDataTable($target);
    t.load([{ foo: 'bar' }]);
    t.render();

    const $removeButton = $target.querySelector('button.remove-row');

    t.on(SimpleDataTable.EVENTS.ROW_REMOVED, (data) => {
        assert.deepEqual(t.data, data);
    });

    $removeButton.dispatchEvent(new window.Event('click'));
});

test('default number of columns should be configurable', (assert) => {
    const t = new SimpleDataTable($target, {
        defaultColumnNumber: 5
    });
    t.render();

    const $addButton = $target.querySelector('button.add-row');
    $addButton.dispatchEvent(new window.Event('click'));

    const $firstRow = t.$el.querySelector('tr');
    const $cells = $firstRow.querySelectorAll('td');
    const $cellsWithInput = [...$cells]
        .map($cell => $cell.querySelector('input'))
        .filter($element => $element);

    assert.is($cellsWithInput.length, 5);
});

test("in readonly mode there is no buttons", (assert) => {
    const t = new SimpleDataTable($target, {
        readonly: true,
    });
    t.render();

    const $addButton = $target.querySelector("button.add-row");
    const $removeButton = $target.querySelector("button.remove-row");

    assert.is($addButton, null);
    assert.is($removeButton, null);
});

test("in readonly mode inputs are disabled", (assert) => {
    const t = new SimpleDataTable($target, {
        readonly: true,
    });
    t.load([{ foo: 'bar' }]);
    t.render();

    const $firstInput = $target.querySelector("input");
    assert.is($firstInput.disabled, true);
});

test('API: find cells', (assert) => {
    const t = new SimpleDataTable($target, {
        defaultColumnNumber: 5
    });
    t.load([{ foo: 'bar' }, { foo: 'bar2' }]);
    t.render();

    const indexes1 = t.findCellsByContent('bar2');
    assert.is(indexes1.length, 1);

    const indexes2 = t.findCellsByContent('bar');
    assert.is(indexes2.length, 1);

    const indexes3 = t.findCellsByContent('not exist');
    assert.is(indexes3.length, 0);

    t.load([{ foo: 'bar' }, { foo: 'bar' }]);
    t.render();

    const indexes4 = t.findCellsByContent('bar');
    assert.is(indexes4.length, 2);
});

test('API: get DOM reference of cell', (assert) => {
    const t = new SimpleDataTable($target, {
        defaultColumnNumber: 5
    });
    t.load([{ foo: 'bar' }, { foo: 'bar2' }]);
    t.render();

    const $cell = t.getCell(1, 0);
    assert.is($cell.firstElementChild.value, 'bar2');

    const $notExistedCellInRow = t.getCell(0, 99);
    assert.is($notExistedCellInRow, null);

    const $notExistedCellAtAll = t.getCell(99, 99);
    assert.is($notExistedCellAtAll, null);
});

test('API: highlight cell by add special CSS class', (assert) => {
    const t = new SimpleDataTable($target, {
        defaultColumnNumber: 5,
        defaultHighlightedCellClass: 'cookie'
    });
    t.load([{ foo: 'bar' }]);
    t.render();

    t.highlightCell(0, 0);
    const $cell = t.getCell(0, 0);
    assert.true($cell.classList.contains('cookie'));
});

test('API: clear highlighted cells', (assert) => {
    const t = new SimpleDataTable($target, {
        defaultColumnNumber: 5,
        defaultHighlightedCellClass: 'cookie'
    });
    t.load([{ foo: 'bar' }]);
    t.render();

    t.highlightCell(0, 0);
    const $cell = t.getCell(0, 0);
    assert.true($cell.classList.contains('cookie'));

    t.clearHighlightedCells();
    assert.false($cell.classList.contains('cookie'));
});

test('API: set content into cell', (assert) => {
    const t = new SimpleDataTable($target);
    t.load([{ foo: 'bar' }]);
    t.render();

    const $cell = t.getCell(0, 0);
    assert.is($cell.firstElementChild.value, 'bar');

    t.setInputCellContent(0, 0, 'baz');
    assert.is($cell.firstElementChild.value, 'baz');
});

test('API: function to set headers', (assert) => {
    const t = new SimpleDataTable($target);
    t.setHeaders(['Id', 'Value']);
    t.load([{
        id: 'ghi',
        val: 100,
    }, {
        id: 'xyz',
        val: 1000
    }, {
        id: 'abc',
        val: 10
    }]);
    t.render();

    const $header = t.$el.querySelector('thead');
    assert.not($header, null);
    assert.is($header.querySelector('th:nth-child(1)').textContent.trim(), 'Id');
    assert.is($header.querySelector('th:nth-child(2)').textContent.trim(), 'Value');
});

test('click on headers will sort the table', (assert) => {
    const t = new SimpleDataTable($target);
    t.setHeaders(['Id', 'Value']);
    t.load([
        { id: 'b', val: 1, },
        { id: 'c', val: 3, },
        { id: 'a', val: 2, },
    ]);
    t.render();

    const $header = t.$el.querySelector('thead');
    const $firstHeaderCell = $header.querySelector('th:nth-child(1)');
    $firstHeaderCell.dispatchEvent(new window.Event('click'));

    assert.deepEqual(t.data, [
        { id: 'c', val: 3, },
        { id: 'b', val: 1, },
        { id: 'a', val: 2, },
    ]);

    const $secondHeaderCell = $header.querySelector('th:nth-child(2)');
    $secondHeaderCell.dispatchEvent(new window.Event('click'));

    assert.deepEqual(t.data, [
        { id: 'c', val: 3, },
        { id: 'a', val: 2, },
        { id: 'b', val: 1, },
    ]);
});

test('when defaultColumnNumber is not defined use headers number', (assert) => {
    const t = new SimpleDataTable($target);
    t.setHeaders(['a', 'b', 'c', 'd']);
    t.render();

    const $addButton = $target.querySelector('button.add-row');
    $addButton.dispatchEvent(new window.Event('click'));

    assert.is(t.$el.querySelectorAll('tbody td input[name^="column"]').length, 4);
});

test('when defaultColumnNumber & headers number are not defined use first row of data', (assert) => {
    const t = new SimpleDataTable($target);
    t.load([
        { name: 'John', surname: 'Brown', age: 16, car: 'Ferrari', hight: 186 },
    ]);
    t.render();

    const $addButton = $target.querySelector('button.add-row');
    $addButton.dispatchEvent(new window.Event('click'));

    assert.is(t.$el.querySelectorAll('tbody tr:nth-child(2) td input').length, 5);
});
