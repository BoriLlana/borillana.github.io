# Personal Website

Live site: https://borillana.github.io/

Personal portfolio for Borano Llana, PhD candidate in Computer Science at the University of Rhode Island. Covers research, publications, projects, experience, and contact info.

## Structure

- `index.html` — page markup
- `styles.css` — all styling
- `script.js` — page behavior (theme toggle, nav, reveal animations, publication filters, Scholar stats)
- `theme-init.js` — sets the theme before first paint to avoid a flash of the wrong theme
- `scholar-stats.json` — citation stats, refreshed by a GitHub Action from Google Scholar
- `robots.txt`, `sitemap.xml` — search engine crawling and indexing

## Development

This is a static site with no build step. Open `index.html` directly, or serve the folder locally, for example:

```
python3 -m http.server 8811
```
