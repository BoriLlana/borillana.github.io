# Borano Llana — Personal Website

A single-page personal website (dark theme, no build step, no dependencies) ready for GitHub Pages.

## Files

- `index.html` — the entire site (HTML + CSS + JS in one file)
- `favicon.svg` — browser tab icon
- `.nojekyll` — tells GitHub Pages to serve files as-is
- `headshot.jpg` — **optional**: add a photo with this exact name to replace the "BL" placeholder in the hero
- `scholar-stats.json` — citation numbers shown on the site (auto-refreshed; see below)
- `scripts/fetch_scholar.py` — scraper that reads your Google Scholar profile
- `.github/workflows/update-scholar.yml` — GitHub Action that runs the scraper daily

## Add your photo (optional)

Drop a square-ish image named `headshot.jpg` into this folder. The site detects it automatically — no code changes needed. (To use a different filename, edit the `<img src="headshot.jpg">` line in `index.html`.)

## Deploy to GitHub Pages

**Option A — user site (recommended), lives at `https://<username>.github.io`:**

1. Create a repo named exactly `<username>.github.io` (e.g. `boranollana.github.io`).
2. Upload these files to the repo root (drag-and-drop in the browser works, or use git — see below).
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. Wait ~1 minute, then visit `https://<username>.github.io`.

**Option B — project site, lives at `https://<username>.github.io/<repo>`:**

Same steps, but name the repo anything (e.g. `website`). The URL will include the repo name. All links in this site are relative, so it works either way.

### Using git from the terminal

```bash
cd "personal website"
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

Then enable Pages in **Settings → Pages** as above.

## Live citation count (auto-updated from Google Scholar)

The Publications section shows your total **Citations**, **h-index**, and **i10-index**. These come from `scholar-stats.json`, which a scheduled GitHub Action keeps in sync with your Google Scholar profile. There is no server: the Action commits the numbers into the repo, and the page reads them.

**How it works**

1. `.github/workflows/update-scholar.yml` runs every day at 06:00 UTC (and whenever you trigger it manually).
2. It runs `scripts/fetch_scholar.py`, which reads your Scholar profile and writes the numbers to `scholar-stats.json`.
3. It commits that file only if a number changed.
4. `index.html` fetches `scholar-stats.json` on page load and fills in the values. Until the first successful run, the numbers show a subtle placeholder.

**One-time setup**

1. Make sure the three files above are in your repo (`scripts/` and `.github/workflows/` folders included).
2. Push to GitHub. The workflow's `permissions: contents: write` block lets it commit the JSON back. (If a push from the Action is ever rejected, go to **Settings → Actions → General → Workflow permissions** and select **Read and write permissions**.)
3. To populate the numbers immediately instead of waiting for the nightly run: open the **Actions** tab, pick **Update Google Scholar stats**, and click **Run workflow**.

**If you fork/rename or it is not your profile:** change `SCHOLAR_USER` at the top of `scripts/fetch_scholar.py` and the three `scholar.google.com/citations?user=...` links in `index.html` to your own Scholar id (the `user=` value in your profile URL).

**Note on reliability:** Google Scholar has no official API and occasionally serves a robot check to automated requests. When that happens the script exits without overwriting the file, so the last good numbers remain on the site; the next daily run tries again. If you want rock-solid reliability, a paid API such as SerpApi can be dropped into `fetch_scholar.py` instead.

## Editing content

Everything is plain HTML in `index.html`. Search for a section comment (e.g. `<!-- ===== PUBLICATIONS ===== -->`) to find what you want to change. To add a publication, copy an existing `.card.pub` block and edit the venue, year, title, and tags.
