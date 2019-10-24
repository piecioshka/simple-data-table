class SimpleDataTable {
    constructor($el, options = {}) {
        this.$el = $el;
        this.addButtonLabel = options.addButtonLabel || '✚';
        this.defaultColumnPrefix = options.defaultColumnPrefix || 'column';
        this.defaultColumnNumber = options.defaultColumnNumber || 3;
        this.defaultHighlightedCellClass = options.defaultHighlightedCellClass || 'highlighted-cell';
        this.data = [];
        this._events = {};
    }

    render() {
        if (!this.$el) {
            throw new Error('this.$el is not defined');
        }

        this.$el.innerHTML = '';

        const $table = document.createElement('table');
        const $tbody = document.createElement('tbody');
        $table.appendChild($tbody);

        this.data.forEach((item, rowIndex) => {
            const $row = document.createElement('tr');

            Object.entries(item).forEach(([key, value]) => {
                const $cell = this._createCellWithInput(key, value, rowIndex);
                $row.appendChild($cell);
            });

            this._addCellWithRemoveButton($row);

            $tbody.appendChild($row);
        });

        this.$el.appendChild($table);

        const $addButton = this._createAddButton();

        this.$el.appendChild($addButton);
        return this;
    }

    getRowsCount() {
        return this.$el.querySelectorAll('tr').length;
    }

    findCellsByContent(...content) {
        const indexes = [];
        const $rows = this.$el.querySelectorAll('tr');

        $rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, cellIndex) => {
                const $cellInput = cell.querySelector('input');
                const cellContent = $cellInput
                    ? $cellInput.value
                    : cell.textContent;

                content.forEach((item) => {
                    if (cellContent === item) {
                        indexes.push({
                            rowIndex,
                            cellIndex
                        });
                    }
                });
            });
        });
        return indexes;
    }

    getCell(rowIndex, cellIndex) {
        const $rows = this.$el.querySelectorAll('tr');
        const $row = $rows[rowIndex];

        if (!$row) {
            return null;
        }

        const $cells = $row.querySelectorAll('td');
        const $cell = $cells[cellIndex];

        if (!$cell) {
            return null;
        }

        return $cell;
    }

    highlightCell(rowIndex, cellIndex) {
        const $cell = this.getCell(rowIndex, cellIndex);
        $cell.classList.add(this.defaultHighlightedCellClass);
    }

    clearHighlightedCells() {
        const $cells = this.$el.querySelectorAll('td');
        $cells.forEach(($cell) => {
            $cell.classList.remove(this.defaultHighlightedCellClass);
        });
    }

    setInputCellContent(rowIndex, cellIndex, content) {
        const $cell = this.getCell(rowIndex, cellIndex);
        const $input = $cell.querySelector('input');
        $input.value = content;
    }

    _createCellWithRemoveRowButton() {
        const $cell = document.createElement('td');
        const $removeButton = document.createElement('button');
        $removeButton.classList.add('remove-row');
        $removeButton.textContent = '✖︎';
        $removeButton.addEventListener('click', () => {
            const $tr = $cell.parentNode;
            this._removeRow($tr);
        });
        $cell.appendChild($removeButton);
        return $cell;
    }

    _removeRow($tr) {
        const $siblings = Array.from($tr.parentNode.children);
        const index = $siblings.indexOf($tr);
        this.data.splice(index, 1);
        $tr.remove();
        this.emit(SimpleDataTable.EVENTS.ROW_REMOVED, this.data);
    }

    _createAddButton() {
        const $addButton = document.createElement('button');
        $addButton.classList.add('add-row');
        $addButton.textContent = this.addButtonLabel;
        $addButton.addEventListener('click', this._createEmptyRow.bind(this));
        return $addButton;
    }

    _createCellWithInput(name, value, rowIndex) {
        const $cell = document.createElement('td');
        const $input = document.createElement('input');
        $input.value = value;
        $input.name = name;

        $input.addEventListener('change', () => {
            this.data[rowIndex][name] = $input.value;
            this.emit(SimpleDataTable.EVENTS.UPDATE, this.data);
        }, this);

        $cell.appendChild($input);
        return $cell;
    }

    _createEmptyRow() {
        const $tbody = this.$el.querySelector('tbody');
        const rowsCount = $tbody.querySelectorAll('tr').length;
        const $row = document.createElement('tr');
        const columnNames = this._fetchColumnNames();

        const record = {};

        columnNames.forEach((cellName) => {
            const $cell = this._createCellWithInput(cellName, '', rowsCount);
            $row.appendChild($cell);
            record[cellName] = '';
        });

        this.data.push(record);

        this._addCellWithRemoveButton($row);
        $tbody.appendChild($row);

        this.emit(SimpleDataTable.EVENTS.ROW_ADDED);
    }

    _fetchColumnNames() {
        const $tbody = this.$el.querySelector('tbody');
        const $firstRecord = $tbody.querySelector('tr');

        if (!$firstRecord) {
            return Array(this.defaultColumnNumber)
                .fill(this.defaultColumnPrefix)
                .map((name, index) => `${name}-${index + 1}`);
        }

        const $elements = Array.from($firstRecord.children);
        return $elements.map(($cell) => $cell.querySelector('input'))
            .filter(($element) => $element)
            .map(($input) => $input.name);
    }

    _addCellWithRemoveButton($row) {
        const $cellWithButton = this._createCellWithRemoveRowButton();
        $row.appendChild($cellWithButton);
    }

    load(data) {
        this.data = Array.from(data);
        return this;
    }

    emit(name, payload) {
        if (!this._events[name]) {
            return;
        }

        this._events[name].forEach((cb) => cb(payload));
        return this;
    }

    on(name, handler) {
        if (!this._events[name]) {
            this._events[name] = [];
        }

        this._events[name].push(handler);
        return this;
    }

    sortByColumn(
        cellIndex = 0,
        comparingFunction = (a, b) => a.toString().localeCompare(b.toString())
    ) {
        this.data.sort((firstRow, secondRow) => comparingFunction(
            Object.values(firstRow)[cellIndex],
            Object.values(secondRow)[cellIndex])
        );
        this.emit(SimpleDataTable.EVENTS.DATA_SORTED);
    }

    static get EVENTS() {
        return {
            UPDATE: 'SimpleDataTable.EVENTS.UPDATE',
            ROW_ADDED: 'SimpleDataTable.EVENTS.ROW_ADDED',
            ROW_REMOVED: 'SimpleDataTable.EVENTS.ROW_REMOVED',
            DATA_SORTED: 'SimpleDataTable.EVENTS.DATA_SORTED'
        };
    }
}

// Exports
if (typeof module === 'object' && module.exports) {
    module.exports = { SimpleDataTable };
} else if (typeof define === 'function' && define.amd) {
    define(() => ({ SimpleDataTable }));
} else {
    window.SimpleDataTable = SimpleDataTable;
}
