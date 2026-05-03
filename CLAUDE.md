## Toolchain
- **SSG:** Eleventy (11ty)
- **CSS:** Tailwind v4 (PostCSS Pipeline)
- **Primary Script:** `npm run dev` handles both HTML and CSS hot-reloading.

## Workflow Execution
1. **HTML/Templates:** Edit in `src/*.njk` or `src/*.md`.
2. **Styling:** Add Tailwind classes directly to HTML. Only edit `src/assets/css/main.css` for @theme variables.
3. **Images:** Manage `images.org/crops` using `file: W H X Y`. Run `npm run crop` to output 500px-wide JPEGs to `src/assets/images/`.
4. **Verification:** Always check `_site/index.html` after a build to confirm asset paths.
