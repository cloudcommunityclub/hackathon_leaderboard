# 🔌 Webhook Integration & Simulation Guide

> **A comprehensive developer guide for configuring, authenticating, and testing Pretix ticketing check-ins and GitLab repository webhooks locally using `curl` and Postman.**

---

## 🎟️ 1. Pretix RFID Check-In Webhook

When an attendee taps their RFID badge or scans their QR ticket at the registration front desk, Pretix sends an HTTP `POST` webhook to the Build Server.

### Endpoint Configuration in Pretix
* **Target URL**: `http://<your-server-ip>:3001/api/webhooks/pretix`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Trigger Event**: `checkin.created` or `order.placed`

### Security & Signature Verification
To prevent unauthorized check-in spoofing, configure a shared secret in `apps/server/.env`:
```ini
PRETIX_WEBHOOK_SECRET="super-secret-pretix-key"
```
The server checks the `X-Pretix-Signature` or HMAC header against this secret before ingesting the check-in.

### Local Simulation with `curl`
You can simulate an attendee arriving at the registration desk by running this command in your terminal:

```bash
curl -X POST http://localhost:3001/api/webhooks/pretix \
  -H "Content-Type: application/json" \
  -H "X-Pretix-Signature: super-secret-pretix-key" \
  -d '{
    "notification_id": 12345,
    "event": "digital-india-hackathon-2026",
    "action": "checkin.created",
    "team_id": "team_alpha_01",
    "team_name": "Neural Nomads",
    "college": "IIT Bombay",
    "track": "AI / Deep Learning Track",
    "table_number": "Table 42",
    "timestamp": "2026-07-06T14:30:00Z"
  }'
```

> **What Happens Next**:
> 1. The server receives the check-in and responds with `{"status":"queued","delaySeconds":18}`.
> 2. The team ID is added to the Redis sorted set `welcome:queue`.
> 3. **Exactly 18 seconds later** (allowing the team time to walk into the hall), the massive stage LED wall triggers the celebratory welcome card with sound effects!

---

## 💻 2. GitLab Repository Activity Webhook

To keep the Hall of Builders feed dynamic during coding hours, teams configure a webhook in their GitLab project repositories to broadcast commits, pushes, and tag releases to the big screen.

### Endpoint Configuration in GitLab
1. In your GitLab repository, go to **Settings > Webhooks**.
2. **URL**: `http://<your-server-ip>:3001/api/webhooks/gitlab`
3. **Secret Token**: `super-secret-gitlab-key` (Must match `GITLAB_WEBHOOK_SECRET` in `.env`).
4. **Trigger Checkboxes**: Select **Push events**, **Tag push events**, and **Merge request events**.

### Local Simulation with `curl`
To test how commit messages render on the public Discord-style stage feed, run:

```bash
curl -X POST http://localhost:3001/api/webhooks/gitlab \
  -H "Content-Type: application/json" \
  -H "X-Gitlab-Token: super-secret-gitlab-key" \
  -H "X-Gitlab-Event: Push Hook" \
  -d '{
    "object_kind": "push",
    "event_name": "push",
    "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
    "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
    "ref": "refs/heads/main",
    "user_name": "Prem Sai",
    "project": {
      "name": "Project Leaderboard AI",
      "web_url": "https://gitlab.com/digital-india/leaderboard-ai"
    },
    "commits": [
      {
        "id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
        "message": "feat: implement real-time Redis queue for check-in welcomes 🚀",
        "author": {
          "name": "Prem Sai"
        }
      },
      {
        "id": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
        "message": "style: add glassmorphism and custom scrollbars to stage UI ✨",
        "author": {
          "name": "Prem Sai"
        }
      }
    ],
    "total_commits_count": 2
  }'
```

> **What Happens Next**:
> 1. The Fastify webhook parser validates `X-Gitlab-Token`.
> 2. The commit messages are formatted into a clean Discord bot message:
>    *"🚀 **Prem Sai** pushed 2 commits to `Project Leaderboard AI` (main):"*
>    *"• feat: implement real-time Redis queue for check-in welcomes 🚀"*
>    *"• style: add glassmorphism and custom scrollbars to stage UI ✨"*
> 3. The message is broadcasted over WebSockets (`bot.message` event) and appears instantly on the stage screen's `#coding` channel!
