# `@build-server/shared` — Shared Type Definitions & Contracts

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

> **The single source of truth for all TypeScript interfaces, WebSocket event schemas, event phases, and channel definitions across the Digital India Build Server monorepo.**

---

## 📦 Overview

In a real-time event orchestration system where the backend server (`@build-server/server`), public TV displays (`@build-server/display`), and administrative control consoles (`@build-server/admin`) communicate constantly over WebSockets and HTTP APIs, type consistency is paramount.

`@build-server/shared` enforces strict boundary contracts. By importing types directly from this workspace package, we guarantee zero drift between server broadcasts and client renderers.

---

## 🛠️ Usage in Workspaces

In any workspace `package.json` within the monorepo, include the dependency using the pnpm workspace protocol:

```json
{
  "dependencies": {
    "@build-server/shared": "workspace:*"
  }
}
```

Import types cleanly in your TypeScript files:

```typescript
import { DisplayState, EventPhase, DisplayChannel, Welcome, Team } from '@build-server/shared';
```

---

## 📜 Core Type Definitions

### 1. `EventPhase`
Defines the lifecycle stages of the hackathon event. Changing the phase automatically alters the Auto Pilot channel rotation pool on public displays.

```typescript
export type EventPhase = 
  | 'check_in'          // Venue doors open, Pretix check-in active
  | 'coding'            // Active build mode, GitLab activity live
  | 'meal'              // Catering & food line updates
  | 'mentor'            // Mentor desk & help requests active
  | 'submission'        // Final countdown & submission verification
  | 'post_submission';  // Award ceremony & winner showcases
```

### 2. `DisplayChannel`
Defines the virtual Discord-style channels displayed on the public stage screen:

```typescript
export type DisplayChannel = 
  | 'hall-of-builders'  // Main lobby & general venue feed
  | 'announcements'     // High-priority organizer announcements
  | 'food-updates'      // Catering and break notifications
  | 'mentor-desk'       // Mentorship queue and office hours
  | 'milestones'        // Team achievement unlocks
  | 'sponsor-drops'     // Swag drops and prize announcements
  | 'help-desk'         // Support and AV desk updates
  | 'arrivals';         // Active Pretix welcome celebration screen
```

### 3. `DisplayState`
The master state broadcasted to all connected public displays and admin consoles via WebSockets:

```typescript
export interface DisplayState {
  activeChannel: string;
  phase: string;
  welcome: Welcome | null;
  teamsOnline: number;
  totalTeams: number;
  rotationPaused: boolean;
}
```

### 4. `Welcome`
Payload broadcasted when a team's 18-second check-in walk delay completes:

```typescript
export interface Welcome {
  id: string;
  teamId: string;
  teamName: string;
  college: string;
  track: string;
  template: string;
  ctaLabel: string;
  startedAt: string;
  endsAt: string;
  reactions: Record<string, number>;
}
```

### 5. `Team` & `BotMessage`
Data structures for participating hackathon teams and live chat/GitLab activity feed items:

```typescript
export interface Team {
  id: string;
  name: string;
  college: string;
  track: string;
  tableNumber?: string;
  status: 'online' | 'offline' | 'building' | 'submitted';
  membersCount?: number;
  avatarUrl?: string;
}

export interface BotMessage {
  id: string;
  channel: string;
  author: string;
  content: string;
  timestamp?: string;
  createdAt?: string;
  avatar?: string;
  isEmergency?: boolean;
}
```

---

## 🔄 Building the Package

Whenever you modify `src/index.ts`, rebuild the shared package so other workspaces can consume the updated type declarations:

```bash
pnpm run build
```

This executes `tsc --noEmit` (or declaration generation) to validate strict TypeScript compliance across the suite.
