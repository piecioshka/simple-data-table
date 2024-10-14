module.exports = {
    extends: 'piecioshka',

    // https://eslint.org/docs/user-guide/configuring#specifying-environments
    env: {
        es6: true,
        browser: true,
        node: true,
        commonjs: true,
        amd: true
        // jquery: true,
        // jasmine: true
    },

    // https://eslint.org/docs/rules/
    rules: {
        'no-nested-ternary': 'off',
        strict: 'off',
        'object-curly-newline': 'off',
        'no-magic-numbers': ['error', {
            ignore: [-1, 0, 1, 3]
        }],
        'arrow-parens': 'off',
        'valid-jsdoc': 'off'
    },

    // List of global variables.
    globals: {}
};
