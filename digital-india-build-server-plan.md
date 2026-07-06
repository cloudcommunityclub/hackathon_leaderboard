# Digital India Build Server Execution Plan

## 1. Product Vision

Digital India Build Server is a live, Discord-inspired venue operating system for a hackathon. Every screen in the venue behaves like a shared event server where teams come online, GitLab activity appears as bot messages, announcements are posted into channels, and the hall display rotates through meaningful event channels with a polished automated cursor.

The goal is not to clone Discord exactly. The goal is to use a familiar server/channel/chat metaphor and adapt it into a large-format, cinematic, readable, real-time event display.

Core experience promise:

> Every team should feel publicly welcomed, visible, and part of a live build community.

## 2. Naming And Brand Direction

Avoid the short form `DIH`, because it may be read poorly in public display contexts.

Recommended product name:

```text
Digital India Build Server
```

Alternative names:

```text
Digital India Live Server
Digital India Hackathon Live
Hackathon Build Server
Hall of Builders
Build Hall Live
India Build Server
```

Primary display title:

```text
Digital India Build Server
```

Secondary title:

```text
Hall of Builders
```

Tone:

```text
Familiar like Discord
Professional like event operations
Cinematic like a keynote screen
Readable like a public display
Playful only in controlled moments
```

## 3. Core Principles

### 3.1 Familiar, Not Copied

Use Discord-inspired concepts:

- Server rail
- Channel list
- Channel header
- Join messages
- Bot messages
- Status dots
- Member panel
- Reaction chips
- Wave-to-say-hi pattern
- Automated channel switching

Do not use:

- Discord logo
- Discord trademarks as the product identity
- Exact Discord icons or sounds
- Exact pixel-for-pixel interface copy
- Unmodified Discord UI assets

### 3.2 Public Display First

The UI must work on TVs and projectors, not just laptops.

Rules:

- Large type
- High contrast
- Low clutter
- Clear channel hierarchy
- Short messages
- No tiny chat density
- No fast scrolling
- No critical text near edges

### 3.3 Controlled Fun

Participant reactions, GIFs, and playful join messages are useful only if they stay controlled.

Rules:

- Curated reaction set
- Curated sticker/GIF pack for MVP
- Rate limits
- Moderation for user-generated content
- Admin kill switch
- No unrestricted text on public screens

### 3.4 Event Operations Override Everything

The system must always support event operations.

Priority order:

```text
Emergency announcement
Manual ops override
Submission countdown critical state
Team welcome
Major milestone
Auto channel rotation
Idle dashboard
```

## 4. MVP Scope

The MVP should focus on the most memorable and reliable parts.

MVP features:

1. Discord-inspired public display UI
2. `#arrivals` channel for team check-ins
3. Pretix webhook ingestion for check-ins
4. 15-20 second delayed team welcome
5. Team welcome animation lasting 3-5 seconds
6. Right-side online team panel
7. QR-powered wave/reaction page
8. Curated reaction buttons
9. Admin panel for manual announcements and pause controls
10. Auto channel rotation with animated cursor
11. GitLab bot messages for commits and milestones
12. Display reconnection and fallback state

Explicit MVP non-goals:

- Open Giphy search directly to screen
- Public free-text messages
- Full social media wall
- Complex live camera switching
- Fully automated judging/ranking
- Exact Discord clone
- Heavy 3D interface

## 5. Product Experience Overview

### 5.1 Check-In Experience

Flow:

```text
Participant arrives
Volunteer scans Pretix QR code
Pretix confirms check-in
Backend receives webhook
Backend schedules welcome after 18 seconds
Display remains on current channel
At scheduled time, #arrivals receives a join message
Team welcome animates for 3-5 seconds
QR wave prompt becomes active
Participants send reactions
Team status changes to Online
Welcome settles into feed history
Display returns to normal channel state
```

Recommended timing:

```text
Check-in delay: 18 seconds
Welcome intro animation: 0.6-1.0 seconds
Welcome hold: 3.0-4.0 seconds
Return animation: 0.6-0.8 seconds
Total takeover: 4.2-5.8 seconds
```

### 5.2 Wave-To-Say-Hi Experience

Flow:

```text
Display shows QR code
Participant scans once
Mobile page opens /wave/current
If welcome is active, current team appears
Participant taps reaction
Backend rate-limits and records reaction
Display receives reaction via WebSocket
Reaction chip count updates on public screen
```

