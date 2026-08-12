# hermesnotifications.github.io

The public site for **Hermes** — an open-source, self-hostable notification platform.

Static HTML/CSS/JS with no build step. Push to `main` and GitHub Pages serves it.

## Layout

```
index.html          Landing page
docs/index.html     Docs shell — Quickstart page
assets/css/site.css All styles (design tokens at the top)
assets/js/site.js   Progressive enhancement only: nav toggles, copy buttons,
                    docs sidebar filter (⌘K), on-page contents highlighting
assets/favicon.svg
.nojekyll           Serve files as-is; no Jekyll processing
```

## Local preview

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Publishing

Repository **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/`.
As a `<user-or-org>.github.io` repository the site is served from the domain root, so
all internal links are relative and work unchanged locally and in production.

## Design source

Built from the Claude Design project *Hermes Notifications UI mockups*
(`Hermes Site.dc.html`, options `2a` landing and `2b` docs shell). Copy is
verbatim from the design; the fixed 1120px mockup was reworked into a
responsive layout with real semantics, keyboard focus states and reduced-motion
support.

Design tokens live in `:root` in `assets/css/site.css` — the cobalt accent is
`oklch(0.55 0.16 258)`, with hex fallbacks under `@supports not (color: oklch(…))`.

## Still to do

Several docs pages are referenced by the sidebar but not yet written
(Introduction, Data model, Templates & categories, Preferences, Hardening,
Observability, API, ADRs). They render as plain text rather than dead links —
replace each `<span class="is-pending">` with an `<a>` as the page lands.
