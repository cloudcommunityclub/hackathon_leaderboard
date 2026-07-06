# 🇮🇳 Digital India Build Server — Venue Intelligence & Live Display Engine

[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.x-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![React & Vite](https://img.shields.io/badge/React%2018%20+%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev/)
[![Redis & Prisma](https://img.shields.io/badge/Redis%20+%20Prisma-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

> **A real-time, Discord-inspired venue orchestration platform designed for high-energy hackathons, live build arenas, and national engineering summits.**

---

## 🌟 Executive Summary

The **Digital India Build Server** is the digital beating heart of physical hackathons. Designed specifically for large-scale engineering events (supporting **78+ competing teams**, hundreds of live builders, and multiple AV display screens), it bridges the gap between physical venue actions and digital celebrations.

When a team checks in at the venue front desk via **Pretix RFID scanning**, their arrival is queued and celebrated on massive 16:9 LED stage displays with celebratory sound effects after an **18-second physical walk delay**. Throughout the hackathon, live **GitLab commits, push events, and milestone achievements** stream directly into a Discord-style public feed, while attendees scan on-screen QR codes to send live **mobile wave reactions and emoji bursts** to the stage.

---

## 🏗️ System Architecture & Monorepo Overview

The project is structured as an enterprise-grade high-performance **pnpm monorepo** with strict boundary encapsulation and zero-redundancy shared typing:

```
digital-india-build-server/
├── apps/
│   ├── server/           # Fastify + Prisma + Redis + WebSocket Gateway (Port 3001)
│   ├── display/          # React 18 + Vite Public TV/Projector Kiosk Client (Port 5173)
│   └── admin/            # React 18 + Vite Ops Command Console (Port 5174)
├── packages/
│   └── shared/           # @build-server/shared — Shared TypeScript interfaces & constants
├── docs/                 # Detailed Operational Runbooks & Webhook Integration Guides
└── docker-compose.dev.yml# Local development Redis & Postgres stack
```

### ⚡ Core Capabilities & Feature Matrix

| Feature | Description | Architecture / Implementation |
| :--- | :--- | :--- |
| **🎟️ Pretix RFID Check-In** | Instantly ingests attendee check-ins from Pretix ticketing webhooks. | Fastify webhook endpoint (`/api/webhooks/pretix`) with HMAC signature verification & DB syncing. |
| **⏱️ 18s Resilient Welcome Queue** | Delays check-in celebration by 18 seconds so builders can walk from front desk to Hall of Builders. | **Redis Sorted Sets (`welcome:queue`)** with background polling. Survival guaranteed across server restarts! |
| **🎮 Discord-Style Public Display** | Full-screen 16:9 dark-mode UI with Server Rails, Channel Rails, Live Tickers, and 78-Team Sidebar. | Reusable modular React components with CSS animations, custom scrollbars, and seamless marquees. |
| **🪄 Auto Pilot Glowing Cursor** | When idle, a glowing virtual cursor navigates between venue channels automatically. | WebSocket broadcast (`cursor.animate`) triggered by server state rotation engine. |
| **📱 Mobile QR Wave & Floor Reactions** | Attendees scan dynamic TV QR codes to send live 👋 Wave, 🚀 Ship It, and 🔥 Fire emoji reactions. | Dedicated mobile web app (`/wave`) with Redis rate-limiting and live stage reaction broadcasting. |
| **💻 GitLab Activity Feed** | Real-time streaming of code pushes, commit messages, and tag releases from team repositories. | Fastify webhook endpoint (`/api/webhooks/gitlab`) translating git events into Discord bot messages. |
| **🚨 Ops Command Console** | Dedicated control center for AV crews and organizers to manage event phases and emergencies. | Real-time WebSocket admin sync, rotation pause/resume, phase switching, and red-alert banners. |

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
* **Node.js**: `v20.0.0` or higher
* **pnpm**: `v9.0.0` or higher (`npm i -g pnpm`)
* **Docker & Docker Compose**: (For running local Redis and PostgreSQL instances)

### 2. Environment Setup
Clone the repository and install all workspace dependencies:

```bash
git clone https://github.com/cloudcommunityclub/hackathon_leaderboard.git digital-india-build-server
cd digital-india-build-server
pnpm install
```

### 3. Start Local Database & Redis Stack
Start the background services using Docker Compose:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

> **Note**: If you do not have Docker installed, ensure you have a local Redis instance running on port `6379` and configure `DATABASE_URL` in `apps/server/.env` to point to your PostgreSQL database (or SQLite for quick testing).

### 4. Database Migration & Seed
Run Prisma migrations to initialize the database schema and seed test teams:

```bash
cd apps/server
pnpm prisma db push
pnpm run seed   # (If seed script is configured)
cd ../..
```

### 5. Launch All Workspaces
Build shared packages and launch all three development servers concurrently:

```bash
# Build shared library types first
pnpm -r run build

# Start dev servers (Server: 3001, Display: 5173, Admin: 5174)
pnpm -r run dev
```

* **🌐 Public Display Kiosk**: [http://localhost:5173](http://localhost:5173) (Open on TV / Projector)
* **⚙️ Admin Ops Console**: [http://localhost:5174](http://localhost:5174) (Open on Ops Laptop)
* **🔌 Backend API & Gateway**: [http://localhost:3001/health](http://localhost:3001/health)
* **📱 Mobile Wave App**: [http://localhost:3001/wave](http://localhost:3001/wave) (Scan via QR)

---

## 📖 Comprehensive Documentation Suite

We have prepared detailed documentation and operational runbooks for every component of the system:

* **[📂 Backend Server API & WebSocket Gateway Guide](apps/server/README.md)**: Detailed API endpoints, WebSocket protocol event schemas, Redis data structures, and environment variable reference.
* **[📺 Public Display Kiosk Setup & Hardware Guide](apps/display/README.md)**: Guide for AV technicians on setting up 1080p/4K LED walls, kiosk browser flags, audio configuration, and UI component breakdown.
* **[🎛️ Admin Ops Console & Emergency Protocol](apps/admin/README.md)**: Instructions for event directors on managing phases, broadcasting announcements, and triggering emergency stage overrides.
* **[📦 Shared Type Library Reference](packages/shared/README.md)**: Overview of `@build-server/shared` contracts and cross-workspace dependency rules.
* **[📋 Event Day Operational Runbook](docs/EVENT_DAY_RUNBOOK.md)**: **MANDATORY READING FOR EVENT ORGANIZERS.** Minute-by-minute timeline and checklist from venue opening to award ceremony!
* **[🔌 Webhook Integration & Simulation Guide](docs/WEBHOOK_SETUP.md)**: Step-by-step developer guide with exact `curl` and Postman JSON payloads to simulate Pretix check-ins and GitLab pushes locally.

---

## 🛠️ Production Deployment & Scaling

### Recommended Production Topology
For live venue deployment with 78+ teams and multiple LED screens, we recommend deploying on **AWS, GCP, Railway, or Fly.io**:

1. **Database**: Managed PostgreSQL (e.g., AWS RDS or Supabase) with connection pooling.
2. **Redis**: Managed Redis 7+ (e.g., AWS ElastiCache, Upstash, or Redis Cloud) for pub/sub broadcasting, rate limiting, and persistent welcome queues.
3. **Server (`@build-server/server`)**: Deployed as a containerized Node.js service behind an NGINX or Cloudflare reverse proxy with **WebSocket upgrade support (`Connection: Upgrade`)**.
4. **Frontends (`display` & `admin`)**: Built statically via `pnpm -r run build` and hosted on **Cloudflare Pages, Vercel, or NGINX static hosting**.

### Production Build Command
To generate optimized production bundles across all workspaces:

```bash
pnpm -r run build
```

This compiles TypeScript definitions in `packages/shared`, builds the Fastify server bundle, and generates minified, tree-shaken static assets in `apps/display/dist` and `apps/admin/dist`.

---

## 🤝 Contributing & Code Style

We follow strict engineering standards to ensure zero downtime during live national events:
1. **Type Safety**: Never use `any` or duplicate interfaces. Always import shared types from `@build-server/shared`.
2. **Resilience**: Any scheduled or delayed task (like welcome banners or timers) MUST be backed by Redis sorted sets (`zadd`/`zrangebyscore`), never in-memory timers alone.
3. **Aesthetics**: UI changes must adhere to the dark-mode Discord aesthetic (Slate/Blurple color tokens, Inter typography, custom scrollbars, and smooth micro-animations).

---

<div align="center">
  <p><b>Built with ❤️ for Indian Engineering Talent & Hackathon Communities</b></p>
  <p><i>Digital India Build Server © 2026</i></p>
</div>