Recommended reaction set:

```text
Wave
Clap
Ship It
Build Energy
Good Luck
Respect
Fire
Focus
```

MVP should use labels and optional icons. Public screen can show reaction chips:

```text
Wave x 18
Ship It x 9
Build Energy x 7
```

Avoid relying only on emojis because projector rendering and visual tone can vary.

### 5.3 Post-Check-In Auto Channel Experience

Once check-in is mostly or fully complete, the display enters Auto Pilot.

Flow:

```text
Display idles on current channel
Auto Pilot chooses next channel based on event phase and activity
Custom cursor appears
Cursor moves to channel list
Cursor hovers over target channel
Channel highlights
Cursor clicks with ripple
Main panel transitions to selected channel
Cursor fades out
Channel stays visible for configured duration
```

Auto channel switching must be interruptible by high-priority events.

## 6. Display UI Architecture

### 6.1 Public Display Layout

Use a Discord-inspired layout adapted for large screens.

Recommended 16:9 layout:

```text
+------------------------------------------------------------------------+
| Top Bar: Digital India Build Server | Phase | Teams Online | Time       |
+------+-------------------+--------------------------------+------------+
| Rail | Channel List      | Main Channel Feed              | Team Panel |
|      |                   |                                |            |
|      | # arrivals        | Join messages, bot messages,   | Online     |
|      | # gitlab-live     | announcements, welcome cards   | teams, QR  |
|      | # milestones      |                                | reactions  |
+------+-------------------+--------------------------------+------------+
| Bottom Status Ticker: latest event, network status, countdown           |
+------------------------------------------------------------------------+
```

Suggested proportions:

```text
Server rail: 4-5%
Channel rail: 15-17%
Main feed: 53-56%
Right panel: 23-27%
Top bar: 7-9% height
Bottom ticker: 5-7% height
```

### 6.2 Channels

Channel groups:

```text
WELCOME
# arrivals
# hall-of-builders
# announcements

BUILD
# gitlab-live
# milestones
# deployments
# submissions

VENUE
# food-updates
# mentor-desk
# sponsor-drops
# help-desk

FINAL
# submitted-builds
# judging
# winners
# recap
```

MVP channels:

```text
# arrivals
# hall-of-builders
# gitlab-live
# milestones
# food-updates
# mentor-desk
# submissions
# announcements
```

### 6.3 Channel Header Copy

Examples:

```text
# arrivals
Teams joining the build floor in real time

# hall-of-builders
All teams visible in one live wall

# gitlab-live
Live engineering activity from participant repositories

# milestones
Achievements unlocked across the hackathon

# food-updates
Meal, snack, and hydration updates

# mentor-desk
Mentor availability and active help sessions

# submissions
Final build status and submission countdown

# announcements
Important event updates from operations
```

### 6.4 Right Team Panel

The right panel should show:

```text
Online Builders
43 / 78

Recently Online
Team Quantum Coders
Team ByteStorm
Team Pixel Forge

Live Reactions
Scan to wave
[QR]

Current Team
Team Quantum Coders
Wave x 18 | Ship It x 9 | Fire x 7
```

For all 78 teams, use a compact grid or grouped list.

Team states:

```text
Pending: gray dot
Online: green dot
Recently joined: yellow pulse
GitLab active: blurple/purple pulse
Milestone: gold accent
Submitted: blue badge
Opted out: hidden from public media features
```

## 7. Visual Design System

### 7.1 Color Palette

Use a Discord-dark base with Digital India accents.

Hex palette:

```css
--bg: #0b0d12;
--sidebar: #111318;
--panel: #161922;
--panel-soft: #1f2330;
--panel-hover: #2a2d38;
--border: #2b2f3a;
--text: #f2f3f5;
--muted: #949ba4;
--muted-2: #6b7280;
--blurple: #5865f2;
--online: #23a55a;
--idle: #f0b232;
--danger: #f23f43;
--saffron: #ff8a1f;
--india-green: #21c55d;
--gold: #f6c453;
```

Preferred modern CSS color tokens using OKLCH:

```css
--bg: oklch(8% 0.025 260);
--sidebar: oklch(11% 0.025 260);
--panel: oklch(14% 0.035 260);
--panel-soft: oklch(18% 0.035 260);
--text: oklch(96% 0.01 260);
--muted: oklch(70% 0.03 260);
--blurple: oklch(60% 0.2 275);
--online: oklch(66% 0.17 150);
--saffron: oklch(72% 0.19 55);
--india-green: oklch(70% 0.18 145);
--gold: oklch(82% 0.16 85);
```

