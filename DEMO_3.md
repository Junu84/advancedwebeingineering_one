# Demo 3 - Production build and preview

## Goal and minimal change

EXERCISE_2.md requires a production build, inspection of dist/, verification with
vite preview, and comparison of development source with built output. The
concept is that a development server serves source, whereas a production build
creates static deployment files. Demo 1's npm setup and Demo 2's installed Vite
and native ES-module entry are prerequisites and were preserved.

The working tree was clean before this task. No npm packages were installed.
package.json, package-lock.json, index.html, styles.css, src/, data/, assets/ and
EXERCISE_2.md were not changed. No later-demo tools or scripts were added.

Changes:

- `.gitignore`: retained `node_modules/` and added `dist/`, which is generated
  build output. The final output remains on disk for demonstration.
- `vite.config.js`: new build-only plugin using Node's built-in cpSync. It copies
  the existing data/ and assets/ trees into the output without moving source files
  or changing browser URLs. This is a local Vite hook, not an installed plugin.
- `DEMO_3.md`: this explanation, verification record and live procedure.

Why the config is necessary: src/data/data.js calls
`fetch('./data/case.json')` and equivalent URLs for four other JSON files. These
runtime strings are not imports that enter the build graph. The unchanged build
produced only HTML, JS and CSS; none of the JSON or portrait files was included.
The small logo referenced by HTML was inlined as a data URL by Vite.

Before the fix, preview showed zero evidence cards and JSON parsing errors:
`Unexpected token '<'` because the missing JSON URLs returned HTML fallback.
The app also displayed its existing evidence-loading alert. A successful build
alone therefore did not prove the application worked.

The alternative of moving runtime files into public/ would also work, but the
copy hook preserves this repository's existing directory layout and old static
server workflow. Assets copied by this hook retain their original names/bytes;
Vite's generated JS/CSS are separate hashed files in dist/assets/.

## Commands used

From mystery-road-awe-2026:

```powershell
npm exec --no -- vite build
npm exec --no -- vite preview --host 127.0.0.1 --port 4173 --strictPort
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
npm ls --depth=0
git status --short
git diff -- .gitignore
git diff --exit-code -- package.json package-lock.json src styles.css index.html EXERCISE_2.md
git check-ignore -v dist/ node_modules/
```

The build command was run before and after the config change. npm exec runs the
already-installed Vite; --no prevents approving a missing-package installation.
No build or preview npm scripts are needed for this demo. Build scripts are also
explicitly covered in Demo 4, which was not started.

## Verified output and transformations

The final build contains 15 files: index.html, one JS bundle, one CSS file, five
JSON files and seven copied assets. Build output reports 15 transformed modules
(this includes Vite-generated and non-JavaScript entries, not 15 source JS files).

| Input | Output observed | Comparison |
|---|---|---|
| 11 JavaScript files under src/, 45,619 bytes total | assets/index-Bkt3EQM5.js, 20,562 bytes | Bundled together; code minified and identifiers shortened. |
| styles.css, 15,355 bytes, 822 newline-separated lines | assets/index-ZAWMSz9M.css, 11,442 bytes, 2 lines | Minified CSS and content-hashed filename. |
| index.html module entry and CSS link | dist/index.html references the two hashed output files | Entry references rewritten; no /@vite/client. |
| data/ and assets/ | dist/data/ and dist/assets/ | All 12 runtime files copied byte-for-byte by our hook. |

Sizes are on-disk bytes, not gzip transfer sizes. Hashes can change when source
or build tooling changes; always inspect the current output filenames.

Three directly observed Vite transformations: **bundling**, **minification**, and
**content-hashed filenames with rewritten HTML references**. The copy step is our
configuration, not an automatic Vite transformation of runtime fetch strings.

## Browser verification and limits

Headless Microsoft Edge used fresh browser contexts on preview port 4173 and
development port 5173. Existing temporary Demo 2 browser tooling was reused;
no testing dependency was added or installed. Personal browser storage was not
changed. Both modes matched:

- Dashboard introduction and navigation; its generated content remains empty.
- 18 evidence records; searching calibration gives 7 after the async search.
- Evidence filters: test-report = 2, Signal Scholar = 3, L01 = 9,
  unreviewed = 17, unknown relevance = 18. Clear restores all records.
- Title sorting, evidence detail, bookmarking and saving a note work.
- Six people and six locations; switching tabs works.
- 15 timeline events; reversing sort reverses the order. Filters produce
  Signal Scholar = 3, L01 = 5, report = 1. Quick view opens full evidence.
- Workspace displays bookmarks and saved notes, and Open navigates to detail.
  Notes/bookmarks survive reload. The confidence slider updates its output.
- The hypothesis Save button still does not persist the draft in either mode.
- All five JSON resources load successfully. The displayed logo loads. All 12
  runtime files were compared with source bytes on disk and over preview HTTP.
- No uncaught JavaScript page errors in the tested post-fix flows.
- Preview HTML references the built bundle, not src/app.js or /@vite/client.
- Development CSS HMR was re-tested: zero document navigations and retained
  unsaved text, route, page marker, time origin and localStorage. CSS was restored.
- npm's direct dependencies remain serve@14.2.6 and vite@8.3.1; the lockfile is
  unchanged, and node_modules/ remains ignored.

Two pre-existing defects documented in Demo 2 remain: dashboard.js targets
elements absent from index.html; the hypothesis Save listener is registered inside
its own save function. Neither was silently fixed. Therefore build/preview parity
is verified, but a claim that every application feature works end-to-end would
be inaccurate.

