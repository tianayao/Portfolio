# Ocean Storybook Portfolio

A dependency-free, responsive product-design portfolio with a continuous ocean narrative and an in-page Storybook case-study reader. It is built with semantic HTML, focused CSS layers, and browser-native ES modules, so it can be served directly from the repository root on GitHub Pages.

The six included projects are explicitly illustrative concepts. They are placeholders for structure and interaction—not claims of delivered client work, completed research, or measured outcomes.

## Local preview

From the repository root:

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. The browser test harness is at `http://127.0.0.1:4173/tests/test.html`.

Run static verification with:

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
git diff --check
```

There is no package manager, compilation step, framework, or generated production bundle.

## Project structure

- `index.html` — semantic homepage, Storybook mount, About, Contact, and fallback copy.
- `assets/js/content.js` — the editable `profile`, `contact`, `projects`, `chapters`, and all illustrative case-study content.
- `assets/js/state.js` — deterministic project/chapter/gallery state.
- `assets/js/theme.js` — Coast, Moon, and Coral persistence with a safe fallback.
- `assets/js/ocean.js` — navigation, reveal enhancement, depth, and reduced-motion behavior.
- `assets/js/cards.js` — six code-native ocean silhouettes and card rendering.
- `assets/js/storybook.js` — accessible modal reader, page turns, gallery, focus, and scroll restoration.
- `assets/js/sections.js` — About/Contact binding, discoveries, pointer mode, and Back to Surface.
- `assets/css/` — tokens, base shell, ocean, cards, Storybook, deep sections, and release breakpoints.
- `tests/` — dependency-free browser integration tests and Python static checks.
- `references/prototypes/` — recovered source references; not required by the running site.

## Content replacement map

Edit `assets/js/content.js` first. The interface copy and media remain safe when fields are null.

| Replace | Location | Notes |
| --- | --- | --- |
| Name, role, introduction, philosophy, About story | `profile` | Replace every bracketed fallback with your own verified text. |
| Skills and interests | `profile.skills`, `profile.interests` | Arrays render as accessible lists. |
| Email, LinkedIn, résumé, extra links | `contact` | Null values create no destination. Use a real email, HTTPS URL, or local résumé path. |
| Project title, type, summary, accent | `projects` source records | Keep `illustrative: true` until the content describes real, supported work. |
| Six case-study chapters | `chapters` created by `chaptersFor()` | Replace narrative, insight, and evidence chapter by chapter. |
| Card cover media | each project’s `coverMedia` | Set `src`, accurate `alt`, and optional caption. |
| Storybook gallery media | each chapter’s `images` | Each image is independent: set `src`, accurate `alt`, and caption without changing the card silhouette. |
| Hero art | `assets/images/hero-jellyfish.png` | Preserve the intrinsic ratio or update the HTML width/height values. |
| Reef art | `assets/images/reef-garden.png` | Keep a transparent background; update intrinsic dimensions if replaced. |

Card silhouettes are inline SVG/CSS in `assets/js/cards.js`. Replacing `coverMedia` or gallery images does not require editing those silhouettes.

## Accessibility and motion

- Native landmarks, headings, links, buttons, skip link, focus-visible styling, and a named modal dialog.
- Keyboard/touch-operable cards, theme controls, discoveries, chapter controls, and galleries.
- Focus and scroll return to the originating card after the Storybook closes.
- `prefers-reduced-motion` removes parallax, smooth scrolling, continuous loops, bubble bursts, and timed page transforms while keeping every control and all content.
- Coarse pointers expose card notes without hover.
- Coast, Moon, and Coral use semantic tokens with tested body/chrome/focus contrast.

## Deployment

The repository includes `.nojekyll` and a `CNAME` for `tinana.co.uk`. Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for GitHub Pages and Wix DNS steps. Re-check provider instructions immediately before changing live DNS.
