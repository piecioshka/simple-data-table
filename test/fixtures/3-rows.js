const FIXTURE_3_ROWS = [
    {
        value: 34,
        backgroundColor: '#3498db',
        label: 'Angular'
    },

    {
        value: 5,
        backgroundColor: '#2980b9',
        label: 'Angular v1.x'
    },

    {
        value: 13,
        backgroundColor: '#c0392b',
        label: 'Nie'
    }
];

// Exports
if (typeof module === 'object' && module.exports) {
    module.exports = { FIXTURE_3_ROWS };
} else if (typeof define === 'function' && define.amd) {
    define(() => ({ FIXTURE_3_ROWS }));
} else {
    window.FIXTURE_3_ROWS = FIXTURE_3_ROWS;
}