Rules:

- Use blurple for server/channel interaction cues.
- Use green for online/checked-in.
- Use saffron and gold for special event moments.
- Do not make the full UI tricolor.
- Do not use rainbow gradients.
- Keep the base dark and premium.

### 7.2 Typography

Recommended type system:

```text
Display: Space Grotesk
UI: Inter or Geist Sans
Data/Stats: JetBrains Mono or Geist Mono
```

Public display sizes:

```text
Top bar title: 30-40px
Channel name: 34-44px
Message author/team: 30-38px
Message body: 28-36px
Metadata: 18-24px
Hero team name: 72-110px
Status count: 30-44px
Ticker: 22-28px
```

Rules:

- No tiny Discord-like 14px text on the projector.
- No negative letter spacing.
- Keep team names readable at distance.
- Use uppercase sparingly for hero/team name states.

### 7.3 Motion Language

Motion should be polished and intentional.

Primary easing:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

Motion rules:

- Animate transform and opacity first.
- Avoid animating layout-heavy properties.
- Keep ambient motion slow.
- Make welcome animations short.
- Do not run constant distracting animations.
- Respect reduced motion setting where applicable.

Recommended durations:

```text
Cursor move: 700-1200ms
Cursor click ripple: 300-450ms
Channel transition: 500-800ms
Join message slide: 400-600ms
Welcome expansion: 700-1000ms
Welcome hold: 3000-4500ms
Reaction chip arrival: 300-700ms
```

## 8. Join Message System

### 8.1 Message Categories

Use rotating templates with controlled tone.

Recommended ratio:

```text
70% clean welcome messages
20% playful messages
10% rare special messages
```

Clean templates:

```text
{team} joined the Build Server.
{team} is now online.
{team} entered #build-floor.
{team} connected to Digital India Hackathon.
{team} arrived in the lobby.
{team} entered build mode.
{team} joined the mission.
{team} synced with the venue.
```

Playful templates:

```text
A wild {team} appeared.
{team} just showed up.
Yay, you made it, {team}.
Everyone welcome {team}.
Glad you are here, {team}.
{team} has entered the chat.
{team} spawned at the venue.
```

Hackathon templates:

```text
{team} joined. The commit graph is watching.
{team} is online. Awaiting first commit.
{team} entered build mode. Bugs have been warned.
{team} connected. Caffeine protocol recommended.
{team} is here. Let the build begin.
{team} joined. Ship energy increased.
{team} is ready to turn caffeine into commits.
```

### 8.2 Button Copy

Rotate visual CTA button labels:

```text
Wave to say hi!
Send build energy
Welcome builders
Start the sprint
Good luck team
Enter build mode
Ship it
```

Buttons on the public display are mostly visual. If interaction is needed, users scan the QR.

### 8.3 Welcome Card Copy

Recommended default:

```text
Team Quantum Coders
joined the Build Server

SNIST Hyderabad · AI Track

Wave to say hi!
```

Hero state:

```text
TEAM QUANTUM CODERS
is now online

Welcome to Digital India Hackathon
```

Reaction summary:

```text
43 people sent build energy
```

## 9. QR Reaction System

### 9.1 Public QR Strategy

Use one stable QR code:

```text
/wave/current
```

This points to the currently active welcome. Users can scan once and keep the page open.

Benefits:

- No need to generate a new QR for each team.
- Faster crowd participation.
- Easier signage.
- Works across repeated welcome moments.

### 9.2 Mobile Reaction Page

Mobile page states:

```text
No active welcome:
No team is being welcomed right now. Stay ready for the next arrival.

Active welcome:
Now welcoming Team Quantum Coders. Send build energy.

Already reacted:
Sent. Watch the big screen.

Rate limited:
You already reacted to this welcome.
```

Mobile page actions:

```text
Wave
Clap
Ship It
Build Energy
Good Luck
Respect
Fire
Focus
```

### 9.3 Reaction Rules

MVP limits:

```text
One reaction per browser/session per welcome
Maximum 30 individual reaction animations displayed
Reaction counts can continue increasing after animation cap
Reaction window active only during welcome and short grace period
Grace period: 10-15 seconds after welcome
No public free text
No unrestricted GIF search
```

