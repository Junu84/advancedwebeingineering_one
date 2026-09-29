# Demo 2 - Vite development server

## Changes and commands

The existing root `index.html` already loads `./src/app.js` using
`type="module"` and links `styles.css`. Vite uses this directory as its root.
Existing `fetch('./data/....json')` calls and `assets/` URLs work in development
without moving files. No `vite.config.js`, framework, or application refactor is
needed. This conclusion concerns development; production builds are Demo 3.

Changes: add Vite to `devDependencies` and `"dev": "vite"` to package.json;
update npm's package-lock.json; add this demonstration record. The Demo 1
`serve` dependency remains available for comparison. No application source
changes remain: the CSS HMR edit was restored byte-for-byte after verification.

Installation performed:

```powershell
npm view vite version engines
npm install --save-dev vite@8.3.1
npm pkg set scripts.dev=vite
npm ls --depth=0
```

Verified Vite 8.3.1 with Node v20.19.6 and npm 10.8.2. npm reported zero
vulnerabilities on installation. No production build or preview was run.

## Run from VS Code

If the terminal is in the parent `exercises` directory, first run:

```powershell
cd mystery-road-awe-2026
```

Then run (dependencies are already installed here):

```powershell
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open **http://127.0.0.1:5173/**. The terminal reports Vite 8.3.1 and the same URL.
`--strictPort` prevents silently switching to a different port. Use Ctrl+C to stop.
On a fresh checkout with the lockfile available, run `npm ci` before starting.

Optional old-server comparison, in a second terminal:

```powershell
npm exec --no -- serve . --listen tcp://127.0.0.1:8080 --no-clipboard
```

Open http://127.0.0.1:8080/. Different ports are different browser origins:
localStorage on 8080 does not automatically appear on 5173. Keep using the same
host and port for your saved demonstration data.

## Browser verification actually performed

Automated checks used headless Microsoft Edge in fresh, isolated browser contexts
on both servers, so personal browser storage was not changed. Browser automation
was installed only in the operating system temporary directory, not in this
project's dependencies. Results matched on both servers:

| Area | Observation |
|---|---|
| Dashboard | Heading, introduction and navigation work; generated content area is empty on both servers (existing defect). |
| Evidence | 18 cards; searching `calibration` produces 7 results after the asynchronous search finishes. |
| Filters | Type `test-report`: 2; Signal Scholar: 3; L01: 9; unreviewed: 17; unknown relevance: 18. Clear restores 18. |
| Sorting/detail | Title ascending works; opening a card displays its detail and note controls. |
| People | Six named people, with linked-evidence counts. |
| Locations | Six named locations; switching tabs works. |
| Timeline | 15 events; descending reverses ascending order; Signal Scholar: 3, L01: 5, report: 1. |
| Timeline links | Quick view opens; Open full evidence navigates to the matching detail. |
| Workspace | Bookmark and saved note appear; bookmark Open navigates to detail. Both persist after reload. Confidence slider updates its output. |
| Hypothesis Save | Does not persist on either server (existing defect). |
| Data/assets | All five JSON requests return 200; logo loads; all 12 files in data/ and assets/ match their original bytes over Vite HTTP. |
| JavaScript errors | No uncaught page errors in either tested flow. |

Existing defects were deliberately preserved: `dashboard.js` targets
`dashCaseTitle`, `dashCaseDesc`, `dashboardStats`, and `dashboardRecentEvidence`,
which are absent from index.html. The Save hypothesis button listener is placed
inside `saveHypothesis()` in workspace.js, so the button never initiates the first
save. People cards currently render text, not portrait images; direct asset checks
confirmed the portraits are still available. Do not claim these missing behaviors
were fixed by installing Vite.

## Professor-ready click-through

1. Start Vite with the command above. Open DevTools Network, enable Disable cache,
   and reload once. Show `/@vite/client`, `src/app.js`, and the other ES modules.
   Filter Fetch/XHR: show case.json, people.json, locations.json, evidence.json,
   timeline.json with status 200 and actual JSON in Response. Under Img, show
   `assets/logo/logo.svg`. Open `/assets/people/signal-scholar.png` in a separate
   tab if you want to demonstrate a portrait URL as well.
2. Dashboard: show the introduction and click Go to Evidence. Explain the
   pre-existing empty generated Dashboard area if asked; the old server reproduces it.
3. Evidence: show 18 cards. Search `calibration`, wait for 7 cards, then Clear.
   Try the filters and expected counts above, clearing between each. Sort Title
   A-Z. Bookmark Approved release manifest (E12), open its card, type a note and
   click Save note. Confirm its preview updates.
4. People & Locations: show six people; click Locations and show six locations;
   switch back to People.
5. Timeline: show 15 events, reverse ordering, try the filters above, then reset
   them. Click a View evidence button, then Open full evidence; show the matching
   Evidence detail.
6. Workspace: show the E12 bookmark and saved note. Click its Open button to prove
   navigation. Return to Workspace, reload, and confirm the saved note/bookmark
   return. Move Confidence and show its displayed value. The hypothesis Save
   defect is present on both servers; do not use it as persistence evidence.

## HMR demonstration: one safe CSS change

Use CSS for this test because Vite handles stylesheet replacement automatically;
the existing JavaScript has no custom HMR accept handlers. Do not claim arbitrary
JavaScript edits will preserve state: they can fall back to a full reload.

1. In Workspace, type `UNSAVED HMR DEMO` in Written explanation. Do not save.
2. In DevTools Console, run:

   ```js
   window.__hmrMarker = 'demo2-alive';
   window.__hmrTimeOrigin = performance.timeOrigin;
   ```

3. Clear Network entries and leave Network recording. In VS Code `styles.css`,
   change this existing declaration in `:root` and save:

   ```diff
   -  --color-header: #16233b;
   +  --color-header: #6b21a8;
   ```

4. Observe the header's gradient change to purple while the page remains on
   Workspace and the unsaved text remains. The terminal reports
   `hmr update /styles.css?direct`. Network shows the stylesheet update, with no
   new document navigation or five-JSON startup sequence. Inspect the WebSocket
   connection's Messages to see the CSS update notification if desired.
5. In Console, run:

   ```js
   [window.__hmrMarker, performance.timeOrigin === window.__hmrTimeOrigin,
    location.hash, document.querySelector('#hypExplanation').value]
   ```

   Expected: `['demo2-alive', true, '#workspace', 'UNSAVED HMR DEMO']`.
   LocalStorage alone is not proof of HMR because it also survives a full reload.
6. Restore `#16233b` and save. The header changes back through HMR. Pause between
   saves so the two changes are distinct filesystem events.

