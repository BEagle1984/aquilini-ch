import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://aquilini.ch',
    // Emit resume.html instead of resume/index.html so existing /resume.html links keep working.
    build: { format: 'file' },
});
