'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const test = require('ava').default;
const jsdom = require('jsdom');

const SOURCE_PATH = path.join(__dirname, '..', '..', 'src', 'index.js');
const SOURCE = fs.readFileSync(SOURCE_PATH, 'utf8');

/**
 * Runs the source in a sandbox which mimics a non-CommonJS environment,
 * so the AMD and browser-global export branches are reachable.
 */
function runInSandbox(sandbox) {
    const { window } = new jsdom.JSDOM();
    const context = vm.createContext({
        document: window.document,
        window,
        ...sandbox,
    });
    vm.runInContext(SOURCE, context);
    return context;
}

test('exports through AMD when define.amd is available', (assert) => {
    let defined = null;
    const define = (factory) => {
        defined = factory();
    };
    define.amd = true;

    runInSandbox({ define });

    assert.truthy(defined);
    assert.is(typeof defined.SimpleDataTable, 'function');
    assert.regex(String(defined.SimpleDataTable), /^class/);
});

test('exports to the global object in a plain browser', (assert) => {
    const context = runInSandbox({});

    assert.is(typeof context.window.SimpleDataTable, 'function');
    assert.regex(String(context.window.SimpleDataTable), /^class/);
});

test('prefers CommonJS over AMD when both are available', (assert) => {
    let defined = null;
    const define = (factory) => {
        defined = factory();
    };
    define.amd = true;
    const commonjsModule = { exports: {} };

    runInSandbox({ define, module: commonjsModule });

    assert.is(defined, null);
    assert.is(typeof commonjsModule.exports.SimpleDataTable, 'function');
});