Observed in the automated test: purple applied, **zero document navigations**,
identical performance.timeOrigin, unchanged page marker, route, unsaved draft,
and localStorage containing the saved note/bookmark. Restoring the color was also
verified. An initial automation attempt restored the file too quickly for a second
watch event; the final test separated the saves and verified both updates.

## Short answers

1. **Old server versus Vite?** `serve` delivered our files as static resources.
   Vite also processes the HTML/module graph, injects `/@vite/client`, watches
   source files and connects to the browser for updates.
2. **One extra capability?** Our stylesheet changed immediately through CSS HMR;
   the plain static server does not provide that update mechanism.
3. **What is HMR?** Updating affected modules/styles in a running page without
   reloading the entire document. JavaScript needs suitable accept boundaries;
   CSS replacement is handled by Vite automatically.
4. **What happened here?** Saving the header color change triggered a CSS update.
   The header changed, with no document navigation and an unchanged time origin.
5. **What happened to state?** The unsaved hypothesis text, Workspace route,
   window marker, and stored note/bookmark remained. The CSS update did not
   reinitialize the application. This is not a guarantee for arbitrary JS edits.
6. **Why ES modules?** index.html already declares a module entry, and explicit
   imports/exports describe the dependency graph Vite can follow. No conversion
   or framework adapter was needed. A classic single-script file can still be
   served, but lacks those module boundaries for dependency-aware updates.

References: [Vite project root and manual setup](https://vite.dev/guide/),
[Vite features and CSS handling](https://vite.dev/guide/features.html).

## Demo 2 checkbox assessment

- [x] Install/configure Vite: installed as a devDependency, started successfully,
  and modules/data/assets verified with the existing layout.
- [ ] Every view works with the same functionality: tested behavior matches the
  static-server baseline, but Dashboard generated content and hypothesis saving
  already fail there. Do not claim all features work until those separate defects
  are resolved or the professor accepts documented baseline equivalence.
- [x] Trigger HMR without a full-page reload: CSS update and retained state verified.
- [x] Explain static server versus Vite: concrete observations and answer above.
- [x] Explain HMR and observed state: tested and documented above.
- [x] Explain ES-module integration: existing entry/import graph inspected and served.

The question answers are supported by this verification; rehearse them before
marking your personal self-check. EXERCISE_2.md itself was not modified. The full
Demo 2 Ready box should remain unticked given the functional limitations above.

## Git

Suggested Demo 2 commit: `chore: add Vite dev server and document HMR verification`

Include package.json, package-lock.json and DEMO_2.md. No staging, commit or push
was performed. Existing unrelated changes were left untouched. At inspection,
Demo 1's package files were still untracked, so plain `git diff` does not show
them. The Demo 2 package delta was compared against saved pre-change copies;
use `git diff --no-index` to inspect untracked files without staging them.

No build/preview scripts, TypeScript, linting, formatting, framework, or CI setup
was added. Demos 3-10 were not started.