## How to prove Demo 3 to my professor

1. In a VS Code terminal in mystery-road-awe-2026, run:

   ```powershell
   npm exec --no -- vite build
   Get-ChildItem dist -Recurse -File | Select-Object FullName,Length
   npm exec --no -- vite preview --host 127.0.0.1 --port 4173 --strictPort
   ```

   Open http://127.0.0.1:4173/. This is preview of dist/, not development.

2. In a second terminal, run:

   ```powershell
   npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
   ```

   Open http://127.0.0.1:5173/. The ports are separate origins, so saved localStorage
   data is not shared between them. Stop each server with Ctrl+C when finished.

3. Show VS Code side-by-side: styles.css and dist/assets/index-*.css. Point out
   readable source versus minified output, the filename hash and measured sizes.
   Also show src/app.js imports and dist/index.html's single bundle reference.
   Do not edit generated files or commit dist/.

4. Open DevTools Network on both pages, enable Disable cache, and reload. On dev,
   show /@vite/client and separate src/ modules. On preview, show the hashed JS/CSS,
   no dev client, and all five JSON requests. Inspect Response as well as status:
   the pre-fix HTML fallback could return 200 but was not valid JSON. Console
   should no longer show JSON parse errors. The logo may be a data URL in preview.

5. In preview: Dashboard -> Go to Evidence; search calibration (7), Clear (18),
   filter/sort, bookmark Approved release manifest (E12), open it and save a note.
   Visit People and Locations (six each). Visit Timeline (15), reverse order,
   filter, open an evidence quick view and then Open full evidence. Visit Workspace,
   show your note/bookmark, reload, and show both remain. Explain the two baseline
   limitations rather than claiming Dashboard statistics/hypothesis persistence work.

Expected BEFORE: development serves readable separate modules and HMR. The
unconfigured production build succeeded but lacked runtime JSON and preview
displayed zero evidence with parse errors.

Expected AFTER: preview serves the generated bundle and CSS plus actual JSON and
assets from dist/. The tested workflows match development. Preview does not build
or provide HMR; after changing source, rebuild and reload preview to see it.

Four sentences to say:

1. "Vite follows our ES-module entry and bundles and minifies it for production."
2. "The built HTML points to hashed JavaScript and CSS; changed content gets a new
   URL, allowing cached old assets to coexist with a new deployment."
3. "Our JSON URLs are runtime fetch strings, so this build hook copies those files
   while keeping the existing paths and application code."
4. "Preview tests the static output locally; deployment serves dist/ from a
   production static host, not the development or preview server."

Follow-up lines to explain:

- vite.config.js:1-3: built-in filesystem/path helpers and Vite config helper.
- vite.config.js:8: apply: 'build' keeps the hook out of the development server.
- vite.config.js:9: writeBundle runs after output is written; dir is its output directory.
- vite.config.js:11-13: copy just data/assets recursively from the config directory
  into that output, preserving their relative URLs.
- .gitignore:2: dist is generated, while source/config/lockfile remain versioned.
- src/data/data.js:43,47,51,70,92: unchanged runtime fetch URLs requiring the copy.
- dist/index.html:8-9: generated module and stylesheet URLs; hashes may differ later.

## Assignment questions

- **Three transformations?** The 11 JS source files were bundled; JS/CSS were
  minified; output JS/CSS received hashes and HTML references were rewritten.
- **Why content hashes?** When content changes, its URL changes, preventing a
  browser/CDN from reusing an outdated asset under the same URL. Unchanged hashed
  assets can be cached for a long time when the host sets suitable cache headers.
  Hashing alone does not configure caching; HTML must stay fresh enough to point
  to the current assets. Copied JSON retains stable names and needs its own cache policy.
- **Why not deploy vite dev?** It serves development source with transformation,
  watcher and HMR infrastructure, not the optimized static artifact. It is intended
  for development rather than production serving. vite preview is also only a
  local verification server; a real host should serve dist/.

References: [Vite production build](https://vite.dev/guide/build),
[Vite local preview and deployment](https://vite.dev/guide/static-deploy).

## Demo 3 checklist

- [x] Production build run and dist inspected.
- [ ] Preview works end-to-end in every feature: preview and baseline parity tested,
  but existing Dashboard/hypothesis defects remain. Preview itself is verified;
  the unqualified end-to-end checkbox is conservatively left open.
- [x] Source/output filenames, sizes and minification compared.
- [x] Three actual transformations identified above.
- [x] Content-hash purpose explained above.
- [x] Development-server deployment distinction explained above.

Rehearse the question answers before marking personal live readiness. The original
EXERCISE_2.md remains untouched; Demo 3 should not be called fully Ready while
the unqualified end-to-end condition remains unresolved.

## Git commands (not executed for staging/commit)

```powershell
git status --short
git diff -- .gitignore
git diff --no-index -- /dev/null vite.config.js
git diff --no-index -- /dev/null DEMO_3.md
git add -- .gitignore vite.config.js DEMO_3.md
git diff --cached --check
git diff --cached --stat
git diff --cached
git commit -m "build: preserve runtime files in Vite production output"
```

Git treats /dev/null as the empty side of a new-file diff, including on Windows.
The no-index diffs exit with code 1 when differences exist; this is expected.
Inspect the staged diff before committing. Only the three named Demo 3 files
should be staged. dist/ and node_modules/ must not be committed.

No files were staged, committed or pushed by the assistant. Demos 4-10 were not started.
