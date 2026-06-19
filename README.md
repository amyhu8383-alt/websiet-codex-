# International Sales Productivity Dashboard

Internal Next.js tools for global market time and personal B2B sales follow-up. The first version uses mock data and browser `localStorage` only.

## Routes

- `/` - tool entrance dashboard
- `/global-time-board` - global local time and contact-window tool
- `/sales-follow-up-assistant` - personal follow-up workspace

## Local preview

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Vercel can deploy the project with the detected Next.js settings and no environment variables.

## Editing data and rules

- Market and timezone list: `lib/data.ts` (`markets`)
- Mock follow-up records: `lib/data.ts` (`initialFollowUps`)
- Contact-window rules: `lib/time.ts`
- Priority, AI-style suggestions and templates: `lib/follow-up.ts`

New follow-up records, evaluation fields, and manual email logs use the versioned browser key `amy-b2b-sales-follow-up-records-v2`, with legacy fallback support for `oukitel-sales-follow-up-records-v1`.

## Future integrations

The data model is ready for CSV/Excel import, Google Sheets, Gmail/Outlook sync, Calendar reminders, WhatsApp links and a CRM database. Xiaoman CRM should be handled through an authorized export file: clean and preview fields before import, avoid scraping, and never request or store Xiaoman credentials.
