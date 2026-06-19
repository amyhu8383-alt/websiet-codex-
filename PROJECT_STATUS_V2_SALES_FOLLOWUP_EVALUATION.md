# Project Status: V2 Amy B2B Sales Tools

## 1. Project Purpose

This project is Amy's internal B2B sales productivity system for:

- global time checking
- market calendar preview
- customer follow-up rhythm management
- customer value evaluation
- customer qualification
- sales forecast
- boss reporting
- future customer prospecting
- future competitor intelligence
- future market opportunity calendar

The current stable version focuses on helping Amy decide who to contact now, how often to follow up, which customers are strategically valuable, what risks need boss attention, and what key qualification information is still missing.

## 2. Current Routes

Current routes:

- `/`
- `/global-time-board`
- `/sales-follow-up-assistant`

Future placeholder routes or future modules:

- `/customer-prospecting-system`
- `/competitor-intelligence-board`
- `/market-opportunity-calendar`
- `/hurricane-season-intelligence`
- Xiaoman CRM import
- Gmail / Outlook sync
- Google Sheets import

## 3. Homepage

The homepage currently contains tool cards for:

- Global Time Board
- Personal Sales Follow-up Assistant
- Customer Prospecting System
- Competitor Intelligence Board
- Market Opportunity Calendar

## 4. Global Time Board

Current features:

- Shenzhen base time
- global market local time cards
- market order by Amy's sales priority
- Europe priority markets
- Middle East priority markets
- USA and Caribbean markets
- Ukraine and Kuwait included
- working status badges
- compact contact window summary
- static Market Calendar Preview
- date-range based opportunity windows

Clarification:

- Market Calendar Preview is static for now.
- Future full market calendar should be built as a separate dashboard.

## 5. Amy B2B Sales Follow-up Assistant

Current features:

- Customer Pipeline Summary
- Customer Master List
- simple main filters:
  - Search customer / company
  - View
  - Region
  - Current Stage
  - Show All Customers
- Advanced Filters collapsed by default
- Quick Views
- customer row actions:
  - View
  - Edit
  - Add Log
  - Delete
- customer detail side panel
- Add New Customer
- Edit Customer
- Delete Customer
- Add Follow-up Log
- Manual Email Log
- Export CSV
- Copy Today's Follow-up Plan
- Copy Boss Weekly Report
- Email template generator
- WhatsApp message generator
- localStorage persistence

## 6. Key Customer Logic

### Follow-up Rhythm

Purpose:
How often Amy should follow up with the customer.

Options:

- Daily
- Every 2-3 Days
- Weekly
- Bi-weekly
- Monthly
- Quarterly

### Lead Temperature

Purpose:
Current buying interest and deal urgency.

Options:

- Hot
- Warm
- Cold
- Unknown

### Customer Value Tier

Purpose:
Long-term commercial and strategic customer value.

Options:

- A
- B
- C
- D

Important:
Follow-up Rhythm, Lead Temperature and Customer Value Tier are different fields and should not be mixed.

## 7. Customer Evaluation Panel

Current Customer Evaluation Panel fields:

- Customer Value Tier
- Annual Potential
- Company Value
- Channel Strength
- Last Year Sales Revenue
- Annual Sales Volume
- Main Sales Channels
- Purchase Plan 6-12 Months
- First Order Estimate
- Decision Maker Confirmed
- Current Competitor Sales
- OEM Reason
- Why We Can Win
- Why We May Lose
- Payment Risk
- Risk Control Plan
- Boss Decision Needed
- Boss Decision Notes
- Next Milestone
- Milestone Due Date
- Strategic Customer
- Seasonal Demand Driver
- Missing Key Questions

This panel helps Amy judge whether a customer is worth long-term follow-up, whether boss approval is needed, what risks exist, and what key questions are still missing.

## 8. Missing Key Questions Logic

The system checks missing or unknown key qualification fields, including:

- Last Year Sales Revenue
- Annual Sales Volume
- Main Sales Channels
- Purchase Plan 6-12 Months
- First Order Estimate
- Decision Maker Confirmed
- Current Competitor Sales
- Payment Risk
- Next Milestone

## 9. Boss Weekly Report Logic

Boss Weekly Report includes:

- strategic customers
- A-tier value customers
- customers needing boss decision
- high payment risk customers
- customers with missing key questions
- OEM potential customers
- high annual potential customers
- next milestones
- estimated pipeline value
- main opportunities
- main risks

## 10. localStorage

- mock data loads only if no localStorage data exists
- edited customers persist after refresh
- new customers persist after refresh
- deleted customers stay deleted after refresh
- follow-up logs persist after refresh
- evaluation fields persist after refresh
- reminder status and missing questions can be recomputed after load

Current localStorage keys:

- `amy-b2b-sales-follow-up-records-v2`
- legacy fallback: `oukitel-sales-follow-up-records-v1`

## 11. Safety Rules

- use mock data only unless Amy manually enters real customer data
- no real Gmail / Outlook sync yet
- no Xiaoman CRM integration yet
- no Google Sheets integration yet
- no external API scraping yet
- no Reddit / Amazon / competitor price scraping yet
- no real-time hurricane data yet

## 12. Future Roadmap

Phase 3:
Customer Prospecting System

Customer groups:

- Competitor agents / dealers
- Installers
- Diesel generator customers
- Retail chain / OEM customers
- Balcony energy storage competitor dealers
- Inverter + battery pack channels
- E-commerce sellers
- Emergency backup customers

Phase 4:
Customer Segment Keyword Map

Phase 5:
Competitor Intelligence Board

Phase 6:
Market Opportunity Calendar

Phase 7:
Hurricane Season Intelligence

Phase 8:
Order & Reorder History

Future Order & Reorder History should include:

- order date
- order type
- product model
- quantity
- order value
- payment status
- shipment status
- reorder prediction
- annual customer summary
- estimated next reorder date

Phase 9:
Xiaoman CRM / CSV / Excel / Gmail / Google Sheets integrations

## 13. How to Run Locally

`npm.cmd run dev`

Local preview:

`http://localhost:3000`

## 14. How to Build

`npm.cmd run build`

## 15. Current Stable Version Name

`v2: Amy B2B sales follow-up evaluation MVP`
