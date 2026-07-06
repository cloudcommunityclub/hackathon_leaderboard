# `@build-server/admin` — Ops Command & Control Dashboard

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **The mission-control center for event directors, AV producers, and stage managers to orchestrate venue displays, switch hackathon phases, and broadcast instant announcements.**

---

## 🎛️ Overview & Control Panels

During a live hackathon with 78+ teams and multiple stage screens, organizers need absolute control over what appears on the public LED walls. The Admin Console (`@build-server/admin`) provides a responsive, dark-mode dashboard with real-time WebSocket synchronization.

### Key Control Sections

```
+-----------------------------------------------------------------------+
|  AdminHeader: Title | Active Phase Badge | 42 / 78 Teams Online       |
+--------------------------------------------------+--------------------+
| Display & Rotation Controls                      | Event Phase Switcher|
| [⏸ Pause Rotation]  [▶ Resume Rotation]          | [🎟️ Check-In]      |
| ------------------------------------------------ | [💻 Coding Mode]   |
| Emergency Banner Override                        | [🍕 Meal & Break]  |
| [ Input Text ] [ Trigger Alert 🚨 ] [ Clear ]     | [🧑‍🏫 Mentor Hours]  |
+--------------------------------------------------+--------------------+
| Broadcast Announcement                                                |
| [ Message Input ] [ Channel Select ] [🚀 Broadcast] [ ] Emergency     |
+-----------------------------------------------------------------------+
| Connected Public Displays (Real-Time AV Screen Monitoring)            |
| 📺 Main Stage LED Wall · online   |   📺 Lobby Projector · online    |
+-----------------------------------------------------------------------+
```

---

## 🚀 Operational Features & Workflows

### 1. Auto Pilot Rotation Pause / Resume (`DisplayControls.tsx`)
By default, public stage displays automatically rotate between channels (`#hall-of-builders`, `#announcements`, `#food-updates`, etc.) every 4 to 7 seconds using the Auto Pilot glowing cursor.
* **When to Pause**: When a guest speaker is on stage, during mentor announcements, or when an important achievement milestone is being explained.
* **How it works**: Clicking **⏸ Pause Auto Pilot Rotation** sends an API command to `/api/admin/rotation/pause`. The backend sets `rotationPaused: true` in Redis and broadcasts the state change to all screens instantly, freezing them on the current view.

### 2. Emergency Banner Override (`DisplayControls.tsx`)
In case of venue emergencies (e.g., lost equipment, food line congestion, or urgent assembly calls), organizers can override all public screens simultaneously.
* Type the alert message in the red override box and click **Trigger Alert 🚨**.
* All connected stage screens immediately flash a high-contrast red emergency banner across the top of the feed until **Clear Alert** is clicked.

### 3. Event Phase Switcher (`PhaseSelector.tsx`)
As the hackathon progresses through its schedule, switching the phase updates the UI badges and changes the channel rotation pool across the venue:
* **🎟️ Check-In (`check_in`)**: Prioritizes `#arrivals` and `#hall-of-builders`.
* **💻 Coding Mode (`coding`)**: Prioritizes `#hall-of-builders`, `#milestones`, and live GitLab commit streams.
* **🍕 Meal & Break (`meal`)**: Prioritizes `#food-updates` and `#announcements`.
* **🧑‍🏫 Mentor Hours (`mentor`)**: Prioritizes `#mentor-desk` and `#help-desk`.
* **⏳ Submission (`submission`)**: Displays countdown timers and submission verification checklists.
* **🏆 Ceremony (`post_submission`)**: Highlights winners and award showcases.

### 4. Live Announcement Broadcaster (`AnnouncementPoster.tsx`)
Allows organizers to post formatted Discord-style bot messages directly into specific venue channels.
* Select target channel (e.g., `#food-updates`).
* Type message: *"🍕 Midnight pizza has arrived at Table 12! Grab your slice!"*
* Check **Mark as Emergency / High Priority Alert** if it requires visual pulsing.
* Click **🚀 Broadcast** to push to all stage screens via WebSocket!

### 5. Connected Display Monitor (`ConnectedDisplays.tsx`)
Provides AV crews with real-time health monitoring of all physical projector screens and TVs in the venue.
* When a display client opens, it sends a `display.hello` handshake with its hostname or IP.
* The admin console lists all active screens with a live pulsing green indicator (`Online`). If a TV screen disconnects or loses network, AV technicians can spot it immediately!

---

## 💻 Running the Admin Console

```bash
# Start dev server on port 5174
pnpm run dev

# Build production bundle to dist/
pnpm run build

# Preview production build locally
pnpm run preview
```
