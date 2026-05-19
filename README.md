# IoT Security Platform — Web UI

Next.js 16 application for the IoT Security Platform: operator dashboard, device management, live telemetry, and an embedded documentation site with OpenAPI explorer.

## Features

| Area | Routes | Description |
|------|--------|-------------|
| Dashboard | `/` | KPIs, pipeline metrics, alerts, anomalies, vulnerabilities (REST + WebSocket) |
| Devices | `/devices`, `/devices/[deviceId]` | Fleet inventory and per-device detail with live telemetry |
| Documentation | `/docs/*` | MDX guides, architecture concepts, API reference |
| API explorer | `/docs/api` | Interactive UI over `public/openapi.json` |

Legacy `/dashboard` redirects to `/`.

## Requirements

- **Node.js** 20 or later
- **pnpm** (recommended) or npm
- A running **iot-security-backend** instance, or any deployment exposing the same REST/WebSocket API

This app is its own Git repository: [iot-security-platform-demo](https://github.com/PeakChainNetwork/iot-security-platform-demo). In the full platform checkout it lives at `peaksoft-security-platform/www` as a **git submodule** so backend and UI stay in one working tree. You can also clone the demo repo alone and point environment variables at a remote API.

## Quick start

```bash
cd www
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). With the default backend on port 8000:

```bash
# From repo root, in another terminal
cd iot-security-backend
# activate your venv, then:
uvicorn app.main:app --reload --port 8000
```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | **Yes** (REST) | HTTP(S) origin for server-side API fetches, e.g. `http://localhost:8000` |
| `NEXT_PUBLIC_WS_BACKEND_URL` | No | WebSocket origin when it differs from REST; falls back to `NEXT_PUBLIC_BACKEND_URL`, then `http://localhost:8000` for client WebSockets |

Copy [`.env.example`](.env.example) to `.env.local`. Never commit secrets or production URLs in tracked files.

## Project structure

```
www/
├── public/
│   ├── openapi.json
│   ├── ws-contracts.json
│   └── postman-*.json
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, theme)
│   │   ├── globals.css
│   │   ├── (dashboard)/            # Operator UI — AppShell layout
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # / dashboard overview
│   │   │   └── devices/...
│   │   └── docs/                   # MDX documentation (/docs/*)
│   ├── components/
│   │   ├── common/                 # App chrome (shell, theme, copy)
│   │   └── ui/                     # shadcn/ui primitives
│   ├── features/
│   │   ├── dashboard/              # Overview KPIs, metrics, dashboard WS
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── devices/                # Fleet list, detail, telemetry WS
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── services/
│   │   └── docs/                   # Docs UI + docs-nav config
│   │       ├── components/
│   │       └── lib/
│   ├── lib/
│   │   ├── api-client.ts           # Shared HTTP (ApiError, fetchJson)
│   │   ├── backend-url.ts          # Reads NEXT_PUBLIC_* env vars
│   │   ├── ws-client.ts            # Shared WebSocket manager
│   │   ├── nav-config.ts           # Dashboard nav items
│   │   ├── utils.ts
│   │   └── dates.ts
│   ├── types/
│   │   └── backend-types.ts        # Hand-maintained API types (single source)
│   └── hooks/
│       └── use-mobile.ts
├── .env.example
├── next.config.ts
└── package.json
```

### Import conventions

```ts
import { getDevices } from "@/features/devices"
import { useDashboardWs, getSystemHealth } from "@/features/dashboard"
import { AppShell } from "@/components/common/app-shell"
import type { DeviceRead } from "@/types/backend-types"
```

Set `NEXT_PUBLIC_BACKEND_URL` in `.env.local` (see `.env.example`). Next.js exposes `process.env.NEXT_PUBLIC_*` at build time; `lib/backend-url.ts` only normalizes URLs and applies defaults for WebSockets.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm check` | Lint + typecheck + production build |
| `pnpm docs:openapi` | Regenerate `public/openapi.json` from backend |

## Backend coupling

- **REST**: `features/*/services` use `lib/api-client.ts` (requires `NEXT_PUBLIC_BACKEND_URL`).
- **WebSocket**: dashboard and device hooks use `lib/backend-url.ts`; defaults to `http://localhost:8000` when env is unset.
- **Types**: `types/backend-types.ts` — update manually when backend schemas change.
- **OpenAPI docs**: Run `pnpm docs:openapi` after backend route or schema changes.

## Production

```bash
pnpm build
pnpm start
```

Set `NEXT_PUBLIC_BACKEND_URL` (and optionally `NEXT_PUBLIC_WS_BACKEND_URL`) in your hosting provider.

## Verification

```bash
cd www
rm -rf .next
pnpm typecheck && pnpm build
```

Expected: exit code `0`; routes `/`, `/devices`, `/devices/[deviceId]`, `/docs/*`; `/dashboard` redirects to `/`.

Manual smoke (backend running, `.env.local` configured):

1. **`/`** — Dashboard widgets; WebSocket connects.
2. **`/devices`** — Fleet list or empty state.
3. **`/devices/<id>`** — Detail + telemetry panel.
4. **`/docs`** and **`/docs/api`** — Docs and OpenAPI explorer.

## Extension points

### Authentication (not implemented)

When the backend adds sessions, add:

```
app/(public)/auth/login/page.tsx
features/auth/services/auth-service.ts
```

### Client store (not implemented)

For global UI state (e.g. Zustand), add:

```
store/connection-store.ts   # WS status shared across views
```

## Platform checkout (submodule)

Clone the parent repo with submodules:

```bash
git clone --recurse-submodules https://github.com/PeakChainNetwork/peaksoft-security-platform.git
# existing clone:
git submodule update --init www
```

From the repo root, run frontend Git commands with `./scripts/git-www.sh` (e.g. `./scripts/git-www.sh status`) or `git -C www`.

| Package | Path | Role |
|---------|------|------|
| Web UI | `www/` (submodule → demo repo) | Next.js frontend |
| API | `iot-security-backend/` | FastAPI services |

## License

Proprietary — PeakSoft. Contact your account team for redistribution terms.
