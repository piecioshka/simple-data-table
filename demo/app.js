/* global SimpleDataTable, DEMO_TEAM, DEMO_RELEASES, DEMO_INVOICES, hljs */

(function () {
    'use strict';

    function setupBasicExample() {
        const t = new SimpleDataTable(document.querySelector('#example-basic'));
        t.setHeaders(['Name', 'Role', 'City']);
        t.load(DEMO_TEAM);
        t.render();
    }

    function setupSortingExample() {
        const releases = DEMO_RELEASES.concat({
            version: '2.0.0-beta',
            downloads: 12,
            released: '',
        });

        const t = new SimpleDataTable(
            document.querySelector('#example-sorting'),
        );
        t.setHeaders(['Version', 'Downloads', 'Released']);
        t.load(releases);
        t.render();
    }

    function setupEventsExample() {
        const $log = document.querySelector('#event-log');
        const t = new SimpleDataTable(
            document.querySelector('#example-events'),
        );

        function log(name, detail) {
            const $empty = $log.querySelector('.event-log__empty');
            if ($empty) {
                $empty.remove();
            }

            const $entry = document.createElement('li');
            const $name = document.createElement('span');
            $name.className = 'event-log__name';
            $name.textContent = name;
            $entry.appendChild($name);
            $entry.appendChild(document.createTextNode(` ${detail}`));

            $log.insertBefore($entry, $log.firstChild);

            while ($log.children.length > 30) {
                $log.lastElementChild.remove();
            }
        }

        t.setHeaders(['Name', 'Role', 'City']);
        t.load(DEMO_TEAM);
        t.on(SimpleDataTable.EVENTS.UPDATE, (data) => {
            log('UPDATE', `${data.length} row(s) in memory`);
        });
        t.on(SimpleDataTable.EVENTS.ROW_ADDED, () => {
            log('ROW_ADDED', `now ${t.getRowsCount()} row(s)`);
        });
        t.on(SimpleDataTable.EVENTS.ROW_REMOVED, (data) => {
            log('ROW_REMOVED', `${data.length} row(s) left`);
        });
        t.on(SimpleDataTable.EVENTS.DATA_SORTED, () => {
            log('DATA_SORTED', 'table re-rendered');
        });
        t.render();
    }

    function setupReadonlyExample() {
        const t = new SimpleDataTable(
            document.querySelector('#example-readonly'),
            { readonly: true },
        );
        t.setHeaders(['Invoice', 'Client', 'Total']);
        t.load(DEMO_INVOICES);
        t.render();
    }

    function setupSkinExample() {
        const $container = document.querySelector('#example-skin');
        const t = new SimpleDataTable($container);
        t.setHeaders(['Name', 'Role', 'City']);
        t.load(DEMO_TEAM);
        t.render();

        // The dark skin is scoped to this section only, so the rest of the
        // page keeps using the default one.
        $container
            .querySelector('.simple-data-table')
            .classList.add('midnight');
    }

    function setupPlayground() {
        const $data = document.querySelector('#playground-data');
        const $headers = document.querySelector('#playground-headers');
        const $readonly = document.querySelector('#playground-readonly');
        const $dark = document.querySelector('#playground-dark');
        const $label = document.querySelector('#playground-label');
        const $error = document.querySelector('#playground-error');
        const $preview = document.querySelector('#playground-preview');

        $data.value = JSON.stringify(DEMO_TEAM, null, 2);
        $headers.checked = true;

        function renderPreview() {
            let rows;

            try {
                rows = JSON.parse($data.value);
            } catch (err) {
                $error.textContent = `Invalid JSON: ${err.message}`;
                $data.classList.add('playground__editor--invalid');
                return;
            }

            if (!Array.isArray(rows)) {
                $error.textContent = 'Expected an array of objects.';
                $data.classList.add('playground__editor--invalid');
                return;
            }

            $error.textContent = '';
            $data.classList.remove('playground__editor--invalid');

            const t = new SimpleDataTable($preview, {
                readonly: $readonly.checked,
                addButtonLabel: $label.value || '✚',
            });

            if ($headers.checked && rows.length > 0) {
                t.setHeaders(Object.keys(rows[0]));
            }

            t.load(rows);
            t.render();

            $preview
                .querySelector('.simple-data-table')
                .classList.toggle('midnight', $dark.checked);
            $preview.classList.toggle('demo-box--dark', $dark.checked);
        }

        $data.addEventListener('input', renderPreview);
        $label.addEventListener('input', renderPreview);
        [$headers, $readonly, $dark].forEach(($input) => {
            $input.addEventListener('change', renderPreview);
        });

        renderPreview();
    }

    function setupCopyButton() {
        const $button = document.querySelector('#copy-install');
        const $command = document.querySelector('#install-command');

        $button.addEventListener('click', () => {
            const done = () => {
                $button.textContent = 'copied';
                setTimeout(() => {
                    $button.textContent = 'copy';
                }, 1500);
            };

            if (navigator.clipboard) {
                navigator.clipboard.writeText($command.textContent).then(done);
                return;
            }

            done();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupBasicExample();
        setupSortingExample();
        setupEventsExample();
        setupReadonlyExample();
        setupSkinExample();
        setupPlayground();
        setupCopyButton();
        hljs.highlightAll();
    });
})();
