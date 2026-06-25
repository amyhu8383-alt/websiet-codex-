# OUKITEL Global B2B Website

Next.js website and Sanity schema for global distributor, wholesale and OEM/ODM lead generation.

## Start

1. Copy `.env.example` to `.env.local` and add mail, analytics, Turnstile and Sanity credentials.
2. Run `npm install`.
3. Run `npm run dev`.

Without SMTP credentials the inquiry endpoint runs in development mode and logs the lead server-side. Before production, configure SMTP, Turnstile verification and a protected CRM/database destination.

Product specifications are seeded from the April 2026 EU catalog. Any `TBC` fields and certification claims require product-owner approval before publication.
