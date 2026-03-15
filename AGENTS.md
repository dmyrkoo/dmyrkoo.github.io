# AGENTS Guide

## Project Snapshot
- This repository currently contains two independent labs: `lab1/` (implemented static page) and `lab2/` (empty placeholders).
- There is no build system, package manager, or test runner in the repo.
- Main deliverable today is `lab1/index.html` + `lab1/style.css`, a single-page Ukrainian travel blog layout.

## Architecture and Data Flow
- `lab1/index.html` is the source of truth for structure and content; all behavior is declarative HTML/CSS.
- `lab1/style.css` maps directly to semantic sections and class names from HTML.
- In-page navigation uses hash anchors: `#articles`, `#publication`, `#my-posts` from header links to section IDs.
- Content flow is section-based: article cards (`.articles-grid`), full post (`.full-post`), author dashboard (`.author-panel`).

## Styling Patterns to Preserve
- Layout is Flexbox-first across components (`.header-inner`, `.main-nav`, `.articles-grid`, `.post-list li`, `.footer-inner`).
- Responsive behavior is controlled only by CSS media queries at `900px`, `600px`, and `420px`.
- Card grid sizing uses `flex: 1 1 calc(...)` (3/2/1 columns by breakpoint); keep this pattern when adding cards.
- Visual style uses soft shadows, rounded corners, and muted grayscale text colors with cyan/red action accents.

## External Dependencies and Integrations
- Fonts are loaded from Google Fonts in `lab1/index.html` (`Inter` family).
- Demo images are fetched from `https://picsum.photos/...` seeds directly in HTML.
- Because images/fonts are remote, offline rendering may differ; avoid assuming local assets exist.

## Repo-Specific Editing Conventions
- Existing comments and UI text in `lab1/` are Ukrainian; keep language consistent unless asked otherwise.
- Prefer semantic HTML (`header`, `main`, `section`, `article`, `aside`, `footer`) as already established.
- Keep class naming descriptive and component-scoped (examples: `.author-info`, `.post-actions`, `.card-body`).
- When adding a new section, wire both: header nav link and matching section `id`.

## Developer Workflow (No Toolchain)
- Quick preview: open `lab1/index.html` directly in browser.
- If running a local server is needed, use any static server; no repo scripts/configs are provided.
- Validate changes manually by checking desktop + tablet + mobile breakpoints in browser devtools.

## Current Gaps to Know
- `lab2/script.js` and `lab2/style.css` are empty stubs; no established JS architecture yet.
- Do not infer framework conventions (React/Vue/etc.); this is plain HTML/CSS at the moment.

