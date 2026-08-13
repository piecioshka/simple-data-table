export interface SimpleDataTableOptions {
    /**
     * Label of the button which adds a new row.
     * Default: '✚'
     */
    addButtonLabel?: string;

    /**
     * Prefix used for cell names in newly added columns.
     * Default: 'column'
     */
    defaultColumnPrefix?: string;

    /**
     * Number of columns for a new row in an empty table.
     * By default, the number of headers or the number of cells
     * in the first row of data is used.
     */
    defaultColumnNumber?: number | string | null;

    /**
     * CSS class added to a highlighted cell.
     * Default: 'highlighted-cell'
     */
    defaultHighlightedCellClass?: string;

    /**
     * When enabled, inputs are disabled and rows cannot be
     * added or removed.
     * Default: false
     */
    readonly?: boolean;
}

export interface CellPosition {
    rowIndex: number;
    cellIndex: number;
}

export type SimpleDataTableRow = Record<string, unknown>;

export type SortComparingFn = (value1: unknown, value2: unknown) => number;

export declare class SimpleDataTable {
    static EVENTS: {
        UPDATE: string;
        ROW_ADDED: string;
        ROW_REMOVED: string;
        DATA_SORTED: string;
    };

    /**
     * Recursively removes children of the passed element.
     */
    static clearElement($element: HTMLElement): void;

    data: SimpleDataTableRow[];

    constructor($el: HTMLElement, options?: SimpleDataTableOptions);

    /**
     * Renders the table into the DOM.
     */
    render(): this;

    /**
     * Returns the number of rendered rows.
     */
    getRowsCount(): number;

    /**
     * Returns positions of cells which contain any of the passed strings.
     */
    findCellsByContent(...content: string[]): CellPosition[];

    /**
     * Returns the DOM reference of a cell, or null when it does not exist.
     */
    getCell(rowIndex: number, cellIndex: number): HTMLTableCellElement | null;

    /**
     * Adds the highlight CSS class to a cell.
     */
    highlightCell(rowIndex: number, cellIndex: number): void;

    /**
     * Removes the highlight CSS class from all cells.
     */
    clearHighlightedCells(): void;

    /**
     * Puts content into the input of a cell.
     */
    setInputCellContent(
        rowIndex: number,
        cellIndex: number,
        content: string,
    ): void;

    /**
     * Sets column headers. Sorting is enabled by default.
     */
    setHeaders(items: string[]): this;

    /**
     * Loads data into the table component.
     */
    load(data: SimpleDataTableRow[]): this;

    /**
     * Triggers an event on the instance.
     */
    emit(name: string, payload?: unknown): this;

    /**
     * Listens on events.
     */
    on(name: string, handler: (payload?: unknown) => void): this;

    /**
     * Sorts data by a column and triggers the DATA_SORTED event.
     * Runs render() under the hood.
     */
    sortByColumn(columnIndex: number): void;

    /**
     * Sets the comparing function used by sortByColumn().
     * By default String.prototype.localeCompare is used.
     */
    setSortComparingFn(fn: SortComparingFn): void;
}
