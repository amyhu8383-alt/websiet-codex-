# Project Status: V1 Global Time Board + Amy B2B Sales Follow-up Assistant MVP

## 1. Project Purpose

This project is Amy's internal B2B sales productivity tool for:

- global time checking
- customer follow-up rhythm management
- pipeline tracking
- boss reporting
- future sales intelligence expansion

The current MVP focuses on helping Amy quickly decide who to contact now, which customers need follow-up today, and which opportunities should be prioritized first.

## 2. Current Routes

Current active routes:

- `/`
- `/global-time-board`
- `/sales-follow-up-assistant`

Current future placeholder modules:

- Customer Prospecting System
- Competitor Intelligence Board
- Market Opportunity Calendar
- Hurricane Season Intelligence
- Xiaoman CRM Import
- Gmail / Outlook Sync
- Google Sheets Import

## 3. Completed Features

### Global Time Board

- Global market time cards
- Shenzhen time reference panel
- Priority market order for Amy's sales workflow
- Ukraine and Kuwait included
- Working status badges
- Compact Contact Window Summary
- Copy Contactable Markets
- Market Calendar Preview
- Static date-range calendar items
- Static future full market calendar note

### Amy B2B Sales Follow-up Assistant

- Amy B2B Sales Follow-up Assistant branding
- Customer add / edit / delete
- Customer detail side panel
- Add follow-up log
- localStorage persistence
- Reset demo data
- Customer Grade A/B/C
- Follow-up Summary
- Follow-up Frequency
- Reminder Status
- Auto Suggest Next Follow-up Date
- Quick views
- Export CSV
- Boss Weekly Report
- Email template generator
- WhatsApp message generator
- Sales forecast fields
- Estimated Pipeline Value
- Need Boss Support
- Main Blocker

### Homepage Cards

- Dashboard homepage
- 2 active tools
- 3 placeholder cards for future modules

### Market Calendar Preview

- Static preview only
- Date-window based planning rows
- Filter by region and priority

### localStorage / Customer Record Management

- Mock data loads when no saved localStorage exists
- Saved localStorage data overrides mock data
- Customer add / edit / delete persists
- Follow-up logs persist
- Grade / summary / next follow-up date persist

## 4. Data Model

Current working data structure is organized inside each follow-up record:

- customerProfile
  - customerName
  - company
  - country
  - city
  - region
  - timeZone
  - email
  - whatsapp
  - linkedin
  - customerType
  - sourceChannel

- businessFields
  - productCategory
  - interestedModel
  - businessModel
  - targetMarket
  - estimatedQuantity
  - plugType
  - certificationRequirement
  - oemOdmRequirement

- salesStatus
  - currentStage
  - replyStatus
  - leadTemperature
  - customerGrade
  - followUpSummary
  - nextAction
  - nextFollowUpDate
  - lastContactDate
  - lastContactTime
  - lastContactMethod
  - followUpContent
  - customerReply

- forecast
  - estimatedOrderValue
  - probability
  - expectedCloseDate
  - paymentStatus
  - riskLevel
  - mainBlocker
  - needBossSupport
  - needTeamSupport
  - forecastNotes

- followUpTimeline
  - history

- emailLogs
  - emailLogs

Current localStorage keys:

- `amy-b2b-sales-follow-up-records-v2`
- legacy fallback: `oukitel-sales-follow-up-records-v1`

## 5. Important Business Logic

### Customer Grade A/B/C logic

- `A - High Priority`
  - high-potential customers
  - quotation / negotiation / payment / strategic distributor / OEM style opportunities

- `B - Medium Priority`
  - interested or warm customers
  - catalog follow-up
  - weekly rhythm customers

- `C - Low Priority`
  - cold or dormant customers
  - long-cycle reactivation customers

### Follow-up frequency logic

- Payment Pending -> every 1 business day
- Negotiation / Quotation Sent / Sample Discussion -> every 2 business days
- Meeting Scheduled -> follow up on meeting date
- Waiting Reply -> every 7 days
- Dormant -> every 30 days
- Otherwise:
  - Grade A -> every 2 business days
  - Grade B -> every 7 days
  - Grade C -> every 30 days

### Reminder Status logic

- No Date Set
- Overdue
- Due Today
- Due Tomorrow
- Due This Week
- Not Due Yet

Computed from `nextFollowUpDate` compared with today's date.

### Priority logic

Priority is still computed from:

- lead temperature
- current stage
- reply status
- probability

This priority works alongside customer grade and reminder status.

### Boss Weekly Report logic

Current report summarizes:

- active records
- A-level customers
- overdue follow-ups
- due today follow-ups
- payment pending customers
- quotation sent customers
- estimated pipeline value
- main blockers
- customers needing boss support
- next weekly priorities

### Market Calendar Preview logic

- static preview only
- no external APIs
- fixed date ranges
- region and priority filters
- designed as a future bridge into a dedicated market opportunity dashboard

## 6. Safety Rules

- Use mock data only
- No real customer data
- No Gmail / Outlook integration yet
- No Xiaoman CRM integration yet
- No external API scraping yet
- No competitor / Reddit / Amazon real-time data yet

## 7. Future Roadmap

Phase 2:
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

Phase 3:
Customer Segment Keyword Map

Phase 4:
Competitor Intelligence Board

Phase 5:
Market Opportunity Calendar

Phase 6:
Hurricane Season Intelligence

Phase 7:
Xiaoman CRM / CSV / Gmail / Google Sheets integrations

## 8. How to Run Locally

Run:

`npm.cmd run dev`

Local preview:

`http://localhost:3000`

## 9. How to Build

Run:

`npm.cmd run build`

## 10. Current Stable Version Name

`v1: global time board and personal sales follow-up assistant MVP`
