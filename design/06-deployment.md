# 06 - Deployment & CI/CD

## Deployment Target

**GitHub Pages** - Free static site hosting directly from the repository.

- **Live URL:** `https://<username>.github.io/english-learning-roadmap.github.io/`
- **Source:** GitHub Actions (not branch-based deployment)

---

## GitHub Actions Workflow

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
    push:
        branches: [main]
    workflow_dispatch:

permissions:
    contents: read
    pages: write
    id-token: write

concurrency:
    group: pages
    cancel-in-progress: true

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: npm
            - run: npm ci
            - run: npm run build
            - uses: actions/upload-pages-artifact@v3
              with:
                  path: dist

    deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
        steps:
            - id: deployment
              uses: actions/deploy-pages@v4
```

### Workflow Behavior

- Triggers on every push to `main` branch
- Also supports manual trigger via `workflow_dispatch`
- Uses concurrency control to cancel in-progress deployments
- Build job: checkout -> install -> build -> upload artifact
- Deploy job: deploys the built artifact to GitHub Pages

---

## GitHub Pages Settings

Repository Settings -> Pages:
- **Source:** GitHub Actions
- **Custom domain:** (none, using default GitHub Pages URL)

---

## SPA Routing on GitHub Pages

GitHub Pages serves static files and returns 404 for unknown paths.
For client-side routing to work, a `404.html` redirect trick is used:

### `public/404.html`

Redirects all 404s back to `index.html` with the original path preserved as a query parameter. The app then reads this parameter and routes accordingly.

This is a well-known pattern for SPAs on GitHub Pages.

---

## Vite Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "/english-learning-roadmap.github.io/",
    plugins: [react(), tailwindcss()],
});
```

Key setting: `base` must match the repository name for correct asset path resolution on GitHub Pages.

---

## Build Output

- Output directory: `dist/` (Vite default)
- Assets are hashed for cache busting
- Single `index.html` entry point

---

## Development Workflow

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

### Deployment Flow

```
Developer pushes to main
  └─► GitHub Actions triggers
        ├─► npm ci (install dependencies)
        ├─► npm run build (Vite production build)
        ├─► Upload dist/ as Pages artifact
        └─► Deploy to GitHub Pages
              └─► Site live at https://<user>.github.io/english-learning-roadmap.github.io/
```
