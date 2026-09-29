# Demo 6 — Typing the domain data

## Scope and changed files

- `src/data/types.ts`: introduces `CaseMetadata`, `Person`, `Location`, `Evidence`, and `TimelineEvent` interfaces matching the actual JSON fields; `PersonId` and `RawEvidence` are type aliases.
- `src/data/data.js` becomes `src/data/data.ts`: annotates JSON results, function parameters and return values, and normalizes evidence person references before storing them. The existing load order, rendering calls, and error handlers remain.
- `src/app.js`: imports the renamed loader.
- `src/state/state.js`: JSDoc types connect shared collections and setters to the domain models without migrating this module. `caseData` is `Partial<CaseMetadata>` because it starts as `{}`; its setter accepts complete metadata.
- `DEMO_6.md`: records the implementation and demonstration evidence requested for this demo.

No packages were installed. JSON files, package configuration, the strictness settings, and the earlier Vite/build/lint setup are unchanged. Full migration belongs to Demo 7. With `checkJs: false`, the remaining JavaScript implementations are not fully type-checked; their JSDoc annotations provide contracts to TypeScript callers.

## Modeling decision

`data/evidence.json` E04 has `personIds: ["Nova Byte"]`, whereas `data/people.json` identifies that person as `"nova-byte"`. The original Evidence helper accepts either an ID or a name, but the People count compares only IDs. Before normalization, Nova therefore had four linked items in People but five in the Evidence filter.

`PersonId` is a union of the six canonical IDs in this case, not an alias for any string. `Person.id`, `Evidence.personIds`, and `TimelineEvent.personIds` use it. Adding a new person requires deliberately updating this union. `RawEvidence` uses `Omit<Evidence, 'personIds'>` and replaces that field with `string[]`, representing the legacy input separately from the application's canonical model.

In `loadEvidenceData`, each raw reference is matched against the already-loaded people's IDs or names, and replaced with the matching person's ID. An unmatched reference throws into the existing evidence-loading error handler. `loadAllData` already awaits people/locations before starting evidence and timeline loading, so this dependency does not require changing the loading sequence.

The original JSON remains unchanged as demonstration evidence. E04 is normalized only in memory. Nova's People count now correctly includes E04 and agrees with the five filtered Evidence cards. This count correction is the visible consequence of the requested normalization.

All actual JSON fields remain required. Dates remain strings because that is their JSON representation. Evidence status/relevance unions retain the legacy `Reviewed` and `Unknown` spellings as well as the existing UI choices. Timeline certainty uses `confirmed | reported | contradictory`. `bookmarked?: boolean` is an additional application field populated after loading, not a required JSON field.

## Verification performed

From the project directory:

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed; also passed again after restoring the deliberately invalid value. |
| `npm run lint` | Passed. |
| `npm exec --no -- prettier --check "src/**/*.{js,ts}"` | Passed. |
| `npm run build` | Passed strict type checking and production build. |
| `npm run dev -- --host 127.0.0.1 --port 5176 --strictPort` | Started successfully; watcher reported zero TypeScript errors. |
| `npm exec --no -- vite preview --host 127.0.0.1 --port 4176 --strictPort` | Started successfully; built application tested. |

Browser verification used headless Edge with the existing external test tooling; no test dependencies were added to the project. Results on both development and production preview:

- Evidence: 18 cards; search for `calibration` returns 7; type/person/location/status/relevance filters and title sorting work; details open.
- Nova's filter returns E04, E18, E05, E06, E17; People shows **5 linked evidence items**. All six people and six locations render.
- Timeline: 15 events; reverse ordering, person/location/type filters, evidence modal and opening full evidence work.
- Workspace: saved notes and bookmarks display, open evidence, and survive reload; confidence display updates to 72.
- All five JSON responses return HTTP 200. The response still contains E04's `"Nova Byte"`; development application state contains `["nova-byte"]`. The displayed logo loads.
- No uncaught JavaScript exceptions or data-loading errors. The browser's automatic `/favicon.ico` request returns 404 on both servers; this is an existing missing file, not a Demo 6 regression.
- Demo 2 CSS HMR still works: temporary header color change caused zero document navigations, preserving the unsaved Workspace text, time origin, marker, URL hash, and stored notes/bookmarks. The original CSS was restored.

Existing limitations remain: the Dashboard content area is empty because its renderer expects absent element IDs, and Save hypothesis does not persist because its click listener is registered inside the save function. These issues exist in the committed code and were left outside Demo 6. Workspace verification does **not** claim that hypothesis saving works.

## How to prove Demo 6 to my professor

