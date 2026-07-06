# `@build-server/display` — Public TV & LED Wall Stage Client

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **The ultra-slick, Discord-inspired 16:9 stage display application designed for venue LED walls, projectors, and lobby TVs.**

---

## 📺 Overview & Visual Design System

The public display client is built to wow hackathon attendees from the moment they step into the venue. Designed with a sleek **Discord dark-mode aesthetic**, it features curated color palettes, glassmorphic panels, micro-animations, custom scrollbars, and seamless infinite marquees.

### Key Visual Components
1. **Top Bar (`TopBar.tsx`)**: Displays event title, active phase badge, real-time online team counter (`42 / 78 Online`), and a live synchronized Indian Standard Time (IST) clock.
2. **Server & Channel Rails (`ServerRail.tsx`, `ChannelRail.tsx`)**: Mirrors Discord navigation. Highlights active channels like `#hall-of-builders`, `#announcements`, and `#food-updates`.
3. **Main Stage Feed (`MainFeed.tsx`)**: The central canvas. When normal, displays live chat messages and GitLab commit streams. When a team arrives, transforms into a high-impact **Welcome Celebration Card** with college and track details.
4. **Right Team Sidebar (`RightTeamPanel.tsx`)**: Displays all **78+ registered hackathon teams** in a custom-scrollable grid grouped by status (`ONLINE` vs `OFFLINE`). Features a **Live Scannable QR Code** generated via `qrcode.react` allowing attendees to point their phone at the TV screen and open the `/wave` reaction app instantly!
5. **Auto Pilot Glowing Cursor (`AutoPilotCursor.tsx`)**: When the screen is idle, a glowing virtual cursor animates across the screen, clicking on channels to keep the display dynamic and engaging.
6. **Bottom News Ticker (`BottomTicker.tsx`)**: A seamless CSS infinite marquee (`@keyframes marquee`) scrolling real-time announcements, sponsor drops, and milestone achievements across the bottom of the screen without glitches or jumps.

---

## 🖥️ Hardware & Kiosk Setup Guide for AV Technicians

When deploying this application on venue stage LED walls or projectors, follow these guidelines for optimal performance:

### 1. Display Resolution & Aspect Ratio
* **Target Aspect Ratio**: `16:9` widescreen (e.g., `1920x1080` Full HD or `3840x2160` 4K Ultra HD).
* **Scaling**: In operating system display settings, ensure **Scale and layout** is set exactly to `100%` (do not use 125% or 150% Windows scaling, or UI elements may overflow).

### 2. Browser Kiosk Mode Configuration
To run without browser address bars, tabs, or OS taskbars, launch Google Chrome or Microsoft Edge in full-screen **Kiosk Mode**:

```bash
# Linux / macOS Chrome Kiosk Mode
google-chrome --kiosk --incognito --no-errdialogs --disable-translate --fast --fast-start http://localhost:5173

# Windows Chrome Kiosk Mode (Run from Command Prompt)
chrome.exe --kiosk --incognito --no-errdialogs --disable-translate --fast --fast-start http://localhost:5173
```

### 3. Audio & Sound Effects Setup
When a team arrives on stage (`welcome.start` event), the display client triggers celebratory audio cues (fanfare / level-up sounds).
* Ensure HDMI audio or 3.5mm audio jack output from the display computer is routed into the **venue PA / sound mixer**.
* In browser settings, ensure **Auto-play audio permissions** are explicitly allowed for the venue hostname or `localhost`.

---

## 🧩 Component Architecture (`useDisplayWebSocket`)

To keep rendering performant and maintainable, all WebSocket connection handling, reconnection logic, state fetching, and rotation timers are encapsulated inside a custom React hook: `src/lib/useDisplayWebSocket.ts`.

```tsx
// Clean coordination inside App.tsx
export default function App() {
  const { state, teams, messages, cursor, playCursorAnimation, selectChannel } = useDisplayWebSocket();

  return (
    <div className="h-screen w-screen flex flex-col bg-discord-bg text-discord-text font-ui select-none overflow-hidden">
      <TopBar phase={state.phase} teamsOnline={state.teamsOnline} totalTeams={state.totalTeams} />
      <div className="flex-1 flex overflow-hidden relative">
        <ServerRail />
        <ChannelRail activeChannel={state.activeChannel} onSelectChannel={selectChannel} />
        <MainFeed activeChannel={state.activeChannel} welcome={state.welcome} teams={teams} messages={messages} />
        <RightTeamPanel teams={teams} teamsOnline={state.teamsOnline} totalTeams={state.totalTeams} />
        <AutoPilotCursor visible={cursor.visible} x={cursor.x} y={cursor.y} target={cursor.target} />
      </div>
      <BottomTicker messages={messages} phase={state.phase} />
    </div>
  );
}
```

---

## 📱 Mobile QR Interaction Flow

1. The TV screen displays a dynamic QR code in the bottom right corner of `RightTeamPanel.tsx`.
2. An attendee points their smartphone camera at the LED screen.
3. The QR code opens `http://<venue-server-ip>:3001/wave` on their mobile browser.
4. The attendee taps **👋 Wave Hello**, **🚀 Ship It**, or **🔥 Fire Energy**.
5. The reaction is sent via REST API to the backend, stored in Redis, and broadcasted over WebSockets to trigger live particle animations on the main LED screen!

---

## 🚀 Running Locally & Building

```bash
# Start Vite development server on port 5173
pnpm run dev

# Build optimized static production bundle to dist/
pnpm run build

# Preview production build locally
pnpm run preview
```
