class SimpleDataTable {
    constructor($el, options = {}) {
        this.$el = $el;
        this.addButtonLabel = options.addButtonLabel || '✚';
        this.readonly = options.readonly || false;
        this.defaultColumnPrefix = options.defaultColumnPrefix || 'column';
        this.defaultColumnNumber = options.defaultColumnNumber || null;
        this.defaultHighlightedCellClass =
            options.defaultHighlightedCellClass || 'highlighted-cell';
        this._headers = [];
        this.data = [];
        this._events = {};
        this._sorted = {
            columnIndex: -1,
            descending: false,
        };
        this._sortComparingFn = SimpleDataTable.compareValues;
    }

    _renderTHead($table) {
        const $thead = document.createElement('thead');
        const $row = document.createElement('tr');

        this._headers.forEach((name, index) => {
            const $cell = this._createEmptyHeaderCell();
            let label = name;
            if (this._sorted.columnIndex === index) {
                label += ` ${this._sorted.descending ? '\u2191' : '\u2193'}`;
            }
            $cell.textContent = label;
            $cell.addEventListener('click', () => {
                this._sorted.descending =
                    this._sorted.columnIndex === index &&
                    !this._sorted.descending;
                this.sortByColumn(index);
            });
            $row.appendChild($cell);
        });

        $thead.appendChild($row);
        $table.appendChild($thead);
    }

    _renderTBody($table) {
        const $tbody = document.createElement('tbody');

        this.data.forEach((item) => {
            const $row = document.createElement('tr');

            Object.entries(item).forEach(([key, value]) => {
                const $cell = this._createCellWithInput(key, value);
                $row.appendChild($cell);
            });

            const $cell = this.readonly
                ? this._createEmptyCell()
                : this._createCellWithRemoveRowButton();
            $row.appendChild($cell);

            $tbody.appendChild($row);
        });

        $table.appendChild($tbody);
    }

    render() {
        if (!this.$el) {
            throw new Error('this.$el is not defined');
        }

        SimpleDataTable.clearElement(this.$el);

        const $wrapper = document.createElement('div');
        $wrapper.classList.add('simple-data-table');
        const $table = document.createElement('table');

        if (this._headers.length > 0) {
            this._renderTHead($table);
        }

        this._renderTBody($table);

        $wrapper.appendChild($table);

        if (!this.readonly) {
            const $addButton = this._createAddButton();
            $wrapper.appendChild($addButton);
        }

        this.$el.appendChild($wrapper);

        return this;
    }

    getRowsCount() {
        return this.$el.querySelectorAll('tbody tr').length;
    }

