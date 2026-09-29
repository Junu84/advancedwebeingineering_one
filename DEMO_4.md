# Demo 4 - npm lint and format scripts

## Goal and scope

Demo 4 requires configuring a linter and formatter, providing real dev/build/lint/
lint:fix/format scripts, and demonstrating a reported issue and an automatic edit.
This file follows the established DEMO_1.md through DEMO_3.md notes pattern.
EXERCISE_2.md and earlier demo documentation remain unchanged.

Only ESLint 10.11.0 and Prettier 3.9.9 were added as devDependencies. Both work
with the installed Node v20.19.6. No framework, TypeScript, or CI was introduced.
The existing Vite build/copy configuration and directory layout are unchanged.

## Files and decisions

- package.json: retains dev = vite; adds build = vite build, lint = eslint src,
  lint:fix = eslint src --fix, format = prettier --write "src/**/*.js".
- package-lock.json: records the two development tools and their dependencies.
- eslint.config.js: flat ES-module configuration for src/**/*.js, with browser
  globals declared read-only and focused built-in rules: no-undef, no-debugger,
  no-unreachable, no-dupe-args, no-dupe-keys, no-duplicate-imports, prefer-const.
  No formatting rules or extra rule packages are needed. This is an intentionally
  small rule set, not every ESLint rule or a guarantee that the app is bug-free.
- .prettierrc.json: single quotes where appropriate, two-space indentation,
  semicolons, LF line endings. Other formatting choices use Prettier defaults.
- .prettierignore: excludes node_modules/ and dist/ when invoking Prettier directly.
- All 11 src/**/*.js files: mechanical Prettier formatting (indentation, quotes,
  wrapping, commas and line endings); no application refactor.
- src/state/state.js additionally changes export let viewRendered to export const
  viewRendered, as automatically fixed by prefer-const. Its binding is never
  reassigned; its properties can still be updated by setViewRendered/navigation.
- DEMO_4.md: this verification record and live guide.

Formatting is deliberately scoped to application JavaScript. It does not rewrite
completed demo notes, the assignment, Vite configuration, JSON data, HTML or CSS.

## Commands and observed evidence

```powershell
npm install --save-dev eslint@10.11.0 prettier@3.9.9
npm run lint
npm exec --no -- prettier --check "src/**/*.js"
npm run lint:fix
npm run format
npm run lint
npm exec --no -- prettier --check "src/**/*.js"
npm run build
```

Initial lint result (before formatting):

```text
src/state/state.js
  21:12  error  'viewRendered' is never reassigned. Use 'const' instead  prefer-const
```

The check failed with exit code 1. Prettier's initial check reported formatting
issues in all 11 source modules. lint:fix changed viewRendered to const; format
rewrote the source layout. For example, the misindented evidence sorting branches
and evidence detail guard are now consistently indented; one-line state setters
are expanded. Those formatting edits do not fix business logic.

A temporary exported demo4Probe function containing a never-reassigned let label
was also tested: lint reported prefer-const, lint:fix changed it to const, and the
temporary function was removed. No intentional failure remains in the app.

Final results:

- lint passes with no findings; Prettier --check passes.
- lint:fix was observed making a real edit; format changed all 11 source files.
- build passes, retaining the existing runtime-data/asset copying behavior.
- All 11 current source files were compared against Prettier applied to their
  committed versions, allowing only the viewRendered let-to-const change: matched.
- Edge browser checks passed in development and preview: 18 evidence records,
  calibration search = 7, filters/sorting, six people, six locations, 15 timeline
  events, evidence quick-view navigation, saved notes/bookmarks and reload persistence.
- No uncaught JavaScript page errors in those flows. Development CSS HMR still
  preserves the page and state; its temporary CSS edit was restored.
- The known empty generated Dashboard content and non-saving hypothesis button
  remain unchanged; they are unrelated to Demo 4. Passing lint does not prove
  application behavior is correct.

Existing temporary browser tooling was reused outside the project. No testing
package was installed. Port 5173 was already serving this project and was left
running. Starting the dev script separately on free port 5174 also succeeded.

