# Demo 7 — Full TypeScript migration

## What changed and why

The eight remaining application JavaScript modules were converted to TypeScript. All 12 source modules now use `.ts`, and `strict: true` remains enabled. No packages were installed.

| File | Change and reason |
| --- | --- |
| `src/state/state.js` → `state.ts` | Replace JSDoc with TypeScript types reusing Demo 6 domain models. Type setter parameters, nullable selected evidence, view keys (`ViewId`), and directory tabs (`PeopleTab`). |
| `src/utils/utils.js` → `utils.ts` | Type lookup inputs and nullable results, formatting helpers, and the existing raw/canonical evidence-person comparison. |
| `src/views/evidence.js` → `evidence.ts` | Type evidence arguments, form controls, events, async search, and detail lookups; use numeric timestamps for sorting. Preserve summary text previously selected by the absent-description fallback. |
| `src/views/people.js` → `people.ts` | Type tab and person-ID parameters. Preserve the displayed description/address fallback text without inventing absent JSON fields. |
| `src/views/timeline.js` → `timeline.ts` | Type controls, certainty, event targets and modal lookups. Compare the raw filter string with canonical IDs without asserting it is a valid ID. Use numeric timestamps for sorting. |
| `src/views/dashboard.js` → `dashboard.ts` | Type statistic-card parameters and timestamps; retain the existing description fallback and use the already-known card element in its listener. |
| `src/views/workspace.js` → `workspace.ts` | Type form controls, nullable DOM access, selected values, and the existing stored draft shape. Keep confidence as a string, matching input values. |
| `src/app.js` → `app.ts` | Type event binding and narrow input event targets. |
| `src/data/data.ts` | Update imports only; loading, normalization and error handling are unchanged. |
| `src/storage/storage.ts` | Update the state import only; preserve all storage keys and behavior. |
| `src/navigation/navigation.ts` | Update imports and express the existing allowed-view check as a type guard before calling the typed setter. |
| `index.html` | Reference `app.ts` as the module entry; update its related comment. |
| `tsconfig.json` | Set `allowJs: false` and remove the obsolete `checkJs: false`. Keep the previous strictness and `src/**/*.ts` scope. |
| `EXERCISE_2.md` | Update only Demo 7: verified task checkboxes and concise question answers. |
| `DEMO_7.md` | Record migration decisions, actual compiler findings and demonstration steps. |

`src/data/types.ts`, original JSON, styles, package/lock files, Vite configuration and ESLint configuration are unchanged. Tool configuration files remain JavaScript; Demo 7 migrates the application source, not Node tooling configuration.

## Actual compiler findings and decisions

These diagnostics occurred during migration; none were invented just for documentation. Initial line numbers changed as annotations were added.

1. **Absent domain fields — genuine model/UI mismatch.**

   ```text
   error TS2339: Property 'description' does not exist on type 'Person'.
   error TS2339: Property 'address' does not exist on type 'Location'.
   error TS2339: Property 'description' does not exist on type 'Evidence'.
   error TS2339: Property 'description' does not exist on type 'Partial<CaseMetadata>'.
   ```

   The JSON really has no such fields. JavaScript silently read `undefined` and selected fallback content, hiding the mismatch. I retained that same displayed fallback (or evidence summary) and removed those invalid property reads. I did not add fake optional fields or replace the text with a different domain field. This confirms a real mismatch identified during the initial source review, not a newly discovered crashing bug.

2. **DOM elements and event targets — meaningful narrowing, no observed baseline failure.**

   ```text
   error TS18047: 'e.currentTarget' is possibly 'null'.
   error TS2339: Property 'getAttribute' does not exist on type 'EventTarget'.
   error TS2339: Property 'value' does not exist on type 'HTMLElement'.
   ```

   A generic event target is not necessarily an element or input. In delegated handlers I use `instanceof Element` or `HTMLInputElement`; in navigation I use the button already captured by the listener. Form queries use specific element types matching the checked-in HTML and retain null checks. Query selector type arguments describe our HTML contract; they do not validate the element class at runtime.

3. **Date subtraction — explicit conversion, not a latent sorting bug.**

   ```text
   error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
   error TS2363: The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
   ```

   JavaScript coerced `Date` objects to numbers during subtraction. I used `.getTime()` on both sides in Evidence, Timeline and Dashboard. This supplies the numeric operands TypeScript expects while preserving ordering, including the existing handling of invalid dates.

4. **View ID versus arbitrary string — a contract made explicit.**

   ```text
   error TS2345: Argument of type 'string' is not assignable to parameter of type 'ViewId'.
   ```

   State now accepts only the five view names. The existing `Set.has` check already validated a URL hash at runtime but did not narrow its TypeScript type. `isViewId(value): value is ViewId` connects the existing membership check to the state contract. Invalid hashes still select Dashboard.

5. **Nullable value captured by a callback — inference limitation here.**

   ```text
   error TS18047: 'ev' is possibly 'null'.
   ```

   Evidence detail already returned early when the lookup failed, but the callback captured a `var` binding. Making that lookup binding `const` allows the checked value to remain narrowed in the save-note callback. Similar stable references retain the checked modal/message elements in callbacks. No non-null assertion was needed.

## Type-safety limits and assignment answers