### 9.4 Curated Stickers/GIFs

MVP approach:

```text
Use curated sticker/GIF pack only.
Ops can upload or approve assets before event.
Users choose from safe predefined options.
```

Curated categories:

```text
Wave
Rocket
Fire
Clap
Good luck
Coding
Bug fixed
Ship it
Caffeine
Robot
```

Future Giphy integration:

```text
Use Giphy API rating G/PG
Restrict search terms
Require moderation approval
Cache approved GIFs
Never auto-display raw search results
```

## 10. Auto Cursor And Channel Rotation

### 10.1 Cursor Concept

The automated cursor is a theatrical device that makes channel switching feel intentional and Discord-like.

Cursor name:

```text
Auto Pilot
```

Visual style:

```text
Custom glowing cursor
Subtle blurple edge light
Small trailing particles
Click ripple
Optional small label: Auto Pilot
```

Do not use a default OS mouse pointer.

### 10.2 Cursor Flow

```text
Idle on current channel
Next channel selected by scheduler
Cursor fades in
Cursor moves along smooth path to channel
Target channel hover state activates
Cursor clicks
Click ripple appears
Channel becomes active
Main content transitions
Cursor fades out
```

### 10.3 Phase-Based Rotation

Check-in phase:

```text
# arrivals: 50s
# hall-of-builders: 35s
# announcements: 25s
```

Coding phase:

```text
# gitlab-live: 45s
# milestones: 30s
# hall-of-builders: 35s
# mentor-desk: 25s
# announcements: 25s
```

Meal phase:

```text
# food-updates: 35s
# announcements: 25s
# hall-of-builders: 30s
# gitlab-live: 30s
```

Mentor phase:

```text
# mentor-desk: 40s
# gitlab-live: 35s
# milestones: 30s
# hall-of-builders: 30s
```

Submission phase:

```text
# submissions: 60s
# countdown: 45s
# announcements: 30s
# submitted-builds: 35s
```

Post-submission phase:

```text
# submitted-builds: 45s
# highlights: 40s
# recap: 45s
# awards: 35s
```

### 10.4 Activity-Aware Rotation

The scheduler should prefer channels with fresh content.

Example rules:

```text
If emergency announcement exists, override all channels.
If active welcome exists, pause rotation.
If food announcement is new, show #food-updates next.
If GitLab activity is high, show #gitlab-live sooner.
If milestone just occurred, show #milestones.
If mentor availability changed, show #mentor-desk.
If no priority content exists, show #hall-of-builders.
```

## 11. Backend Architecture

### 11.1 High-Level Architecture

```text
Pretix Webhooks        GitLab Webhooks        Admin UI        QR Reactions
      |                     |                   |                  |
      v                     v                   v                  v
Webhook Receiver      Webhook Receiver     Admin API        Reaction API
      |                     |                   |                  |
      +-----------> Event Normalizer <----------+------------------+
                            |
                            v
                    Event Store / Audit Log
                            |
                            v
                    Redis Stream / Queue
                            |
                            v
                  Rules + Priority Engine
                            |
                            v
                  Display State Manager
                            |
                            v
                    WebSocket Gateway
                            |
                            v
                    Venue Display Clients
```

### 11.2 Services

MVP services:

```text
API server
Webhook receiver
Event normalizer
Queue worker
Display state manager
WebSocket gateway
Admin UI
Public display UI
Mobile reaction page
```

Optional split later:

```text
Certificate generator
Giphy moderation service
Analytics exporter
Display health monitor
```

### 11.3 Core Entities

Team:

```json
{
  "id": "team_quantum_coders",
  "name": "Team Quantum Coders",
  "college": "SNIST Hyderabad",
  "track": "AI Track",
  "table": "B12",
  "status": "pending",
  "checkedInAt": null,
  "optOutPublicMedia": false
}
```

Event:

```json
{
  "id": "evt_123",
  "type": "team.checked_in",
  "source": "pretix",
  "teamId": "team_quantum_coders",
  "receivedAt": "2026-07-06T10:30:00Z",
  "scheduledFor": "2026-07-06T10:30:18Z",
  "priority": 70,
  "payload": {}
}
```

Display State:

```json
{
  "activeChannel": "arrivals",
  "phase": "check_in",
  "overlay": {
    "type": "team_welcome",
    "teamId": "team_quantum_coders",
    "endsAt": "2026-07-06T10:30:23Z"
  },
  "stats": {
    "teamsOnline": 43,
    "totalTeams": 78
  }
}
```

Reaction:

```json
{
  "id": "reaction_123",
  "welcomeId": "welcome_456",
  "teamId": "team_quantum_coders",
  "kind": "ship_it",
  "sessionIdHash": "hash",
  "createdAt": "2026-07-06T10:30:20Z"
}
```

### 11.4 Event Types

Check-in:

```text
team.checked_in
team.welcome_scheduled
team.welcome_started
team.welcome_finished
```

Reactions:

```text
reaction.created
reaction.rejected_rate_limited
reaction.summary_updated
```

GitLab:

```text
gitlab.push
gitlab.first_commit
gitlab.merge_request_created
gitlab.deployment_success
gitlab.issue_closed
gitlab.commit_milestone
```

Ops:

```text
ops.announcement_created
ops.emergency_started
ops.emergency_ended
ops.phase_changed
ops.rotation_paused
ops.rotation_resumed
```

Display:

```text
display.connected
display.disconnected
display.heartbeat
display.channel_changed
```

## 12. API Design

### 12.1 Pretix Webhook

Endpoint:

```http
POST /api/webhooks/pretix
```

Responsibilities:

- Verify webhook signature if available.
- Parse order/check-in payload.
- Map attendee to team.
- Deduplicate by Pretix check-in ID.
- Mark team checked in.
- Schedule welcome after configured delay.
- Write audit log entry.

### 12.2 GitLab Webhook

Endpoint:

```http
POST /api/webhooks/gitlab
```

Responsibilities:

- Verify GitLab webhook secret.
- Map project/repository to team.
- Normalize push/MR/deployment events.
- Aggregate noisy push events.
- Detect milestones.
- Create bot message in correct channel.

### 12.3 Reaction API

Current welcome:

```http
GET /api/wave/current
```

Create reaction:

```http
POST /api/wave/reactions
```

Request:

```json
{
  "welcomeId": "welcome_456",
  "kind": "ship_it"
}
```

Response:

```json
{
  "ok": true,
  "counts": {
    "wave": 18,
    "ship_it": 9,
    "fire": 7
  }
}
```

### 12.4 Admin API

Examples:

```http
POST /api/admin/announcements
POST /api/admin/emergency/start
POST /api/admin/emergency/end
POST /api/admin/phase
POST /api/admin/rotation/pause
POST /api/admin/rotation/resume
POST /api/admin/channel
POST /api/admin/team/:id/replay-welcome
POST /api/admin/team/:id/hide
```

### 12.5 Display WebSocket

Endpoint:

```text
WS /ws/display
```

Message types from server:

```text
display.state
channel.change
welcome.start
welcome.end
reaction.update
bot.message
announcement.show
cursor.animate
phase.change
```

Message types from client:

```text
display.hello
display.heartbeat
display.ready
display.error
```

## 13. Data Storage

### 13.1 Recommended Stack

MVP:

```text
PostgreSQL for durable data
Redis for queue, scheduling, and pub/sub
Object storage/local storage for curated GIFs/stickers
```

Tables:

```text
teams
checkins
events
display_messages
welcomes
reactions
announcements
gitlab_events
display_clients
admin_actions
moderation_assets
```

### 13.2 Audit Log

Every displayed event should be auditable.

Audit fields:

```text
event_id
source
event_type
team_id
received_at
displayed_at
display_duration
decision_reason
priority
admin_actor_id optional
```

## 14. Admin Console

### 14.1 MVP Admin Features

Required controls:

- View current display state
- Change event phase
- Pause/resume auto rotation
- Force channel
- Create announcement
- Start/stop emergency message
- Replay team welcome
- Hide team from public features
- View connected displays
- View webhook health
- View reaction counts

### 14.2 Admin Safety Controls

Required kill switches:

```text
Pause all welcomes
Pause reactions
Pause GIF/sticker display
Pause GitLab bot messages
Force announcements channel
Emergency takeover
Display fallback mode
```

### 14.3 Sponsor Desk / Reward Future Feature

Future admin functions:

```text
Select lucky team
Generate pickup code
Display sponsor reward message
Confirm delivery
Audit reward fulfillment
```

## 15. GitLab Integration

### 15.1 Bot Identity

