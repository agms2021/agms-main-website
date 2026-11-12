# AGMS Main Website — Knowledge Base & Rules (MEMORY.md)

## Critical Architecture Principles
1. **Cloud Sync for Dynamic Announcements**:
   - Ticker notices are fetched dynamically from Supabase Storage CDN (`portal-config/tenant-config.json`) or CRM API.
   - When user switches language between Marathi and English, use `announcement.text` for Marathi and `announcement.textEn` for English. Do not reset to static default strings.
2. **Sentry-Style Breadcrumb Tracking**:
   - `src/services/telemetry.ts` records the last 15 user actions (page navigation, clicks, API requests).
   - In case of uncaught exceptions or network errors, breadcrumbs and release version are transmitted silently to `https://crm.agmultiservices.online/api/telemetry/errors`.
3. **Bhashini AI / Citizen Assistance**:
   - Aaple Sarkar services directory displays all services with direct WhatsApp inquiry links pre-filled with service title and customer phone number.