## Professor-ready demonstration

Run commands in mystery-road-awe-2026.

1. Show package.json's five scripts, eslint.config.js's files/globals/rules, and
   .prettierrc.json. Explain that both tools are local devDependencies.
2. In src/state/state.js temporarily change only `export const viewRendered = {`
   to `export let viewRendered = {`. Save and run:

   ```powershell
   npm run lint
   ```

   Expect prefer-const, exit code 1, and no automatic source edit. Explain that
   mutating properties does not require reassigning the object binding.
3. Run:

   ```powershell
   npm run lint:fix
   ```

   Show let automatically becoming const. Lint now passes. Other errors such as
   an undefined name may require manual correction; --fix does not fix everything.
4. In that same file temporarily collapse the setter to:

   ```js
   export function setAllEvidence(data){allEvidence=data;}
   ```

   Save, then run `npm run format`. Show the restored spaces and multiline body.
   This formatting edit is separate from the linter's binding check.
5. Run final checks:

   ```powershell
   npm run lint
   npm exec --no -- prettier --check "src/**/*.js"
   npm run build
   ```

   All should succeed. Review `git diff -- src/state/state.js` against the committed
   baseline. Once Demo 4 itself is committed, the temporary demo edits should leave
   no diff after fixing and formatting them.
6. For browser regression evidence, use the existing http://127.0.0.1:5173/ or start:

   ```powershell
   npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
   ```

   Open http://127.0.0.1:5174/. Click Evidence (18), search calibration (7), clear,
   visit People/Locations and Timeline, then save a note/bookmark and inspect
   Workspace. DevTools Console should show no new JavaScript exceptions. Browser
   evidence confirms regression behavior; the terminal and source diff are the
   primary evidence for linting/formatting.

## Student-level answers

1. **Linter versus formatter:** "ESLint checks the code against rules. Here it
   caught viewRendered using let although it is never reassigned. Prettier handles
   presentation: it fixed inconsistent indentation and wrapped long expressions.
   A formatter is not checking whether my application logic is correct."
2. **Why lint and lint:fix?** "lint reports problems without changing my files, so
   it is useful for reviews and automated checks. lint:fix explicitly allows safe
   automatic edits while I develop. I still review the diff and fix anything it
   cannot handle."
3. **What does npm run lint do?** "npm reads the lint script in package.json and
   runs eslint src through a shell from the package root. npm adds node_modules/.bin
   to PATH, so the local ESLint executable is used. A global ESLint could happen
   to work if it is on PATH, but a teammate might not have it or might have another
   version. The local devDependency and lockfile make the setup reproducible."

References: [ESLint flat configuration](https://eslint.org/docs/latest/use/configure/configuration-files),
[Prettier CLI](https://prettier.io/docs/cli).

## Each Demo 4 checkbox

- [x] Linter and formatter installed and configured for the existing JavaScript.
- [x] dev, build, lint, lint:fix and format scripts actually executed successfully.
- [x] Lint caught an issue; automatic lint fix and formatting edits observed.
- [x] Concrete linter/formatter findings documented and explained above.
- [x] Separate checking/fixing commands demonstrated and their purpose explained.
- [x] npm script execution/local binary resolution explained above.

These describe verified work and prepared explanations. Rehearse the answers
before ticking personal live-readiness boxes in EXERCISE_2.md; that file was not
edited. No Demo 5 or later work was performed.

## Git review

```powershell
git status
git diff --stat
git diff -- package.json src/state/state.js
git diff -- src
git diff -- package-lock.json
git diff --no-index -- /dev/null eslint.config.js
git diff --no-index -- /dev/null .prettierrc.json
git diff --no-index -- /dev/null .prettierignore
git diff --no-index -- /dev/null DEMO_4.md
```

The no-index commands show new untracked files; exit code 1 means a diff exists.
Do not commit node_modules/ or dist/. Nothing was staged, committed or pushed.
Suggested commit message, after approval: `chore: add lint and format scripts`.