Use event bots:

```text
GitLab Bot
Ops Bot
Mentor Desk Bot
Submission Bot
Sponsor Bot
```

Example GitLab message:

```text
GitLab Bot
Team Neural Nexus pushed 18 commits to main.
+1,432 lines · 4 files changed
```

Milestone message:

```text
GitLab Bot
Team ByteStorm unlocked 50 commits.
Achievement: Ship Streak
```

### 15.2 Noise Control

Rules:

- Aggregate pushes within 60 seconds per team.
- Show first commit immediately.
- Show milestone commits only at thresholds.
- Do not show every tiny commit as a major event.
- Use bot feed entries for normal activity.
- Use overlay only for important milestones.

Milestone thresholds:

```text
First commit
10 commits
25 commits
50 commits
100 commits
First merge request
First deployment
First issue closed
Submission completed
```

## 16. Display Client Reliability

### 16.1 Display Client Requirements

Each display client should:

- Open in fullscreen browser mode
- Connect to WebSocket automatically
- Send heartbeat every 10 seconds
- Reconnect with backoff
- Cache last known team list
- Show fallback UI if backend disconnects
- Recover without manual refresh
- Identify itself with display name/location

### 16.2 Fallback States

If WebSocket disconnects:

```text
Show cached Hall of Builders
Show small disconnected indicator for ops only
Attempt reconnect
Do not blank screen
```

If data is unavailable:

```text
Show Digital India Build Server holding screen
Show current event phase and time if available
```

## 17. Security, Privacy, And Moderation

### 17.1 Privacy Rules

- Support opt-out teams.
- Do not show phone numbers or personal emails.
- Avoid showing individual participant names unless explicitly approved.
- Use team name as primary identity.
- Allow immediate public removal via admin.
- Log all public display actions.

### 17.2 Reaction Safety

- No public free text in MVP.
- Curated reaction set only.
- Curated stickers/GIFs only.
- Rate-limit by session/IP/device fingerprint where appropriate.
- Allow admin pause reactions globally.

### 17.3 Webhook Security

- Verify Pretix webhook signatures/secrets.
- Verify GitLab webhook token.
- Reject unknown event sources.
- Deduplicate webhook events.
- Store raw payloads only if privacy policy allows.
- Mask sensitive fields in logs.

## 18. Implementation Roadmap

### Phase 0: Product And Design Lock

Duration: 2-3 days

Deliverables:

- Final name and brand direction
- Channel list
- Join message templates
- Reaction set
- Display layout wireframe
- Admin control list
- Event priority rules

Acceptance criteria:

- Stakeholders approve the display concept.
- No unresolved naming issues remain.
- MVP scope is frozen.

### Phase 1: Static Prototype

Duration: 4-6 days

Deliverables:

- Public display frontend with fake data
- Discord-inspired layout
- Team panel
- `#arrivals` feed
- Welcome animation prototype
- Auto cursor prototype
- QR reaction visual mock

Acceptance criteria:

- Looks good at 1920x1080.
- Team welcome is readable from distance.
- Cursor channel switching feels intentional.
- Design does not look like a generic dashboard.

### Phase 2: Real-Time Backend Foundation

Duration: 5-7 days

Deliverables:

- API server
- PostgreSQL schema
- Redis queue
- WebSocket gateway
- Display state manager
- Event audit log
- Display heartbeat

Acceptance criteria:

- Display receives live state changes.
- Display reconnects after backend restart.
- Events are persisted and auditable.
- Admin can force a channel.

### Phase 3: Pretix Check-In Integration

Duration: 3-5 days

Deliverables:

- Pretix webhook endpoint
- Team mapping
- Check-in deduplication
- 18-second welcome scheduling
- Welcome start/end WebSocket events
- Team online status update

Acceptance criteria:

- Check-in welcome appears within configured delay plus queue time.
- Duplicate webhooks do not duplicate welcomes.
- Team status changes from pending to online.
- Welcome settles into `#arrivals` feed history.

### Phase 4: QR Reactions

Duration: 4-6 days

Deliverables:

- `/wave/current` mobile page
- Reaction API
- Session rate limiting
- Reaction count display
- Public QR placement
- Admin pause reactions toggle

Acceptance criteria:

- User can scan once and react to active welcome.
- One session cannot spam the same welcome.
- Reaction counts update on display in real time.
- Reactions do not cover critical text.

