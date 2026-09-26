const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '../scripts/loader.js'), 'utf8');

function setup(pathname, fetch) {
    const links = ['https://aquilini.ch/', 'https://aquilini.ch/resume.html', 'https://laquietedelbosco.ch/'].map(href => ({
        href,
        attributes: {},
        setAttribute(name, value) { this.attributes[name] = value; },
        removeAttribute(name) { delete this.attributes[name]; }
    }));
    // Start with a stale selection to verify that navigation clears it.
    links.forEach(link => link.setAttribute('aria-current', 'page'));
    const menu = { innerHTML: 'fallback', querySelectorAll: () => links };
    const errors = [];
    let ready;
    runInNewContext(source, {
        URL,
        window: { location: { pathname, origin: 'https://aquilini.ch' } },
        document: {
            getElementById: () => menu,
            addEventListener: (_, callback) => { ready = callback; }
        },
        fetch,
        console: { error: (...args) => errors.push(args) }
    });
    return { menu, links, errors, ready };
}

for (const [pathname, selected] of [['/', 0], ['/index.html', 0], ['/resume.html', 1]]) {
    test(`marks only the current link for ${pathname}`, async () => {
        const state = setup(pathname, async () => ({ ok: true, text: async () => 'shared navigation' }));
        await state.ready();
        assert.equal(state.menu.innerHTML, 'shared navigation');
        state.links.forEach((link, index) => {
            assert.equal(link.attributes['aria-current'], index === selected ? 'page' : undefined);
        });
        assert.equal(state.errors.length, 0);
    });
}

for (const [name, fetch] of [
    ['HTTP error', async () => ({ ok: false, status: 503, text: async () => 'Service unavailable' })],
    ['network failure', async () => { throw new Error('Offline'); }]
]) {
    test(`preserves working fallback navigation on ${name}`, async () => {
        const state = setup('/resume.html', fetch);
        await state.ready();
        assert.equal(state.menu.innerHTML, 'fallback');
        assert.equal(state.links[1].attributes['aria-current'], 'page');
        assert.equal(state.links[0].attributes['aria-current'], undefined);
        assert.equal(state.errors.length, 1);
    });
}
