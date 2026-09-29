# Demo 5 - TypeScript setup and first conversions

## Scope and files

The assignment requires TypeScript setup, 2-3 converted modules without any,
zero compiler errors, and type errors surfaced by development/build tooling.
This note satisfies the exercise's running-record instruction and follows the
existing DEMO_1.md through DEMO_4.md pattern. No screenshot is required.
EXERCISE_2.md and earlier demo notes were not edited.

- navigation.js -> navigation.ts: typed navigateTo's string parameter and void
  return types. Hash validation, rendering and navigation behavior are unchanged.
- storage.js -> storage.ts: string parameters/returns, void returns and
  Promise<string>. JSON assertions describe the existing string-array and
  string-map storage format; they do not validate externally edited localStorage.
- src/state/state.js: four JSDoc annotations describe bookmarks, notesStore and
  their setters at the JavaScript/TypeScript boundary. No state behavior changed.
- src/app.js and src/views/evidence.js: import paths updated for renamed modules.
- tsconfig.json: strict checking for converted modules, with JavaScript allowed
  during this partial migration and no compiler output.
- package.json/package-lock.json: TypeScript 5.9.3, @typescript-eslint/parser
  8.71.0, vite-plugin-checker 0.14.5 as devDependencies. Version 5.9.3 is compatible
  with the parser's supported TypeScript range; the newest TypeScript major was
  outside it. No application framework was added.
- eslint.config.js: existing rules cover JS and TS; the TypeScript parser handles
  TS syntax. no-undef stays on for JS and is handled by the compiler for TS.
- format script: covers both .js and .ts without formatting unrelated documents.
- vite.config.js: checker({ typescript: true, enableBuild: false }) reports type
  errors continuously in development. The existing runtime-file copy hook remains.
  Build checking happens explicitly in the build script to avoid checking twice.

No domain interfaces, JSON data-loader conversion, full migration, or CI work was
done. Those belong to Demo 6 and later. Development now requires Vite to transform
TypeScript; preview serves the compiled JavaScript from dist/.

## Compiler choices to explain

| Setting | Reason |
|---|---|
| strict: true | Enables the strict family, including noImplicitAny and strictNullChecks. Missing parameter types cannot silently become any, and nullable values need handling. |
| allowJs: true, checkJs: false | Allows imports from existing JS without attempting Demo 7's whole-application checking. Imported JS is part of the program but remains unchecked. |
| noEmit: true | tsc checks types; Vite performs code transformation and bundling. No duplicate JS files are written beside source. |
| module: ESNext, moduleResolution: Bundler | Matches the existing ES-module/Vite setup. |
| allowImportingTsExtensions: true | Explicit .ts import paths work with Vite and this no-emit configuration. |
| target: ES2022, lib: ES2022/DOM | Modern JavaScript and browser APIs such as document and localStorage. Vite still controls its production output target. |
| types: [] | Avoids automatically introducing installed ambient Node/test globals into browser source. |
| include: src/**/*.ts | Starts checking with the two converted modules and follows their imports. |

No explicit any, @ts-ignore, or @ts-nocheck was added to the converted modules.
Unchecked JavaScript imports and JSON assertions still limit the overall safety:
this is a first migration step, not a claim of full application type safety.

## Verification performed

```powershell
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm exec --no -- prettier --check "src/**/*.{js,ts}"
npm run build
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
npm exec --no -- vite preview --host 127.0.0.1 --port 4175 --strictPort
```

- Strict typecheck, lint, lint:fix, formatting/check and build passed. Format
  reported all source files unchanged. The final build retains the previous
  JS/CSS output filenames and sizes (20,562-byte JS, 11,442-byte CSS).
- Development reported `Found 0 errors. Watching for file changes.`
- Temporarily replaced storage.ts's key declaration with
  `const STORAGE_KEY_BOOKMARKS: string = 123;`. The running dev terminal and browser
  overlay displayed TS2322: Type 'number' is not assignable to type 'string'.
- With that error present, npm run build exited with code 2 during typecheck,
  before Vite built anything. The source was restored, development returned to
  zero errors, and the final build passed. No deliberate error remains.
- Edge browser checks in development and preview verified: 18 evidence records,
  calibration search = 7, filters/sorting, six people, six locations, 15 timeline
  events, modal-to-evidence navigation, saved notes/bookmarks surviving reload,
  and the confidence slider. JSON and the visible logo loaded; no uncaught page
  errors occurred in the normal tested flows. CSS HMR retained state with zero
  document navigations. The temporary CSS edit was restored.
- Existing Dashboard generated-content and hypothesis-save defects documented
  in earlier demos remain unchanged. This migration did not silently fix them.