### Phase 5: GitLab Activity And Milestones

Duration: 5-7 days

Deliverables:

- GitLab webhook endpoint
- Project-to-team mapping
- Push aggregation
- Milestone detection
- `#gitlab-live` bot messages
- `#milestones` channel

Acceptance criteria:

- First commit creates a visible event.
- Commit milestones create milestone messages.
- Push spam is aggregated.
- GitLab bot messages are readable and rate-limited.

### Phase 6: Admin Console

Duration: 5-7 days

Deliverables:

- Admin auth strategy
- Phase controls
- Announcement creation
- Emergency takeover
- Pause/resume toggles
- Connected displays view
- Replay welcome action

Acceptance criteria:

- Ops can pause all public events quickly.
- Emergency announcement overrides display.
- Admin actions are logged.
- Connected displays show heartbeat status.

### Phase 7: Hardening And Event Rehearsal

Duration: 4-6 days

Deliverables:

- Load test with simulated check-ins
- WebSocket disconnect testing
- Projector readability test
- Mobile QR test with many devices
- Fallback screen validation
- Runbook for volunteers

Acceptance criteria:

- 78 teams can be processed without display failure.
- 100+ simultaneous QR users do not break reactions.
- Display recovers from network drop.
- Ops team can run the system from admin console.

## 19. Testing Plan

### 19.1 Functional Tests

- Pretix webhook creates check-in event.
- Duplicate check-in is ignored.
- Welcome schedules after configured delay.
- Welcome starts and ends correctly.
- Team status updates correctly.
- Reaction endpoint accepts valid reactions.
- Reaction endpoint rejects duplicates.
- GitLab push maps to correct team.
- Milestone detection works.
- Admin emergency override works.

### 19.2 Display Tests

- 1920x1080 projector layout
- 1366x768 fallback laptop layout
- 4K TV layout
- Fullscreen mode
- Long team names
- Missing college/track metadata
- 78-team panel rendering
- Welcome animation timing
- Cursor channel switching
- Reduced motion mode

### 19.3 Load Tests

Scenarios:

```text
78 check-ins over 30 minutes
78 check-ins over 5 minutes
200 reactions in 60 seconds
500 GitLab events in 10 minutes
10 displays connected simultaneously
Backend restart during active display
Network disconnect and reconnect
```

### 19.4 Event Rehearsal

Run a full rehearsal:

```text
Import team list
Connect two display machines
Trigger fake Pretix check-ins
Scan QR from phones
Trigger GitLab fake pushes
Create food announcement
Use emergency override
Pause/resume rotation
Disconnect network
Recover display
```

## 20. Operational Runbook

### 20.1 Before Event

Checklist:

- Import team list.
- Verify Pretix mapping.
- Verify GitLab repository mapping.
- Upload curated stickers/GIFs.
- Test all display machines.
- Test projector readability.
- Open display in fullscreen.
- Confirm admin login.
- Confirm emergency message works.
- Print backup QR signage.
- Confirm fallback screen.

### 20.2 During Check-In

Ops should monitor:

- Check-in webhook health
- Welcome queue length
- Connected displays
- Reaction volume
- Any hidden/opt-out teams
- Emergency announcements

If welcome queue gets too long:

```text
Reduce welcome duration to 3 seconds.
Disable GIF/sticker display.
Keep reaction counts only.
Batch return to #hall-of-builders every 8-10 welcomes.
```

### 20.3 During Coding

Ops should monitor:

- GitLab event rate
- Milestone frequency
- Auto rotation behavior
- Mentor channel accuracy
- Food announcements
- Display connectivity

### 20.4 Submission Window

Rules:

- Submission countdown gets high priority.
- Reduce playful animations.
- Prioritize `#submissions` and announcements.
- Keep critical instructions visible long enough.

## 21. Metrics

Product metrics:

```text
Teams checked in
Welcomes displayed
Average delay from check-in to welcome
Reaction participation count
Unique reaction sessions
Most used reactions
GitLab events processed
Milestones displayed
Display uptime
Admin overrides used
```

Event impact metrics:

```text
Photos/videos recorded by participants
Sponsor reward engagement
Post-event recognition survey
Certificate stats generated
Participant satisfaction score
```

System health metrics:

```text
Webhook latency
Queue depth
WebSocket connected clients
Display heartbeat age
Event processing errors
Reaction API rate-limit count
Database write failures
```