1. In VS Code, open `data/evidence.json` at E04 (`personIds`, line 48) and `data/people.json` at Nova (lines 32–33). Show the name versus canonical ID.
2. Open `src/data/types.ts`: explain `PersonId` (line 1), `Evidence.personIds` (line 46), and `RawEvidence` (line 57). Open `src/data/data.ts`: show typed fetch results (lines 60–68), normalization (lines 87–97), and the existing awaited core load (line 139). Show the collection/setter JSDoc in `src/state/state.js`.
3. Temporarily append this line to `src/data/types.ts` and save:

   ```ts
   export const demo6InvalidPersonId: PersonId = 'Nova Byte';
   ```

4. Run `npm run typecheck`. The actual demonstrated diagnostic was:

   ```text
   src/data/types.ts(73,14): error TS2820: Type '"Nova Byte"' is not assignable to type 'PersonId'. Did you mean '"nova-byte"'?
   ```

   The line number may differ if blank lines are added. The compiler rejects a display name because it is not one of the allowed ID literals. This tests a typed value in source code, not runtime JSON validation.
5. Remove the temporary line and save. Run `npm run typecheck` again: it succeeds. Do not leave the invalid example in the source.
6. Run `npm run dev -- --host 127.0.0.1 --port 5176 --strictPort` and open `http://127.0.0.1:5176/`. If that port is occupied, stop the old server first. In DevTools **Network**, reload, filter for `.json`, and show all five successful responses. In the evidence response, E04 still contains `"Nova Byte"`.
7. In DevTools **Console** on the development server, after loading finishes, run:

   ```js
   (await import('/src/state/state.js')).allEvidence.find(e => e.id === 'E04').personIds
   ```

   Expected result: `["nova-byte"]`. This source-module inspection is for the development server, not the bundled production preview.
8. Open **Evidence**, choose Nova Byte in the person filter: five results, including **Missing depth-camera report** (E04). Open **People**: Nova shows five linked items. Open its **Locations** tab: six locations. Open **Timeline**: test filters/order and an evidence link. In **Workspace**, show a saved note/bookmark and its persistence after reload. The known Dashboard/hypothesis limitations above are unrelated to this demo.
9. Show `npm run lint`, the Prettier check, and `npm run build` succeeding. Inspect Console for unexpected application errors; the existing favicon 404 is documented above.

## Answers to the three assignment questions

1. **What was ambiguous, and what did typing force me to decide?** The JavaScript Evidence helper tolerated either a name or ID, while People counting assumed IDs. I chose canonical IDs in application state. A literal union rejects names in typed code, and the loader converts the legacy raw name to an ID before sharing the data.
2. **What can static types not catch here?** `response.json()` supplies runtime data. Annotating its result does not verify it: a future JSON file could contain a numeric title, a missing array, or an invalid timeline person ID and still pass `tsc`. Complete protection requires runtime shape validation, using explicit guards or a schema validator. Our evidence normalization checks whether a person reference resolves, but is not a complete JSON validator; even the people response itself is trusted.
3. **Interface versus type alias?** Both describe object shapes and are checked structurally. Interfaces can be extended and declarations with the same name can merge; type aliases can also express unions and transformations. I used interfaces for the five domain objects and aliases for the ID union and the `Omit`-based raw evidence shape. For these plain domain objects either would work, and neither creates runtime validation.

## Short spoken explanation

“I modeled the actual JSON data and used those types in the loader. E04 used a person's display name where the rest of the application expected an ID, so I normalize that reference while loading and preserve the original JSON. A union of valid person IDs lets TypeScript reject a name in typed code, which I demonstrated with a temporary failing value. The loader and state now share the same domain contracts, but validating incoming JSON still needs runtime checks.”

## Assignment checklist and Git

All three Demo 6 technical tasks are verified and can be ticked: domain models, typed loader, and an explained ambiguity demonstrated by normalization and a compiler failure. Answers to all three question checkboxes are prepared above; tick those after you can walk through them yourself. `EXERCISE_2.md` has not been edited, and no later demo work has been started.

Review from the project directory:

```powershell
git status --short
git diff --stat
git diff -- src/app.js src/data/data.js src/state/state.js
git diff --no-index -- /dev/null src/data/types.ts
git diff --no-index -- /dev/null src/data/data.ts
git diff --no-index -- /dev/null DEMO_6.md
```

`git diff` omits untracked files; the last three commands show them without staging and normally exit 1 because differences exist. Git for Windows accepts `/dev/null` as the empty comparison file.

Demo 6 is ready for review/commit with the pre-existing application limitations documented. Nothing has been staged or committed automatically. Suggested message: `feat: type domain data and normalize person references`.
