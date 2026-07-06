# 📋 Event Day Operational Runbook — Digital India Build Server

> **MANDATORY READING FOR EVENT DIRECTORS, HACKATHON ORGANIZERS, AND AV TECHNICIANS.**
> This document outlines the exact step-by-step procedures, checklists, and timelines required to run the Digital India Build Server flawlessly during a live national hackathon.

---

## 👥 Roles & Responsibilities

| Role | Assigned To | Primary Responsibilities |
| :--- | :--- | :--- |
| **AV Stage Director** | Production / AV Crew | Setup LED wall display computer, configure full-screen kiosk mode, verify HDMI audio mixer routing. |
| **Ops Command Officer** | Lead Hackathon Organizer | Monitor Admin Console (`Port 5174`), switch event phases according to schedule, broadcast food/mentor updates. |
| **Registration Desk Lead** | Front Desk Volunteer Lead | Ensure Pretix RFID scanners are synced and webhooks are firing cleanly upon badge tap. |
| **Network Tech Lead** | Venue Wi-Fi / IT Engineer | Ensure local venue router allows WebSocket traffic (`Port 3001`) and TV screens are on static local IPs. |

---

## ⏰ Minute-by-Minute Event Timeline & Checklist

### 🟢 Phase 1: Pre-Event Setup & Calibration (T-3 Hours to T-30 Mins)

- [ ] **1. Server & Database Boot**
  * Verify PostgreSQL and Redis instances are running and healthy.
  * Start the backend server: `pnpm run build && pnpm run start` in `apps/server`.
  * Check backend health endpoint: `curl http://localhost:3001/health` -> should return `{"status":"ok"}`.
- [ ] **2. AV Stage Screen Setup (LED Wall & Projectors)**
  * Connect stage display PC to LED wall via HDMI (verify 1080p or 4K 16:9 resolution, 100% OS scaling).
  * Route audio output into venue sound system / PA mixer.
  * Launch Google Chrome in Kiosk Mode pointing to display client:
    ```bash
    google-chrome --kiosk --incognito --no-errdialogs --autoplay-policy=no-user-gesture-required http://<server-ip>:5173
    ```
  * Verify sound effects play when test check-ins occur.
- [ ] **3. Admin Console Sync**
  * Open Ops Laptop and navigate to Admin Console: `http://<server-ip>:5174`.
  * Check **Connected Public Displays** panel -> verify Stage LED Wall appears as `Online`.
  * Set initial Event Phase to **🎟️ Check-In (`check_in`)**.
- [ ] **4. Pretix RFID Scanner Test**
  * Perform a test badge tap at the front desk scanner.
  * Verify webhook arrives at `/api/webhooks/pretix`.
  * **Verify 18-Second Walk Delay**: Ensure the stage screen waits exactly 18 seconds before triggering the celebratory welcome banner and fanfare sound!
- [ ] **5. Mobile QR Code Test**
  * Point smartphone camera at the bottom-right QR code on the stage TV screen.
  * Verify mobile app opens `/wave` and tapping **👋 Wave Hello** sends live reactions to the screen.

---

### 🟡 Phase 2: Live Check-In & Venue Arrival (T-0 to T+2 Hours)

* **Ops Console Status**: Phase = `check_in` | Auto Pilot Rotation = `Active`.
* **Registration Desk Action**: As teams arrive and tap badges, Pretix webhooks continuously queue welcomes in Redis (`welcome:queue`).
* **What Attendees See**: As teams walk into the Hall of Builders, the massive LED screen announces their college and track with glowing fanfare!
* **Ops Task**: If a massive crowd arrives at once, let Auto Pilot handle the queue automatically. Do NOT pause rotation unless AV announcements are being made from the podium.

---

### 🔵 Phase 3: Coding Mode & GitLab Activity (T+2 Hours to T+20 Hours)

* **Ops Console Action**: At opening ceremony conclusion, click **💻 Coding Mode (`coding`)** in Phase Selector.
* **What Changes**: The screen rotation shifts focus to `#hall-of-builders`, `#milestones`, and live GitLab commit feeds.
* **GitLab Integration**: As teams push code to their repositories, commits stream across the stage screen in real time (*"🚀 Team Neural Nomads pushed 4 commits to main!"*).
* **Broadcasting Announcements**:
  * During lunch/dinner, use **Announcement Poster** -> Select `#food-updates` -> Post: *"🍕 Dinner buffet is now open at Hall B! Please bring your participant badges."*
  * For mentor hours, select `#mentor-desk` -> Post: *"🧑‍🏫 AI/ML mentors are now stationed at Desk 4 for code reviews."*

---

### 🟣 Phase 4: Final Countdown & Submission (T+20 Hours to T+24 Hours)

* **Ops Console Action**: 4 hours before deadline, click **⏳ Submission (`submission`)** in Phase Selector.
* **What Changes**: Stage screen highlights countdown timers and submission stat checklists.
* **AV Task**: Ensure audio volume is adjusted for hourly countdown warning chimes.
* **Emergency Override Protocol**: If Git servers or submission portals experience network latency, use **Emergency Banner Override**:
  * Type: *"🚨 SUBMISSION DEADLINE EXTENDED BY 15 MINUTES DUE TO NETWORK CONGESTION 🚨"*
  * Click **Trigger Alert 🚨**. This overrides all TVs instantly!

---

### 🟠 Phase 5: Ceremony & Showcase (Post-Submission)

* **Ops Console Action**: Click **🏆 Ceremony (`post_submission`)** in Phase Selector.
* **AV Task**: Click **⏸ Pause Auto Pilot Rotation** so the screen remains frozen on the Winner Showcase slide while judges present trophies on stage!

---

## 🚨 Emergency Troubleshooting & FAQ

### Q1: The stage LED wall suddenly went black or disconnected!
* **Check**: In Admin Console (`Port 5174`), look at **Connected Public Displays**. Is the screen listed as offline?
* **Fix**: On the stage PC, press `Alt+F4` (Windows) or `Cmd+Q` (macOS) to close Chrome, check Ethernet/Wi-Fi connection, and relaunch Chrome kiosk command. Upon reopening, it will instantly fetch master state from Redis!

### Q2: A team checked in at the front desk, but their welcome banner didn't appear on stage!
* **Check**: Did they walk faster than 18 seconds? The system intentionally delays banners by 18 seconds (`scheduler.ts`) so teams can walk into the hall before their name flashes!
* **Check Redis Queue**: In terminal, run `redis-cli zrange welcome:queue 0 -1` to see if their check-in is queued and waiting to trigger.

### Q3: We need to freeze the stage screen immediately for a VIP announcement!
* **Fix**: In Admin Console, click **⏸ Pause Auto Pilot Rotation**. This instantly stops channel switching across all venue screens. Click **▶ Resume** when the VIP finishes speaking.
