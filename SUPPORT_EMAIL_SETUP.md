# ToolMarket365 support inbox

Support and contact form messages go to:

**apputilitybuilder@gmail.com**

(Same inbox as CreatorFlow365 and ReadAI.)

## How it works

1. Users submit the form on `/contact` (or `/contact?type=feedback`).
2. The app posts to `/api/contact`.
3. The server emails **apputilitybuilder@gmail.com** (or `SUPPORT_TO_EMAIL` if set).

## Server env (Vercel)

Set these so the form can send mail:

- `EMAIL_USER` — Gmail address used to send
- `EMAIL_PASS` — Gmail app password
- Optional: `SUPPORT_TO_EMAIL` — defaults to `apputilitybuilder@gmail.com`

## Verify

1. Open https://www.toolmarket365.com/contact
2. Send a short test message
3. Confirm it arrives at apputilitybuilder@gmail.com
