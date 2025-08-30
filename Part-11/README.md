[![CI Backend](https://github.com/Saribeg/Full-Stack-Open/actions/workflows/fso-part-7-backend-ci_cd.yml/badge.svg?branch=main)](https://github.com/Saribeg/Full-Stack-Open/actions/workflows/fso-part-7-backend-ci_cd.yml)

[![CI Frontend](https://github.com/Saribeg/Full-Stack-Open/actions/workflows/fso-part-7-frontend-ci_cd.yml/badge.svg?branch=main)](https://github.com/Saribeg/Full-Stack-Open/actions/workflows/fso-part-7-frontend-ci_cd.yml)

[![Secrets Scan](https://github.com/Saribeg/Full-Stack-Open/actions/workflows/secrets-scan.yml/badge.svg?branch=main)](https://github.com/Saribeg/Full-Stack-Open/actions/workflows/secrets-scan.yml)

![Coverage 90%+](https://img.shields.io/badge/coverage-90%25%2B-brightgreen)
![Fly.io Deploy](https://img.shields.io/badge/deploy-Fly.io-blueviolet?logo=flydotio)
![Vercel Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)

# Live Deployments

[![BlogApp Backend](https://img.shields.io/badge/BlogApp%20Backend-Fly.io-blueviolet?logo=flydotio)](https://blogs-fso.fly.dev)
[![BlogApp Landing Page](https://img.shields.io/badge/BlogApp%20Landing%20Page-Vercel-black?logo=vercel)](https://fso-blog-app.vercel.app/)
[![BlogApp Redux-v](https://img.shields.io/badge/BlogApp%20Redux--v-Vercel-black?logo=vercel)](https://blogs-redux-fso.vercel.app)
[![BlogApp Query-v](https://img.shields.io/badge/BlogApp%20Query--v-Vercel-black?logo=vercel)](https://blogs-query-fso.vercel.app)
[![Pokedex](https://img.shields.io/badge/Pokedex-Fly.io-blueviolet?logo=flydotio)](https://fso-11-pokedex.fly.dev/)

# FSO - Part 11 · important Note for Exercise 11.21

Because this is a **monorepo**, I’m the **only developer**, and I’ll keep iterating on other FSO parts here, I **intentionally did not enforce** “prevent administrators from merging without a review.” I do know how to enable it.

**How to enable (classic branch protection, one-liner):** Settings → **Branches** → your rule → enable **Require a pull request** + **Require approvals (≥1)** and tick **Do not allow bypassing the above settings** + **Rules applied to everyone including administrators**.

# FSO - Part 11 · Exercise 11.20 · My Own CI/CD Pipeline (BlogApp in a Monorepo from Part-7/blog)

> _"Why go the easy way if you can fight pipelines instead?"_ 😅

This repository is my solution for **Full Stack Open, Part 11 - Exercise 11.20: Your own pipeline**.  
While the instructions suggested a simpler setup, I decided to go for something deliberately more complex — to explore GitHub Actions in depth and spend some quality time wrestling for green pipelines. 🚦

---

## Repository Structure

All my FSO course tasks live in a single monorepo called **Full-Stack-Open**.  
Each part of the course has its own directory: `Part-0`, `Part-1`, … up to `Part-13`.  
In the root, there is also a **.github** folder with all workflows and composite actions.

For Part 11, the project under CI/CD is the **BlogApp** from Part 7.

```
Full-Stack-Open/
├── .github/                # workflows & composite actions
├── Part-7/
│   └── blog/
│       ├── backend/        # Node.js + Express, deployed to Fly.io
│       └── frontend/
│           ├── blog_redux/ # React + Redux Toolkit + Tailwind CSS, deployed to Vercel
│           ├── blog_query/ # React + React Query + MUI, deployed to Vercel
│           └── blog-fso-landing/ # simple static landing page, deployed to Vercel
└── Part-11/
    └── full-stack-open-pokedex/ # course tasks done for Part 11 CI/CD
```

---

## Pipelines Overview

### 1. Backend (`fso-part-7-backend-ci_cd.yml`)
- Runs lint, tests, coverage (c8), knip, and audit.
- Matrix build on Node.js **20 and 22** (with separate DB names for integration tests in Atlas cloud).
- Deployment to **Fly.io** with health-check before tagging.
- Tags pushed with prefixes to distinguish deployments.
- Notifications sent to Telegram & Discord.

### 2. Frontend (`fso-part-7-frontend-ci_cd.yml`)
Covers two separate apps: **Redux** and **Query**.
One workflow drives **both** frontends in parallel. A `changes` job uses `dorny/paths-filter@v3` to run only what changed (saves minutes and noise).

- Unit, component, integration (with MSW), and e2e tests.
  - Redux app → Playwright
  - Query app → Cypress
- Each e2e test suite spins up the backend locally using a **composite action** (`start-backend-for-e2e`) so that API + DB are isolated within the same job (same network/process lifetime).
- Separate production build workflow (`reusable-frontend-prod-build.yml`) to:
  - inject proper `VITE_API_URL`
  - check bundle size
  - prepare `dist` as a reusable artifact
- Deployment to **Vercel** using downloaded artifact, with meta info including the Git tag.

### 3. Security Scan (`secrets-scan.yml`)
- Runs **Gitleaks** on every push/PR to prevent committing secrets.

> Triggers are path‑scoped, e.g. only BlogApp changes kick BlogApp pipelines.

---

## Tagging strategy (prod‑like)

To keep Git history aligned with **actual deployments**, tagging is split:

1. **Generate tag (dry‑run)** → compute next SemVer (per app, with a prefix), **do not push**.  
2. **Deploy** → pass that tag as an image/metadata label (Fly.io / Vercel).  
3. **Push tag** → only **after** a successful deploy.

Result: every tag in the repo maps to a version that was really deployed.  
I use **per‑project prefixes**: `blog-be-v*`, `blog-redux-v*`, `blog-query-v*`, `pokedex-v*`.

_Deploy gate_: add `#skip` to a commit message to run CI but **skip deployment**.

---

## Reusable Workflows & Actions

- **reusable-express-backend-ci.yml** → backend CI with Node matrix, coverage, audit.  
- **reusable-frontend-ci.yml** → frontend CI with e2e (Playwright/Cypress), bundle size check.  
- **reusable-frontend-prod-build.yml** → production build, bundle size, artifact upload.  
- **reusable-fly-deploy.yml** → deploy to Fly.io.  
- **reusable-vercel-deploy.yml** → deploy to Vercel using CLI + artifact.  
- **reusable-tag-generate.yml** / **reusable-tag-push.yml** → semantic versioning & tagging.  
- **reusable-health-check.yml** → simple Bash-based health check, experimental Bash probe kept for learning value (spoiler: I didn’t enjoy Bash so that delegated the job to AI 😅).  
- **reusable-deploy-notify.yml** → compact Telegram/Discord notifications via `matrix` on `channel`.

Composite action:
- **actions/start-backend-for-e2e** → spins up backend for e2e in the same job.

---

## Why this design? (short version)

- **Realism:** separate backend + two independent frontends, each deployable on its own schedule.
- **Monorepo‑friendly:** path‑scoped triggers + per‑project jobs keep things modular.
- **Reusability/DRY:** heavy use of **reusable workflows** and a **composite action** for e2e setup.
- **Observability:** artifacts (reports), consistent tagging tied to what actually shipped.

---

## Extra Quality Checks

- **envalid** → runtime environment variable validation.  
- **c8** → coverage reports (90%+ target).  
- **knip** → unused code detection.  
- **Lefthook** → fast and simple pre-commit hooks (pleasant upgrade from husky in a monorepo).  
- **Check Bundle Size** → to keep frontend builds under control.
- **4 test layers:** unit → component → integration → e2e (Playwright/Cypress).

---

## Lessons Learned & War Stories

- **Cloud DB concurrency** → tricky with parallel jobs, solved by per-matrix and per-app DB naming. Ideally this should be isolated local MongoDB instances, but debugging parallel access in the cloud was more fun. 😅
- **npm audit** → triggers HTTP 429 if run too often, so I run it only when `package.json`-related changes.  
- **Tagging** → each project uses its own prefix so they can be deployed independently.
- **Composite vs Reusable workflows** → learned the hard way that e2e tests must run in the same job, otherwise the backend lives in a separate environment. Composite action was the only correct choice.
- **YAML syntax traps** → secrets can’t be referenced in `if` conditions but work fine in `with` and `env`. Debugging this cost me more time than I’d like to admit.  
- **Vercel CLI deployment** → preparing `dist`, adding config files, passing env vars correctly and configuring project on Vercel site interface for non-automatic deploys was a puzzle. Once solved, using artifacts made it much faster than rebuilding at deploy time.
- **Paths-filter magic** → dorny/paths-filter@v3 saved a ton of CI minutes by running only what was actually affected by changes.
- **c8 coverage quirks** → due to V8 specifics, coverage sometimes looked misleading: if code was executed indirectly in tests, it was marked as covered even without explicit assertions.  
- **knip limitations** → being purely static, knip sometimes flagged backend code as “unused” even when it was in fact used via `app.use` middleware or in controller wiring. And no, we can’t afford SonarCloud for this project. 😂

And much more… at some point I simply lost count. 😅

In short: it was long, painful, and very educational. 💡

---

## Time Tracking

Starting from Part 7 of the course, I began tracking my work time with **Toggl**.  
Here’s the breakdown for Part 11 (CI/CD):

| Task | Time |
| ---- | ---- |
| **Part-11a. Introduction to CI/CD** | 1&nbsp;hour&nbsp;35&nbsp;min |
| **Part-11b. Getting started with GitHub Actions** | 4&nbsp;hours&nbsp;58&nbsp;min |
| **Part-11c. Deployment** | 1&nbsp;hour&nbsp;49&nbsp;min |
| **Part-11d. Keeping green** | 2&nbsp;hours&nbsp;59&nbsp;min |
| **Part-11e. Expanding Further** | 60&nbsp;hours&nbsp;37&nbsp;min |
| *↳ Tasks without 11.20* | *3&nbsp;hours&nbsp;10&nbsp;min* |
| *↳ Task 11.20. Backend preparations for CI/CD (BlogApp from Part 7)* | *14&nbsp;hours&nbsp;18&nbsp;min* |
| *↳ Task 11.20. Frontends preparations for CI/CD (BlogApp from Part 7)* | *11&nbsp;hours&nbsp;35&nbsp;min* |
| *↳ Task 11.20. CI/CD pipelines for BlogApp from Part 7* | *31&nbsp;hours&nbsp;34&nbsp;min* |
| **Total** | **71&nbsp;hours&nbsp;58&nbsp;min** |

> Yes, more than 60 hours just for Part-11e… not a typo. 😅  
> CI/CD dragons were tougher than expected, but the fight was worth it. 💪

---

## Final Thoughts

This exercise was more than “just get it running” - it was a dive into **modular CI/CD, reusable workflows, artifacts, and real-world debugging**.  
I fought with YAML syntax, npm quirks, and cloud deployment dragons… and came out stronger. 💪

Earlier in my career I had experience with **Bitbucket Pipelines** in a commercial project - mostly consuming existing pipelines, reading logs, debugging test failures, and fixing things downstream.  
Now, with this exercise, I’ve complemented that experience by **designing and building pipelines myself from scratch**, which feels like leveling up from user to architect. 🚀

Big thanks to the FSO course for pushing me into this. 🍀