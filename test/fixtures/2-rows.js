const FIXTURE_2_ROWS = [
    {
        column1: 'Cell 1',
        column2: 'Cell 2',
        column3: 'Cell 3'
    },
    {
        column1: 'Cell 4',
        column2: 'Cell 5',
        column3: 'Cell 6'
    }
];

// Exports
if (typeof module === 'object' && module.exports) {
    module.exports = { FIXTURE_2_ROWS };
} else if (typeof define === 'function' && define.amd) {
    define(() => ({ FIXTURE_2_ROWS }));
} else {
    window.FIXTURE_2_ROWS = FIXTURE_2_ROWS;
}
