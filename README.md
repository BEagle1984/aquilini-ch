# aquilini.ch

Personal website built with [Astro](https://astro.build) and published to GitHub Pages.

## Structure

- `src/pages/`: one `.astro` file per page (`index.astro` → `/`, `resume.astro` → `/resume.html`).
- `src/layouts/Layout.astro`: shared `<head>`, navigation and footer.
- `src/components/`: navigation, footer and SVG icons.
- `src/styles/`, `src/fonts/`: stylesheets and fonts, bundled with hashed filenames at build time.
- `src/assets/images/`: source images. Images rendered with `<Image>` are resized and converted to WebP
  at build time; unused ones are not published.
- `public/`: copied to the site as-is (favicons, `CNAME`).

To add a page, create `src/pages/<name>.astro` using `Layout`, then add it to the `links` list in
`src/components/Nav.astro`.

## Local development

Requires Node.js 24 (or 22.23+), the same major version CI uses.

```powershell
npm install
npm run dev
```

Open http://localhost:4321/. Changes reload in the browser automatically.

To check the production build:

```powershell
npm run build
npm test
npm run preview
```

`npm test` checks the generated `dist/` folder, so run it after a build.

## Deployment

`.github/workflows/deploy.yml` builds and tests every push and pull request. Pushes to `master`
are then deployed to GitHub Pages. The repository's Pages source must be set to **GitHub Actions**.
