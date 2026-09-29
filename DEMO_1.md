# Demo 1 demonstration notes

## Scope and decisions

Only Demo 1 was implemented. npm was selected as requested: it is already available
with Node.js and is sufficient for this small project without installing another
package manager. Verified environment: Node.js v20.19.6, npm 10.8.2.

The existing README recommends `npx serve .`, and the app fetches local JSON over
HTTP. Therefore `serve@14.2.6` is the one direct dependency, under devDependencies:
it serves the existing app locally and is not browser runtime code. npm installed
85 packages including transitive dependencies and reported zero vulnerabilities.

## Files created

- `package.json`: initialized directly with name, version 1.0.0, description,
  `private: true` to prevent accidental publication, and `type: module` so Node
  interprets project JavaScript consistently with its existing ES-module syntax.
  Browser module loading still comes from the existing HTML script tag.
  No package scripts were added.
- `.gitignore`: no existing file was found; added only `node_modules/`.
  No future build-output directories were added.
- `package-lock.json`: npm-generated dependency tree with resolved versions and
  integrity hashes; intended for commit.
- `DEMO_1.md`: this running record and live demonstration guide.
- `node_modules/`: npm-generated dependency files, binaries and internal lockfile;
  retain locally as evidence, never commit.

Existing application files were not edited. The pre-existing change to
`src/views/timeline.js`, untracked `EXERCISE_2.md`, and untracked `how cb4743bq`
were left untouched. Review those separately before including them in any commit.

## Exact npm and Git commands used

Run from the project directory (the nested repository `mystery-road-awe-2026`).
Repeated inspection commands are listed once.

```powershell
node --version
npm --version
git status --short
git rev-parse --show-toplevel
git ls-files
git diff --stat
npm view serve version engines description
npm install --save-dev serve@14.2.6
npm ls --depth=0
git check-ignore -v node_modules/
git check-ignore -v package-lock.json
git status --short --ignored
git ls-files -- node_modules package-lock.json
npm exec --no -- serve . --listen tcp://127.0.0.1:8080 --no-clipboard
```

`package.json` and `.gitignore` were created directly, not with `npm init`.
PowerShell file reads and searches were used for inspection. A temporary Node
script piped to `node --input-type=module` fetched all 25 files in `src/`, `data/`,
`assets/`, plus HTML and CSS, and compared their bytes with local files: all passed.
The server was then stopped. No generated evidence was deleted.
This verifies HTTP delivery, not a full browser interaction test.

## Live demonstration

1. Open a PowerShell terminal in `mystery-road-awe-2026`.
2. Show `node --version` and `npm --version`.
3. Run `Get-Content package.json`; explain the metadata, module type,
   private flag and the single direct devDependency.
4. Run `npm ls --depth=0`, then
   `Get-Content package-lock.json -TotalCount 28` and
   `Test-Path node_modules -PathType Container`.
   Point out the root dependency range versus exact resolved versions and hashes.
5. Run `git check-ignore -v node_modules/`: expect `.gitignore:1`.
   Run `git check-ignore -v package-lock.json`, then `$LASTEXITCODE`:
   expect no matching rule and exit code 1, meaning it is not ignored.
6. Run `git status --short --ignored`. Explain `??` (untracked),
   `M` (modified), and `!!` (ignored). The lockfile is currently untracked,
   not committed. The exercise's commit evidence remains pending.
7. Run `npm exec --no -- serve . --listen tcp://127.0.0.1:8080 --no-clipboard`.
   Open http://127.0.0.1:8080 and show the existing app; stop with Ctrl+C.
8. Explain the answers below. Only tick personal question checkboxes once you
   can answer them live. No reinstall or cleanup is needed for this demonstration.

## Professor questions

1. **Why a package manager?** It records direct dependencies, resolves their
   transitive dependencies, downloads compatible versions, and automates
   installation and updates. The lockfile makes the resolved tree reproducible
   instead of relying on undocumented manually copied files.
2. **dependencies versus devDependencies?** Runtime libraries belong in
   dependencies; tools needed to develop, check, or build belong in
   devDependencies. A development install normally includes both categories.
3. **Vite, TypeScript, ESLint and Prettier?** All are devDependencies: they serve
   development, compilation, linting or formatting. They are not required as
   runtime tools for the deployed static app. `serve` is also a devDependency here.
4. **Lockfile purpose?** It records the exact resolved dependency tree, download
   locations and integrity hashes, including transitive packages. Commit it with
   package.json so other installations can reproduce those resolutions.
5. **Without a committed lockfile?** Teammates may resolve newer versions allowed
   by the same ranges and encounter different behavior or failures. CI cannot use
   `npm ci` without a suitable lockfile. No CI workflow was configured here.
6. **What could pnpm offer?** Its content-addressable store reuses package content
   across projects; hard links and symbolic links construct node_modules. This
   can reduce disk use and speed repeated installs on larger projects. Its layout
   also reduces accidental access to undeclared dependencies. Switching requires
   adopting pnpm and pnpm-lock.yaml across the team and checking tool compatibility
   with its layout. For this project, npm avoids that extra setup.

References: [npm lockfile documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json/),
[pnpm layout](https://pnpm.io/symlinked-node-modules-structure),
[serve documentation](https://github.com/vercel/serve).

## Each EXERCISE_2.md Demo 1 checkbox

- [x] Choose npm or pnpm and record why: npm; rationale above.
- [x] Initialize package.json with proper metadata: created and inspected.
- [x] Ignore node_modules: verified using git check-ignore.
- [ ] Install one real dependency and show the lockfile committed: installation
  and lockfile verified; commit intentionally not performed at the user's request.
- [ ] Explain the package-manager problem: answer prepared above; student live
  explanation still pending.
- [ ] Explain dependency categories and later tools: answer prepared above;
  student live explanation still pending.
- [ ] Explain lockfile purpose and omission risks: answer prepared above;
  student live explanation still pending.
- [ ] Compare npm with pnpm: answer prepared above; student live explanation
  still pending.

The original exercise checkboxes were not edited. Demo 1 is not yet fully Ready:
the commit evidence and student live answers remain outstanding.

## Commit suggestion (not executed)

Include `.gitignore`, `package.json`, `package-lock.json`, and `DEMO_1.md`.
Exclude `node_modules/`; review pre-existing changes separately.

Suggested message: `chore: initialize npm metadata and static server dependency`

No files were staged, committed or pushed. Demo 2 has not been started.
