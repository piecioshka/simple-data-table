// This file is loaded with <script type="module">, so the table below is
// rendered through a real `import`, not through the global UMD build.

import { SimpleDataTable } from '../src/index.mjs';

const team = [
    { name: 'Ada Lovelace', role: 'Engineering', city: 'London' },
    { name: 'Grace Hopper', role: 'Compilers', city: 'New York' },
    { name: 'Alan Turing', role: 'Research', city: 'Cambridge' },
];

const t = new SimpleDataTable(document.querySelector('#example-esm'));
t.setHeaders(['Name', 'Role', 'City']);
t.load(team);
t.render();