- Existing temporary browser test tooling was reused, outside project dependencies.

## How to prove Demo 5 to my professor

From mystery-road-awe-2026:

1. Open tsconfig.json, navigation.ts and storage.ts. Show strict, noEmit, the
   partial-migration allowJs/checkJs choices, string parameters and Promise<string>.
   Run `npm run typecheck`: expect exit code 0 with no errors.
2. Start `npm run dev -- --host 127.0.0.1 --port 5175 --strictPort`. Open
   http://127.0.0.1:5175/. Show the terminal's zero-error watch message.
3. Temporarily change storage.ts's declaration from:

   ```ts
   const STORAGE_KEY_BOOKMARKS = 'mystery_road_bookmarks';
   ```

   to:

   ```ts
   const STORAGE_KEY_BOOKMARKS: string = 123;
   ```

   Save. Show TS2322 in both the dev terminal and the browser overlay. The checker
   reports errors asynchronously; Vite can still transpile invalidly typed code.
   The production build is the blocking check.
4. In a second terminal run `npm run build`. Expect exit code 2 and no Vite build.
   Restore the original declaration and save. Show the watcher returning to zero
   errors, then run `npm run typecheck`, `npm run lint`, and `npm run build` again.
5. On the clean app, navigate Evidence -> People/Locations -> Timeline -> Workspace.
   Bookmark evidence, save a note, then reload and show both persist. Keep DevTools
   Console visible to show no unexpected JavaScript exceptions. TS type errors
   were compiler diagnostics, not runtime exceptions from these actions.

Important locations: tsconfig.json's strict/allowJs/checkJs/noEmit; package.json's
typecheck/build scripts; checker call in vite.config.js; navigation.ts's navigateTo;
storage.ts's string parameters, Promise<string> and guarded getItem result;
the four JSDoc annotations in state.js and TypeScript parser block in ESLint.

## Answers in student wording

1. **What does strict turn on?** "It enables a family of checks, including
   noImplicitAny and strictNullChecks. I kept it on so untyped parameters and
   nullable values cannot quietly bypass checking. I left checkJs off only to
   keep the remaining JavaScript outside this first conversion."
2. **Compile-time versus Exercise 1 runtime bugs?** "The number assigned to a
   string is caught before the build runs. Exercise 1's wrong People container
   ID and missing panel toggling are runtime/UI logic errors; TypeScript does not
   know which element ID I intended. The Timeline object-to-text bug could be
   caught if the lookup result and destination string array were typed, but that
   code remains JavaScript here. TypeScript alone does not validate fetched JSON
   or prove that view switching and asynchronous behavior are correct."
3. **Why avoid any?** "any permits unchecked operations and spreads that loss of
   checking to other values. I used string, string arrays, Record<string, string>
   and Promise<string> instead. The JSON assertions only express an assumption
   about existing stored data; they do not make untrusted JSON safe."

Five phrases to remember:

- "I converted two existing modules, not the whole application."
- "Strict TypeScript checks catch type mismatches before production builds."
- "Vite transforms code; tsc checks types without emitting files."
- "The dev checker watches edits; the build script stops on a type error."
- "Types do not replace runtime tests or JSON validation."

References: [TypeScript strict](https://www.typescriptlang.org/tsconfig/strict.html),
[Vite TypeScript checker](https://vite-plugin-checker.netlify.app/checkers/typescript.html).

## Assignment checkboxes

- [x] TypeScript installed; tsconfig strictness selected and justified.
- [x] Two existing modules converted without any annotations; strict compilation
  passes with zero errors.
- [x] Build and development surface type errors: failure, overlay, recovery and
  successful build verified.
- [x] Strict options explained using at least two individual checks.
- [x] Compile-time errors compared with actual documented Exercise 1 bugs.
- [x] any and the reason for avoiding it explained.

These reflect verified implementation and prepared answers. Rehearse your own
answers before marking live readiness in the original exercise. No technical
Demo 5 requirement remains; existing unrelated application defects are unchanged.

## Git review only

```powershell
git diff --stat
git status
git diff
git diff --no-index -- /dev/null tsconfig.json
git diff --no-index -- /dev/null src/navigation/navigation.ts
git diff --no-index -- /dev/null src/storage/storage.ts
git diff --no-index -- /dev/null DEMO_5.md
```

The renamed .ts files are untracked until staging, so plain git diff currently
shows old .js deletions and omits new-file contents. No-index diffs return 1 when
differences exist. No git add, commit, branch change or push was performed.
Suggested message after approval: `feat: add strict TypeScript checks and migrate navigation and storage`.