## 22. Risks And Mitigations

### 22.1 Display Looks Too Much Like Discord

Risk:

The UI may look like an unauthorized Discord clone.

Mitigation:

- Use custom branding.
- Use original icons and cursor.
- Use own layout scale and event-specific modules.
- Do not use Discord logos/sounds/assets.

### 22.2 QR Reactions Get Spammed

Risk:

Participants spam reactions.

Mitigation:

- One reaction per session per welcome.
- Display animation cap.
- Admin pause reactions.
- No public free text.

### 22.3 GIFs Become Inappropriate

Risk:

Unmoderated GIFs show inappropriate content.

Mitigation:

- MVP uses curated GIFs only.
- Future Giphy search requires moderation.
- Admin kill switch.

### 22.4 Welcome Queue Becomes Too Long

Risk:

If many check-ins happen quickly, welcome events stack up.

Mitigation:

- Keep welcome duration 3-5 seconds.
- Use queue visibility in admin.
- Batch Hall of Builders return after 8-10 welcomes.
- Allow ops to reduce duration live.

### 22.5 Display Disconnects

Risk:

TV/projector loses network.

Mitigation:

- Local cached state.
- Auto reconnect.
- Heartbeat monitoring.
- Fallback holding screen.

### 22.6 Too Much Motion

Risk:

Display becomes distracting.

Mitigation:

- Motion caps.
- No constant bouncing.
- Priority engine.
- Admin pause animations.

## 23. Acceptance Criteria

### Product Acceptance

- Every checked-in team receives a public welcome.
- Welcome appears after a configurable 15-20 second delay.
- Welcome lasts 3-5 seconds.
- Display returns to normal state automatically.
- Teams appear as online after check-in.
- QR reactions work during active welcome.
- Auto cursor rotates through channels after check-in phase.
- Ops can pause or override the display.

### Technical Acceptance

- Pretix webhook is verified and deduplicated.
- GitLab webhook is verified and rate-limited.
- Display updates over WebSocket.
- Display reconnects automatically.
- All displayed events are logged.
- Admin actions are logged.
- System supports at least 10 connected display clients.
- System supports 78 teams and burst check-in scenarios.

### UI Acceptance

- Text is readable on projector from event-hall distance.
- Long team names do not overflow.
- Channel switching is smooth and understandable.
- Welcome animation feels integrated with the server UI.
- QR code is visible but not intrusive.
- Reactions do not cover core welcome text.
- UI is Discord-inspired but custom branded.

## 24. Suggested Tech Stack

Frontend:

```text
React with Vite or Next.js
Framer Motion or Motion One
CSS variables with OKLCH colors
WebSocket client
QRCode rendering library
```

Backend:

```text
Node.js with Fastify/NestJS or Python with FastAPI
PostgreSQL
Redis
WebSocket gateway
Background worker
```

Deployment:

```text
Docker Compose for event-local deployment
Cloud deployment optional
Local venue network preferred for display reliability
```

Monitoring:

```text
Basic admin health dashboard
Structured logs
Display heartbeat table
Queue depth view
Webhook error counters
```

## 25. Final MVP Build Checklist

Build in this order:

1. Static public display UI
2. Team data model and fake team list
3. Welcome animation with fake check-in
4. Auto cursor channel switching
5. WebSocket display state updates
6. Pretix webhook and scheduled welcome queue
7. QR mobile reaction page
8. Reaction WebSocket updates
9. Admin pause/override controls
10. GitLab bot messages
11. Display reconnect/fallback handling
12. Load test and rehearsal

## 26. Final Recommended Experience

During check-in:

```text
Digital India Build Server is open on #arrivals.

A team checks in.
18 seconds later, a Discord-style join message appears.
The welcome expands into a cinematic card.
The QR invites the crowd to wave.
Reactions appear as clean chips.
The team becomes Online in the member panel.
The message settles into the feed.
```

After check-in:

```text
Auto Pilot takes over.
A custom glowing cursor moves through channels.
It opens #gitlab-live, #milestones, #food-updates, #mentor-desk, #submissions, and #hall-of-builders.
Each channel stays long enough to read.
High-priority events interrupt the rotation.
The display always feels alive but never chaotic.
```

The result should feel like a live community server projected into the physical venue: familiar to students, useful for operations, memorable for teams, and polished enough to feel like a premium hackathon experience.