    findCellsByContent(...content) {
        const indexes = [];
        const $rows = this.$el.querySelectorAll('tbody tr');

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
                            cellIndex,
                        });
                    }
                });
            });
        });
        return indexes;
    }

    getCell(rowIndex, cellIndex) {
        const $rows = this.$el.querySelectorAll('tbody tr');
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

        if (!$cell) {
            return;
        }

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

        if (!$cell) {
            return;
        }

        const $input = $cell.querySelector('input');

        if (!$input) {
            return;
        }

        $input.value = content;
    }

    _createEmptyCell() {
        return document.createElement('td');
    }

    _createEmptyHeaderCell() {
        return document.createElement('th');
    }

    _createCellWithRemoveRowButton() {
        const $cell = this._createEmptyCell();
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

    _createCellWithInput(name, value) {
        const $cell = document.createElement('td');
        const $input = document.createElement('input');
        $input.value = value;
        $input.name = name;

        if (this.readonly) {
            $input.disabled = true;
        }

        $input.addEventListener('change', () => {
            // Row index is resolved at event time, because removing
            // an earlier row shifts positions in `this.data`.
            const $row = $cell.parentNode;
            const rowIndex = Array.from($row.parentNode.children).indexOf($row);
            this.data[rowIndex][name] = $input.value;
            this.emit(SimpleDataTable.EVENTS.UPDATE, this.data);
        });

        $cell.appendChild($input);
        return $cell;
    }

    _createEmptyRow() {
        const $tbody = this.$el.querySelector('tbody');
        const $row = document.createElement('tr');
        const columnNames = this._fetchColumnNames();

        const record = {};

        columnNames.forEach((cellName) => {
            const $cell = this._createCellWithInput(cellName, '');
            $row.appendChild($cell);
            record[cellName] = '';
        });

        this.data.push(record);

        $row.appendChild(this._createCellWithRemoveRowButton());
        $tbody.appendChild($row);

        this.emit(SimpleDataTable.EVENTS.ROW_ADDED);
    }

    _fetchColumnNames() {
        const $tbody = this.$el.querySelector('tbody');
        const $firstRecord = $tbody.querySelector('tr');

        if (!$firstRecord) {
            const size =
                Number(this.defaultColumnNumber) ||
                this._headers.length ||
                (this.data[0] ? Object.keys(this.data[0]).length : 0);
            if (!size) {
                return [];
            }
            return Array(size)
                .fill(this.defaultColumnPrefix)
                .map((name, index) => `${name}${index + 1}`);
        }

        const $elements = Array.from($firstRecord.children);
        return $elements
            .map(($cell) => $cell.querySelector('input'))
            .filter(($element) => $element)
            .map(($input) => $input.name);
    }

    /**
     * @param {string[]} items
     * @returns
     */
    setHeaders(items) {
        this._headers = items;
        return this;
    }

    load(data) {
        // Rows are copied, so editing cells never mutates the objects
        // passed in by the caller.
        this.data = Array.from(data, (row) => ({ ...row }));
        return this;
    }

    emit(name, payload) {
        if (this._events[name]) {
            this._events[name].forEach((cb) => cb(payload));
        }

        return this;
    }

    on(name, handler) {
        if (!this._events[name]) {
            this._events[name] = [];
        }

        this._events[name].push(handler);
        return this;
    }

    sortByColumn(index) {
        this._sorted.columnIndex = index;
        const order = this._sorted.descending ? 1 : -1;
        this.data.sort((firstRow, secondRow) => {
            const value1 = Object.values(firstRow)[index];
            const value2 = Object.values(secondRow)[index];

            // Empty values always sink to the bottom, regardless of the
            // sort direction, and never reach the comparing function.
            const isEmpty1 = SimpleDataTable.isEmptyValue(value1);
            const isEmpty2 = SimpleDataTable.isEmptyValue(value2);

            if (isEmpty1 || isEmpty2) {
                if (isEmpty1 && isEmpty2) {
                    return 0;
                }
                return isEmpty1 ? 1 : -1;
            }

            return this._sortComparingFn(value1, value2) * order;
        });
        this.render();
        this.emit(SimpleDataTable.EVENTS.DATA_SORTED);
    }

    setSortComparingFn(fn) {
        this._sortComparingFn = fn;
    }

    static isEmptyValue(value) {
        return value === null || typeof value === 'undefined' || value === '';
    }

    /**
     * Compares two cell values, picking the strategy from their type:
     * numbers numerically, dates chronologically and anything else as
     * text with natural ordering ("item2" before "item10").
     *
     * @param {unknown} value1
     * @param {unknown} value2
     * @returns {number}
     */
    static compareValues(value1, value2) {
        const number1 = SimpleDataTable.toNumber(value1);
        const number2 = SimpleDataTable.toNumber(value2);

        if (number1 !== null && number2 !== null) {
            return number1 - number2;
        }

        const date1 = SimpleDataTable.toTimestamp(value1);
        const date2 = SimpleDataTable.toTimestamp(value2);

        if (date1 !== null && date2 !== null) {
            return date1 - date2;
        }

        // An empty locales list means "use the default locale".
        return String(value1).localeCompare(String(value2), [], {
            numeric: true,
            sensitivity: 'base',
        });
    }

    static toNumber(value) {
        if (typeof value === 'number') {
            return Number.isNaN(value) ? null : value;
        }

        if (typeof value === 'boolean') {
            return Number(value);
        }

        if (typeof value !== 'string' || value.trim() === '') {
            return null;
        }

        const parsed = Number(value.trim().replace(',', '.'));
        return Number.isNaN(parsed) ? null : parsed;
    }

    static toTimestamp(value) {
        if (value instanceof Date) {
            const time = value.getTime();
            return Number.isNaN(time) ? null : time;
        }

        // Only ISO-like dates are recognized, because Date parsing of
        // arbitrary strings is implementation specific.
        if (
            typeof value !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}([T ]|$)/.test(value.trim())
        ) {
            return null;
        }

        const time = new Date(value.trim()).getTime();
        return Number.isNaN(time) ? null : time;
    }

    static clearElement($element) {
        while ($element.firstElementChild) {
            $element.firstElementChild.remove();
        }
    }
}

SimpleDataTable.EVENTS = {
    UPDATE: 'SimpleDataTable.EVENTS.UPDATE',
    ROW_ADDED: 'SimpleDataTable.EVENTS.ROW_ADDED',
    ROW_REMOVED: 'SimpleDataTable.EVENTS.ROW_REMOVED',
    DATA_SORTED: 'SimpleDataTable.EVENTS.DATA_SORTED',
};

// Exports
if (typeof module === 'object' && module.exports) {
    module.exports = { SimpleDataTable };
} else if (typeof define === 'function' && define.amd) {
    define(() => ({ SimpleDataTable }));
} else {
    window.SimpleDataTable = SimpleDataTable;
}
