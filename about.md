 # About ReadClip

 Here’s a high‑level tour of the ReadClip project:

 1. **What is ReadClip?**

    - A “read‑it‑later” service: save URLs and have ReadClip scrape and archive the full text (and media) in a clean, distraction‑free Markdown/HTML view.
    - Tagging, full‑page search, paginated feeds, and a small toolbox of free utilities (word‑counter, reading‑time estimator, markdown viewer, YouTube transcription, business‑analysis via AI, etc.).
    - Optional Chrome extension for one‑click clipping.

 2. **Core features**

    - Clip management: add/update/delete clips via REST API
    - Tagging & filtering
    - User authentication (Firebase Auth)
    - Content parsing: “reader mode”‑style extraction → Markdown
    - Simple “tools” pages for value‑adds (transcription, markdown editor, etc.)
    - Command‑line interface (in `/cli`) for bulk imports, scrapers (Reddit, HackerNews, IndieHacker, ProductHunt), migrations, tag assignment.

 3. **Tech stack**

    - Backend: Go + Fiber HTTP framework + PostgreSQL (or Upstash) + Firebase Auth
    - Frontend: React + TypeScript + Vite + Shadcn/ui + React Query
    - CLI: Go programs under `/cli` for scraping & database tasks
    - Chrome extension: in `/chrome‑extension` for off‑screen clipping
    - Packaging & deploy: Dockerfile, docker‑compose.yml, Fly.io (`fly.toml`), shell scripts (`deploy.sh`, `rollout.sh`)

 4. **Repo layout**

    ```
    /
    ├─ main.go        ← HTTP server: embeds UI, sets up routes & middleware
    ├─ internal/      ← Go domain code (clip, tag, user, bookmark, wiki, scraper adapters…)
    ├─ pkg/           ← reusable Go packages (e.g. Fiber+Firebase auth integration)
    ├─ ui/            ← React app (Vite) – source in `ui/src`, build in `ui/dist`, embedded via Go’s `fs.Sub`
    ├─ cli/           ← standalone Go commands for imports & scrapers
    ├─ chrome‑extension/
    ├─ docs/          ← detailed docs: `architecture.md`, `backend.md`, `frontend.md`, `examples.md`
    ├─ Dockerfile & `docker‑compose.yml`
    ├─ Makefile       ← “make dev” spins up Go server (port 8000) + React dev (port 3000)
    └─ backup, deploy & rollout scripts
    ```

 5. **Running locally**

    - **Prereqs:** Go >=1.19, Node >=v20 (pnpm or npm)
    - **UI:**
      ```bash
      cd ui
      pnpm install
      pnpm run dev  # → http://localhost:3000
      ```
    - **Backend:**
      ```bash
      make dev  # Go server → http://localhost:8000
      ```
    - You can also `docker-compose up` for an all‑in‑one container.

 6. **Documentation & next steps**

    - `docs/architecture.md` – overview of DDD, API flow, auth, deployment
    - `docs/backend.md` – how to add new Go endpoints, repo patterns
    - `docs/frontend.md` – React patterns, state management, auth flows
    - `docs/examples.md` – sample API calls, curl snippets in `/curls/`

 Feel free to drill down into any area—folder by folder, or doc by doc—and I can walk you through more specifics!