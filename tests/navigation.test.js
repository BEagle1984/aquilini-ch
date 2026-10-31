// Checks the built site, so run `npm run build` first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = page => readFileSync(new URL(`../dist/${page}`, import.meta.url), 'utf8');

for (const [page, current] of [['index.html', '/'], ['resume.html', '/resume.html']]) {
    test(`${page} marks only ${current} as the current page`, () => {
        const nav = read(page).match(/<nav id="menu"[^]*?<\/nav>/)[0];
        const marked = [...nav.matchAll(/<a href="([^"]+)"[^>]*aria-current="page"/g)].map(match => match[1]);
        assert.deepEqual(marked, [current]);
    });
}

test('custom domain is published', () => {
    assert.equal(read('CNAME').trim(), 'aquilini.ch');
});