1. **One error worth explaining:** `Person.description` was not part of our real model. The old fallback made the screen appear normal even though the renderer requested a nonexistent property. Reusing the same domain model in state and views made the mismatch visible to the compiler. I kept the existing screen output instead of guessing a replacement field.
2. **When is `any` appropriate?** A narrow, documented compatibility boundary can occasionally require it, but it should not spread through application code. Here no explicit `any`, `@ts-ignore`, `@ts-nocheck`, or non-null assertion was needed. DOM checks, unions and nullable lookup results express the actual cases. Existing fetch/JSON APIs still provide unchecked runtime data: annotations and the local `Partial<HypothesisDraft>` assertion do not validate JSON. They make subsequent usage typed, not the input trustworthy.
3. **Did this expose a real bug?** It confirmed the genuine absent-field mismatch found during pre-migration inspection. Date subtraction was valid JavaScript, and the existing URL validation was already correct; these needed explicit types, not behavioral repairs. I did not discover or claim a new crashing bug. Browser comparisons support preservation of the tested flows, not proof that every possible runtime input is valid.

## Verification evidence

The unchanged Demo 6 checkout (`ea9236d`) was tested in headless Edge before editing. The same browser flow was run against migrated Vite development and production preview, then the recorded UI results were compared with assertions. The existing external browser test tools were reused; no project test dependency was installed.

| Check | Actual result |
| --- | --- |
| `npm run typecheck` | Pass: full source migration compiles under `strict: true`. |
| `npm run lint` | Pass after combining duplicate value/type imports. |
| `npm exec --no -- prettier --check "src/**/*.{js,ts}"` | Pass; this is the equivalent of `format:check`, which this project does not define. |
| `npm run build` | Pass: type checking plus production bundling. |
| `npm run dev -- --host 127.0.0.1 --port 5176 --strictPort` | Starts; TypeScript watcher reports zero errors. |
| `npm exec --no -- vite preview --host 127.0.0.1 --port 4176 --strictPort` | Starts; built application tested. |
| Evidence | 18 cards; calibration search returns 7; type/person/location/status/relevance filters, title sorting, details, bookmarks and saved notes match baseline. |
| People/Locations | Six people and six locations; Nova has five linked items and the same five Evidence results, including E04. |
| Timeline | 15 events; reversed ordering, filters, modal and full-evidence navigation match baseline. |
| Workspace/storage | Notes/bookmarks display and survive reload; bookmark links open detail; confidence displays 72 after input. |
| Targeted migration checks | People/location fallback text is unchanged; an existing stored hypothesis draft restores its person, evidence selection, confidence and text; invalid URL hashes still select Dashboard. Verified in development and preview. |
| Network/Console | All five JSON resources return 200, logo loads, and no new runtime/Console errors occur. Existing `/favicon.ico` 404 remains. |
| Demo 6 normalization | Raw E04 still contains `Nova Byte`; development state contains `nova-byte`. |
| CSS HMR | Still updates without document navigation and preserves unsaved text, route and local storage; temporary CSS edit restored. |

Existing Dashboard generated content remains empty and the hypothesis Save button still does not persist its draft, exactly as in the before-migration browser run. These previously documented bugs were not repaired as part of a behavior-preserving migration. Runtime JSON/storage schema validation also remains outside this demo.

## What to show / What to say

Open these four locations:

1. `src/state/state.ts`: domain imports, typed collections/setters, `ViewId`, and `Evidence | null`.
2. `src/views/people.ts`: typed person counting and preserved fallback text; compare with the committed JavaScript using `git show HEAD:src/views/people.js` before committing.
3. `src/views/evidence.ts`: typed DOM queries, event-target guard, `.getTime()` sorting and the checked `const ev` detail lookup.
4. `src/navigation/navigation.ts`: `isViewId` validates an incoming string before the state setter accepts it.

Say: “All application modules now use TypeScript with strict checking. The views and state reuse Demo 6's domain models, so the compiler exposed fields the JSON never supplied. I resolved nullable DOM access and made numeric date comparisons explicit while preserving the existing screen behavior. The browser checks match the pre-migration baseline; types still do not validate incoming JSON.”

### Live commands and actions

From the project directory:

```powershell
npm run typecheck
npm run lint
npm exec --no -- prettier --check "src/**/*.{js,ts}"
npm run build
npm run dev -- --host 127.0.0.1 --port 5176 --strictPort
```

Open `http://127.0.0.1:5176/`. Show Evidence search/filtering, Nova's five items, People/Locations, Timeline ordering and its evidence modal. Save a note/bookmark and reload to demonstrate persistence. Show Network's five successful JSON responses and Console with no new migration errors. Navigate to `#not-a-view` and show the existing Dashboard fallback.

For a quick compiler demonstration, temporarily remove `.getTime()` from both operands of one Evidence sort comparator, save, and run `npm run typecheck`. Explain TS2362/TS2363 above, restore both calls, and rerun successfully. Do not commit the deliberate error. The original migration already produced those diagnostics; this is a way to reproduce that finding live.

### Checklist and review

The three technical Demo 7 task checkboxes are fulfilled: full strict migration, at least three documented compiler findings, and browser behavior comparison. The question answers are prepared here and in `EXERCISE_2.md`; the oral-question checkboxes stay unticked until the student can explain them live. No Demo 8–10 work was performed.

```powershell
git status
git diff --stat
git diff
```

Before staging, Git shows the renamed modules as deleted `.js` files and untracked `.ts` files. Plain `git diff` does not include untracked files; open the new files in VS Code, or use e.g. `git diff --no-index -- /dev/null src/state/state.ts` (exit code 1 indicates a difference). Once you decide to stage, Git can detect the renames. Nothing was automatically staged, committed, or pushed.

Suggested commit message: `refactor: complete strict TypeScript migration for demo 7`.
