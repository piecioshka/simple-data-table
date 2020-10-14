module.exports = {
    extends: 'piecioshka',

    // http://eslint.org/docs/user-guide/configuring#specifying-environments
    env: {
        es6: true,
        browser: true,
        node: true,
        commonjs: true,
        amd: true
        // jquery: true,
        // jasmine: true
    },

    // http://eslint.org/docs/rules/
    rules: {
        'no-nested-ternary': ['off'],
        'strict': ['off'],
        'object-curly-newline': ['off'],
        'no-magic-numbers': ['error', {
            'ignore': [0, 1, 3]
        }]
    },

    // List of global variables.
    globals: {}
};
