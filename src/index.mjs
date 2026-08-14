// ES module entry point.
//
// The UMD build in index.js cannot carry `export` statements, because that
// syntax is invalid in a classic <script>. This wrapper re-exports the
// class for `import` users.
//
// In Node the UMD build takes the CommonJS branch, so the class comes from
// the default interop object. In a browser it takes the global branch, and
// the module namespace is empty.

import * as umd from './index.js';

const fromCommonJs = umd.default && umd.default.SimpleDataTable;
const fromGlobal =
    typeof globalThis === 'object' ? globalThis.SimpleDataTable : undefined;

const SimpleDataTable = fromCommonJs || fromGlobal;

if (!SimpleDataTable) {
    throw new Error('simple-data-table: failed to load the UMD build');
}

export { SimpleDataTable };
export default SimpleDataTable;
