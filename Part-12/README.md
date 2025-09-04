# Part 12 — Containers & Environments for **BlogApp**

This README documents how I completed Full Stack Open **Part 12** tasks **12.21** and **12.22** by containerizing the development and a production‑like (staging) environment for my flagship **BlogApp** from Part 7. The project already had CI/CD (from Part 11), so this work focuses on *containerized dev & stage*, while keeping the existing production deployment strategy (Fly.io for the backend, Vercel for front‑ends).

This part felt much smoother than the CI/CD battles in Part-11 — fewer dragons to fight, more “ah, so that’s how it works” moments. 🐧

---

## Repository layout (relevant parts)

```
Full-Stack-Open/
├── .github/                        # workflows & composite actions (CI/CD)
├── Part-7/
│   └── blog/
│       ├── backend/                # Node.js + Express, deployed to Fly.io
│       ├── frontend/
│       │   ├── blog_redux/         # React + Redux Toolkit + Tailwind CSS, deployed to Vercel
│       │   ├── blog_query/         # React + React Query + MUI, deployed to Vercel
│       │   └── blog-fso-landing/   # static landing page, deployed to Vercel
│       ├── docker-compose.dev.yml
│       ├── docker-compose.yml      # “stage” / production-like compose
│       ├── nginx.dev.conf
│       └── nginx.conf
```

> Pay attention: although this README.md is located in the Part-12 folder, the tasks are implemented inside **Part-7/blog**, and the relevant files (nginx configs, Dockerfiles, and Compose files) are placed there.

### Why this project
BlogApp is an ideal subject for Part 12:
- Each app is an **independent project** (own `package.json`, dependencies, tests, and CI/CD pipelines).
- They remain **logically connected**:
  - `blog_redux` and `blog_query` talk to the **same backend** (Fly.io) over HTTP and display the same data using different client stacks.
  - `blog-fso-landing` serves as a simple entry point with links to the two UIs.

This duality makes it useful to spin up **all services together** for development and for a **production-like staging** environment.

---

## Environments and goals

### 1. Containerized **development** (Compose + Nginx reverse proxy)
- Bring up all services **at once** (backend + all three front-ends).
- Front-ends run with **Vite dev servers** (hot reload) in separate containers.
- A single Nginx reverse proxy (port **8080**) routes:
  - `/` → landing (Vite)
  - `/redux/` → Redux app (Vite)
  - `/query/` → React Query app (Vite)
  - `/api/` → backend (Node/Express, dev port)

Benefit: edit the backend and instantly verify behavior across **both** front-ends; or develop features for both UIs in parallel.

### 2. Containerized **stage** (production-like) environment
- Each front-end **builds a static `dist/`** within its container.
- Build outputs are stored in **named volumes** (see `docker-compose.yml`).
- Each frontend service uses `command: ['true']`, which runs the standard Unix `true` command (does nothing and exits successfully). This way, the container exits immediately after producing artifacts, while the build results persist in the attached volume.    
- Nginx serves static files for `/`, `/redux/`, `/query/`, and proxies `/api/` to the backend service.

Benefit: QA can test everything end-to-end in an environment **very close to production**, from a single entry (`http://localhost:8080`).

### 3. **Production** deployment (no change)
- **Backend**: Fly.io (runs a container). The Docker image built in CI is the **artifact** deployed.
- **Front-ends**: Vercel. CI builds **prebuilt dist artifacts** and deploys them with `--prebuilt`. Using containers here would add operational overhead without benefits (Vercel already handles CDN/edge delivery and static hosting excellently).

> Docker is essential for **dev** and **stage**; for **prod** I decided to keep shipping the backend as a container to Fly, and ship front-end **static artifacts** to Vercel.

---

## Routing model and sub‑path strategy

I expose the three UIs under distinct sub‑paths in dev/stage while keeping production deploys separated per project/domain.

- `/` → **landing**
- `/redux/` → **Redux** UI
- `/query/` → **React Query** UI
- `/api/` → backend

### Nginx (dev) — `nginx.dev.conf`
- Proxies to **Vite** dev servers (port `5173` in each FE container).
- Upgrades are configured (websocket / HMR), and host headers are preserved.
- Location blocks use prefix matches with the `^~` modifier (e.g., `location ^~ /redux/ { ... }`).  

> In Nginx, location types have a priority order: exact matches (`=`) > `^~` prefixes > regex matches (`~`, `~*`) > plain prefixes. By using `^~`, I ensure that all requests under `/redux/` or `/query/` are routed directly to the intended service, without being overridden by other, more general rules or regex locations.

