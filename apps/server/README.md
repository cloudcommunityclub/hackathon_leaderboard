# `@build-server/server` — Real-Time API & WebSocket Gateway

[![Fastify](https://img.shields.io/badge/Fastify-5.x-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

> **The high-performance backend engine powering venue check-ins, resilient welcome scheduling, GitLab activity ingestion, and low-latency WebSocket broadcasting.**

---

## 🏗️ Architecture Overview

The backend server is built on **Fastify** for ultra-low overhead HTTP routing and **ws** / **ioredis** for real-time pub/sub messaging across multiple venue display screens.

```
apps/server/
├── src/
│   ├── routes/
│   │   ├── index.ts        # Route registration & health check
│   │   ├── pretix.ts       # Pretix ticketing webhook ingestion
│   │   ├── gitlab.ts       # GitLab commit/push webhook translation
│   │   ├── admin.ts        # Ops console control endpoints
│   │   └── wave.ts         # Mobile QR wave & reaction API
│   ├── services/
│   │   ├── display-state.ts# Redis-backed master display state manager
│   │   └── scheduler.ts    # Resilient Redis sorted-set welcome queue
│   └── templates/
│       └── wave-page.ts    # Mobile floor interaction HTML template
└── prisma/
    └── schema.prisma       # Database models (Team, DisplayMessage, etc.)
```

---

## 🔐 Environment Variables

Create a `.env` file in `apps/server/` with the following configuration:

```ini
# Database Connection (PostgreSQL or SQLite for dev)
DATABASE_URL="postgresql://postgres:password@localhost:5432/dibs_dev?schema=public"

# Redis Connection (Required for pub/sub & resilient queue)
REDIS_URL="redis://localhost:6379"

# Server Port & Host
PORT=3001
HOST="0.0.0.0"

# Security Secrets for Webhooks
PRETIX_WEBHOOK_SECRET="super-secret-pretix-key"
GITLAB_WEBHOOK_SECRET="super-secret-gitlab-key"
```

---

## 📡 WebSocket Protocol & Event Schema

The server hosts an asynchronous WebSocket gateway at `/ws/display`. Clients connect and exchange JSON-encoded messages.

### Client -> Server Messages
* **Handshake**: `{ "type": "display.hello", "role": "display" | "admin" }`
  * Sent immediately upon connection open. Registers the display screen in the admin monitoring console.

### Server -> Client Broadcasts
* **Master State Update**:
  ```json
  {
    "type": "state",
    "state": {
      "activeChannel": "hall-of-builders",
      "phase": "coding",
      "welcome": null,
      "teamsOnline": 42,
      "totalTeams": 78,
      "rotationPaused": false
    }
  }
  ```
* **Channel Switch**: `{ "type": "channel.change", "channel": "announcements" }`
* **Welcome Card Trigger**:
  ```json
  {
    "type": "welcome.start",
    "welcome": {
      "id": "wel_123",
      "teamId": "team_456",
      "teamName": "Neural Nomads",
      "college": "IIT Delhi",
      "track": "AI / ML Track",
      "template": "Signal acquired: Neural Nomads.",
      "ctaLabel": "Wave to say hi!"
    }
  }
  ```
* **Auto Pilot Cursor Animation**: `{ "type": "cursor.animate", "x": 82, "y": 34, "target": "food-updates" }`
* **Live Chat / GitLab Bot Message**: `{ "type": "bot.message", "channel": "coding", "author": "GitLab Bot", "content": "🚀 **Team Alpha** pushed 3 commits to `main`!" }`

---

## ⏱️ Resilient Redis Welcome Queue (`scheduler.ts`)

To prevent check-in celebration loss if the backend server restarts or crashes during the **18-second physical walk delay** between the registration desk and the main stage:
1. When Pretix webhook arrives, the server calculates `targetTime = Date.now() + 18000`.
2. The team ID is added to a Redis Sorted Set: `zadd('welcome:queue', targetTime, teamId)`.
3. A background polling interval checks `zrangebyscore('welcome:queue', 0, Date.now())` every 1.5 seconds.
4. When ready, the item is atomically removed (`zrem`) and broadcasted to all LED stage screens!

---

## 🔌 HTTP API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check endpoint returning `{ status: 'ok' }`. |
| `GET` | `/api/state` | Retrieves the current master `DisplayState`. |
| `GET` | `/api/teams` | Returns all 78+ registered teams and online count. |
| `GET` | `/api/messages/:channel` | Fetches the last 50 messages for a specific channel. |
| `POST` | `/api/messages` | Posts a new bot message and broadcasts over WebSocket. |
| `GET` | `/wave` | Serves the mobile QR floor interaction HTML app. |
| `GET` | `/api/wave/current` | Returns the team currently being welcomed on stage. |
| `POST` | `/api/wave/reactions` | Submits a live floor emoji reaction (`wave`, `ship_it`, `fire`). |
| `POST` | `/api/admin/phase` | Updates event phase (`check_in`, `coding`, etc.). |
| `POST` | `/api/admin/rotation/pause` | Pauses Auto Pilot channel rotation across all screens. |
| `POST` | `/api/admin/emergency/start` | Triggers venue-wide red-alert emergency banner. |

---

## 🏃‍♂️ Running the Server

```bash
# Development mode with hot-reload
pnpm run dev

# Production build and execution
pnpm run build
pnpm run start
```
