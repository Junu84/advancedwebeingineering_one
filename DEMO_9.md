# Demo 9 — GitHub Pages deployment

## Status

| Requirement/evidence | Status |
| --- | --- |
| Deployment implementation | Completed locally. |
| Local installation, quality checks, typecheck/build | Passed. |
| Production subpath/resource verification | Passed via local HTTP preview; not a live browser test. |
| GitHub deployment workflow passed | Pending; no commit/push or GitHub run performed for this demo. |
| Live Pages application verified end-to-end | Pending. |
| A second pushed change automatically went live | Pending. |

No Demo 9 assignment checkbox has been ticked. A YAML file or local preview alone does not prove deployment.

## Changes and design

- New `.github/workflows/deploy.yml`: **Deploy to GitHub Pages**, triggered only by pushes to `exercise-2`. That branch contains the complete Exercise 2 implementation and allows deployment demonstrations without merging unfinished exercise work into `main`.
- `vite.config.js`: adds `base: '/advancedwebeingineering_one/'`. This is the exact repository name from `origin`, `https://github.com/Junu84/advancedwebeingineering_one.git`, not the local directory name. Vite rewrites built JS/CSS URLs for the project-site subpath. Development and preview now also use this subpath; follow the URL Vite prints.
- New `DEMO_9.md`: this presentation/evidence guide.

The `build` job checks out code, sets up Node 24 with npm caching keyed by `package-lock.json`, runs `npm ci`, lint, format checking and `npm run build` (which includes strict TypeScript checking), then uploads `dist/` using `actions/upload-pages-artifact@v5`.

The `deploy` job has `needs: build`. It uses `actions/configure-pages@v6` to obtain/configure Pages metadata, then `actions/deploy-pages@v5` to publish the uploaded `github-pages` artifact. It targets the `github-pages` environment and exposes the action's `page_url` output as its URL. No `gh-pages` branch, deployment package, personal access token, or manually copied build is needed.

Permissions are scoped to jobs: the build job has `contents: read` for checkout; the deploy job has `pages: write` to publish and `id-token: write` for GitHub's deployment identity check. Deployment concurrency uses group `pages` with `cancel-in-progress: false`, allowing an active deployment to finish instead of interrupting it.

Demo 8's `development.yml` remains unchanged and independent. Pushes to `exercise-2` trigger both workflows. Pull requests trigger Demo 8 but do not deploy through Demo 9.

The existing copy hook still copies `data/` and `assets/` into the production output. Runtime fetches use `./data/...`; from the project URL they resolve under the same repository prefix. Hash navigation (`#evidence`, `#timeline`, etc.) does not require server route rewrites. Original JSON and Demo 6 normalization remain unchanged.