### Nginx (stage) — `nginx.conf`
- Serves **static** front‑end files from volumes (built earlier in FE containers).
- Uses `root`, `index`, and `try_files` to handle SPA routes for each sub‑path:
  - Under `/redux/` and `/query/`, `try_files` falls back to the app’s `index.html` (SPA client‑side routing).
- Proxies `/api/` to the backend container (stage port).

```
#### ASCII overview

Dev (Vite):
browser → nginx:8080 →  /          → landing:5173  (Vite)
                        /redux/    → redux:5173    (Vite)
                        /query/    → query:5173    (Vite)
                        /api/      → backend:3003  (Express)

Stage (static):
browser → nginx:8080 →  /          → landing static (volume)
                        /redux/    → redux static   (volume)
                        /query/    → query static   (volume)
                        /api/      → backend:3003   (Express)
```

> Note: The backend port differs by environment (Fly uses `8080` internally; stage uses `3003`). Compose and Nginx are configured accordingly.

---

## Front‑end sub‑path configuration

To make sub‑path hosting work seamlessly in dev/stage, each front‑end uses a **base path**:

1. **Environment variable**: `VITE_BASE_PATH` (e.g., `/redux/`, `/query/`).
2. **Vite config**:
   ```js
   // vite.config.js
   export default defineConfig({
     base: process.env.VITE_BASE_PATH || '/',
     // ...
   });
   ```
3. **Router basename**:
   ```jsx
   // main.tsx / main.jsx
   <BrowserRouter basename={import.meta.env.BASE_URL}>
     {/* ... */}
   </BrowserRouter>
   ```

- In **dev** and **stage**, the base path is injected via container env and used by Nginx routing.
- In **production** (Vercel), each app is deployed **at its domain/root**, so `VITE_BASE_PATH` defaults to `'/'`.

---

## Vite dev server: `host` and `allowedHosts`

In containerized dev behind a reverse proxy, the Vite servers must accept external connections:

```js
// vite.config.js (dev)
server: {
  host: true,
  allowedHosts: ['*'], // or an explicit allowlist
}
```

- `host: true` binds to `0.0.0.0` so containers can be reached via Nginx.
- `allowedHosts`: use `'*'` for simplicity during local dev, or specify a **list of hosts** if you want tighter control.

---

## About `node_modules` and volumes

For development containers, I decided **not to bind-mount `node_modules` from the host**.  
Instead, the dependencies are installed inside the container during build (`npm ci`) and remain there as part of the container layer.

To make this work correctly, I declare a **named/anonymous volume** for `/usr/src/app/node_modules` in `docker-compose.dev.yml`:

```yaml
volumes:
  - ./:/usr/src/app
  - /usr/src/app/node_modules
```

This hides the `node_modules` folder from the bind mount of `./` and ensures that only the container-managed `node_modules` is used. This technique is often referred to by people as a **bind mount override** (or volume masking). It is a common Docker pattern to avoid syncing `node_modules` with the host filesystem.


I chose this approach because:
- It avoids platform or toolchain drift between host and container.
- It prevents syncing a massive folder in real time, which would slow down file I/O and hot reloads.
- Dependencies do not change daily; when they do, I can simply rebuild the container with `--build` instead of constantly syncing `node_modules`.

---

## Commands

### Start containerized **development**
```bash
docker compose -f docker-compose.dev.yml up --build
# open http://localhost:8080
```

### Start containerized **stage** (production-like)
```bash
docker compose up --build
# open http://localhost:8080
```
> See `docker-compose.yml` for named volumes that carry `dist/` artifacts from FE build containers to Nginx
> (e.g., `landing_dist`, `redux_dist`, `query_dist`).

### Environment
- Backend uses **MongoDB Atlas** (no local Mongo container). No Redis is used in this project.
- Health routes (e.g., `/health`) exist for CI/CD and cloud checks (Fly), not needed in local dev/stage.

---

## Takeaways

Compared to the earlier Part 12 exercises (where we ran Mongo and Redis locally), this setup takes a slightly different direction: it relies on **Atlas** for MongoDB and avoids Redis entirely.  
While the course already provided a solid foundation in containerization and orchestration, this project introduced some additional nuances, such as:

- **Orchestrated dev**: running all apps together behind a reverse proxy, enabling instant cross-UI verification.  
- **Production-like staging**: static builds with Nginx routing that closely mirrors the production setup.  
- **Right tool for prod**: keeping containers for the backend where they add real value, while leveraging Vercel’s CDN/static hosting for front-ends.

In combination, the course exercises and these extra patterns gave me a broader developer experience — reinforcing the fundamentals while also exposing me to challenges that possibly appear in real production environments (at least in this project :D).

Thanks to the **Full Stack Open** course for making the entry into containerization approachable and smooth — it turned a potentially overwhelming topic into something both structured and enjoyable to learn.