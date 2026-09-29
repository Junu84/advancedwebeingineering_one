# Demo 8 — GitHub Actions development workflow

## Implementation

- `.github/workflows/development.yml`: **Development CI**, triggered by pushes to any branch and the default pull-request events (opened, reopened, synchronize). One Ubuntu job, `quality` (display name **Lint and format**), runs five steps: checkout, Node/npm cache setup, `npm ci`, `npm run lint`, `npm run format:check`. No deployment.
- `package.json`: adds `format:check` with `prettier --check "src/**/*.{js,ts}"`. The existing modifying `format` script and lint configuration remain unchanged.
- This document records verification and the separate failure/fix demonstration.

The workflow uses GitHub's `actions/checkout@v7` and `actions/setup-node@v7`, with read-only repository contents permission. Package files are at the Git repository root, so no working-directory override is needed.

Node **24** is an LTS release and satisfies the locked ESLint (`^20.19.0 || ^22.13.0 || >=24`) and Vite (`^20.19.0 || >=22.12.0`) engine requirements. The major-version selection allows Node 24 patch updates. Local checks below used the already-installed Node **20.19.6** and npm **10.8.2**; execution on Node 24/Linux still needs the actual GitHub run.

`cache: npm` caches npm's download cache, not `node_modules`. `cache-dependency-path: package-lock.json` makes the lockfile hash part of the cache key. `npm ci` still runs each time, installs the locked dependency tree, and fails if package metadata and the lockfile are inconsistent. Removing caching does not change those checks or the locked versions; it generally adds download time. A first cache miss is normal.

Sources: [setup-node usage and caching](https://github.com/actions/setup-node), [checkout](https://github.com/actions/checkout), [Node release status](https://nodejs.org/en/about/previous-releases).

## Local evidence — completed

| Check | Result |
| --- | --- |
| `npm ci` | Passed: 208 packages installed, 0 reported vulnerabilities. First attempt hit a Windows native-module file lock; stopping the two project Vite processes resolved it. |
| `npm run lint` | Passed. |
| `npm run format:check` | Passed. |
| `npm run build` | Passed, including `npm run typecheck` and Vite build. |
| `npm exec --no -- prettier --check .github/workflows/development.yml` | Passed YAML parsing/format checking; this is not GitHub workflow execution. |
| Deliberate quote change below | Lint passed; format check failed with exit code 1 and named `src/state/state.ts`. |
| Restore original source | Format check passed again; no final source or lockfile diff. |

Only the workflow, package script, and this document are final changes. No commits or pushes were made. Restart local development with `npm run dev` when needed.

## Two-commit GitHub demonstration — still pending

Run these commands from the project root on the existing `exercise-2` branch. Instructions start from the currently uncommitted Demo 8 setup. Do not push both commits together: wait for A's failed run before creating/pushing B.

### Commit A: real formatting failure

In `src/state/state.ts`, change exactly:

```ts
export let currentPage: ViewId = 'dashboard';
```

to:

```ts
export let currentPage: ViewId = "dashboard";
```

This changes no value or runtime behavior. `.prettierrc.json` requires single quotes. If VS Code Format on Save changes it back, disable that option for this one save. Confirm locally before committing:

```powershell
npm run lint
npm run format:check
git diff -- src/state/state.ts
```

Lint should pass; format checking must fail. Expected output:

```text
[warn] src/state/state.ts
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
```

Commit both the workflow setup and this deliberate violation:

```powershell
git status
git add -- .github/workflows/development.yml package.json DEMO_8.md src/state/state.ts
git diff --cached
git commit -m "ci: add development checks with deliberate format failure"
git push -u origin exercise-2
git rev-parse HEAD
```

Open [repository Actions](https://github.com/Junu84/advancedwebeingineering_one/actions), choose **Development CI**, and select the run for that exact commit SHA. Open **Lint and format → Check formatting**. It should show the file warning above and exit code 1; checkout, setup, installation and lint should succeed. If an earlier step fails, that does not prove the intended formatting demonstration: resolve that cause and rerun before proceeding. Save the failed run URL and SHA.

### Commit B: fix and pass

Restore the original single quotes, or format only the demonstration file:

```powershell
npm exec --no -- prettier --write src/state/state.ts
npm ci
npm run lint
npm run format:check
npm run build
git diff -- src/state/state.ts
git add -- src/state/state.ts
git diff --cached
git commit -m "style: fix deliberate demo 8 formatting violation"
git push origin exercise-2
git rev-parse HEAD
```

Stop any running project Vite servers before `npm ci` on Windows to avoid the native-module lock observed locally. The fixing commit should only restore the quotes. Do not amend/squash away the failure commit before the presentation.

On GitHub, open the new **Development CI** run for B. The same **Check formatting** step should now report `All matched files use Prettier code style!`; the entire job should be green. Save this run URL and SHA. The workflow itself stays identical between A and B. A rerun of A still checks A's old content, so use B's new run for the passing evidence.

| Required remote evidence | Status |
| --- | --- |
| A: failed formatting run URL + commit SHA | Pending — not yet run on GitHub. |
| B: subsequent passing run URL + commit SHA | Pending — not yet run on GitHub. |

After observing each result, replace its pending row with the real URL/SHA. Only then mark the corresponding Demo 8 failure/pass checkboxes in `EXERCISE_2.md`. All assignment checkboxes remain unchanged for now.

## What to show / what to say

Show the workflow file, the two package scripts (`format` versus `format:check`), and GitHub's A/B run logs with matching commit SHAs. Explain: “The code is functionally identical; the real Prettier check rejected double quotes because our project uses single quotes. The next commit fixes the formatting, and the same workflow passes.” A push run is enough; a pull request is not required for this demonstration. An open PR may produce an additional run for the same change.

1. **Workflow / job / step:** The workflow is the whole `Development CI` automation defined in the YAML file. Its `quality` job runs on one Ubuntu runner. `Check formatting` is one step in that job; steps run sequentially.
2. **Why CI?** Local checks can be skipped or run against different changes. CI checks the committed code consistently and gives teammates/professors a shared result and log. It does not automatically block merging unless branch protection is configured separately.
3. **Caching:** It reuses downloaded npm packages. Without it, `npm ci` still enforces the lockfile and checks run normally, but installation usually takes longer because more downloads are needed.

No GitHub Pages, deployment, secrets, branch rules, or Demo 9–10 work is required here. If repository Actions are disabled, enable/allow GitHub's standard actions in repository settings before pushing. A new branch workflow may first appear in the Actions list after the push. Demo 8 is **not fully complete** until both real remote runs have been observed.