References: [Vite project-site base and Pages deployment](https://vite.dev/guide/static-deploy#github-pages), [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Local verification performed

All passed using the existing local Node/npm installation:

```powershell
npm ci
npm run lint
npm run format:check
npm run build
npm exec --no -- prettier --check .github/workflows/deploy.yml
```

The build executed `npm run typecheck` before Vite. The lockfile and Demo 8 workflow stayed unchanged. No generated files were manually edited.

Production output:

```text
dist/
  index.html
  assets/
    index-<hash>.js
    index-<hash>.css
    logo/logo.svg
    people/*.png
  data/
    case.json
    evidence.json
    locations.json
    people.json
    timeline.json
```

Started `npm exec --no -- vite preview --host 127.0.0.1 --port 4179 --strictPort` and checked `http://127.0.0.1:4179/advancedwebeingineering_one/`. All 15 generated files returned HTTP 200 with content identical to their files on disk. The directory URL served the generated index; its JS/CSS URLs include the repository prefix. All five copied JSON files match their source bytes. `dist/` remains Git-ignored. These HTTP checks verify hosting paths, not browser interactions or GitHub deployment.

An existing untracked `src/state/state.js` was present before this work. It was left untouched. Do not accidentally include it in the Demo 9 commit; the app entry and imports use TypeScript.

## Manual GitHub configuration before the first push

1. Open repository **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**. Do not create an additional starter workflow; this repository now supplies one. No source branch/folder needs selecting in the Pages UI for this artifact-based approach.
2. Under **Settings → Environments → github-pages**, inspect **Deployment branches and tags**. If restricted, allow the branch `exercise-2` (choose selected branches/tags and add that exact branch). The environment may first appear when the workflow runs. If deployment is blocked by a branch restriction, adjust it and rerun the failed deployment. Preserve any intentional review protections.
3. Ensure repository Actions settings allow the official GitHub actions used here. No new secret is needed. If Pages is unavailable for the repository's visibility/account plan, resolve that repository setting before claiming deployment is complete.

Repository settings were not read or changed remotely during this implementation, so their current state is unverified. No custom domain is assumed. For the requested default project site, the expected URL is:

<https://junu84.github.io/advancedwebeingineering_one/>

Use the actual URL shown by the deployment job/Settings → Pages as the authoritative result. A custom domain or repository rename would require reviewing `base` again.

## First commit and deployment

From the repository root, confirm the current branch is `exercise-2`, then review and commit only these files:

```powershell
git branch --show-current
git status
git diff -- vite.config.js
git add -- .github/workflows/deploy.yml vite.config.js DEMO_9.md
git diff --cached
git commit -m "ci: deploy exercise-2 production build to GitHub Pages"
git push -u origin exercise-2
git rev-parse HEAD
```

Open [Actions](https://github.com/Junu84/advancedwebeingineering_one/actions) → **Deploy to GitHub Pages**. Match the run to this commit SHA. Show the successful install, lint, format, typecheck/build and upload steps, followed by the successful deploy job and its environment URL. A green Demo 8 run alone is not deployment evidence.

Open the live URL and verify:

- Dashboard introduction and navigation, then Evidence: 18 items; search `calibration` returns 7.
- Nova Byte filter: five items including E04; People: six people and Nova's five linked items; Locations: six locations.
- Timeline: 15 events, filtering/order changes, evidence modal and opening full evidence.
- Save a new note and bookmark, show them in Workspace, and reload to prove persistence on this origin.
- DevTools **Network**: JS/CSS, logo and all five JSON requests load under `/advancedwebeingineering_one/`; **Console**: no new deployment errors. Reload a hash URL such as `#timeline`.

Previously documented empty generated Dashboard content, non-saving hypothesis button and missing favicon are not fixed by this deployment work. Do not claim those features work. Local storage belongs to an origin, so localhost notes do not automatically appear on GitHub Pages.

## Prove automatic redeployment with a visible change

After the first live site is verified, in the `index.html` footer change just:

```text
Project ReMotion Investigation Portal
```

to:

```text
Project ReMotion Investigation Portal (Demo 9 update)
```

Keep the surrounding HTML and existing text unchanged. Show the old footer on the live site before pushing. Then:

```powershell
npm run lint
npm run format:check
npm run build
git diff -- index.html
git add -- index.html
git commit -m "docs: add visible footer marker for deployment demo"
git push origin exercise-2
git rev-parse HEAD
```

Wait for the new **Deploy to GitHub Pages** run for that SHA. Show that its event is `push` and both jobs succeeded. Follow its deployment URL, hard-refresh the page (or disable cache in DevTools), and show `(Demo 9 update)` in the footer. There is no manual deploy command: the push triggered the workflow. Record both run URLs, commit SHAs and the live URL here; only then tick the corresponding assignment checkboxes.

## Professor answers

1. **Why repeat checks/build?** This workflow verifies the exact commit it will publish in a clean runner. A local success or a different Demo 8 run may describe other code. Its own successful build produces the exact artifact consumed by its dependent deployment job.
2. **How is the site published?** Vite generates `dist/`. `upload-pages-artifact@v5` packages/uploads that folder as `github-pages`. After `configure-pages@v6`, `deploy-pages@v5` publishes that artifact through GitHub Pages and returns the site URL. We do not push generated files to a branch.
3. **Another host?** Keep npm, the lockfile, lint/format/typecheck, Vite build and static `dist/` output. Replace Pages configuration/upload/deploy steps and permissions with the host's deployment mechanism and credentials, choose its output directory/domain, and adjust Vite `base` to that hosting path (often `/` at a domain root). The application architecture stays the same.

Presentation order: show the branch trigger and build/deploy dependency; explain `base`; show the real run and live working views; make the footer change, push, and show the next run updating the live site.
