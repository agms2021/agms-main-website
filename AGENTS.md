# AGMS Main Website — AI Agent & Developer Operating Protocol (AGENTS.md)

This repository follows the **OpenHands / Memory Bank Protocol**. Any AI agent (Cursor, VS Code Cline/Roo-Code, Antigravity, OpenHands, Windsurf, Aider) or human developer MUST follow these rules before reading, writing, or committing code.

---

## 🧠 1. Memory Bank Mandatory Routine

Before starting ANY task:
1. **Read `.memory-bank/activeContext.md`** — Understand what work is currently active on the citizen website.
2. **Read `.memory-bank/progress.md`** — Review completed features and pending roadmap.
3. **Read `.memory-bank/MEMORY.md`** — Check architectural guidelines, bilingual requirements, and cloud configuration.

After completing ANY task:
1. **Update `.memory-bank/progress.md`** and **`.memory-bank/activeContext.md`**.
2. **Run Zero-Error Check**: `npm run build` (`tsc -b && vite build`) must succeed with 0 errors.

---

## 🛡️ 2. Architectural Rules for Citizen Portal

1. **Live Cloud Configuration Priority**:
   - The website loads its live announcement, branding, and contact configuration from:
     1. CRM API: `https://crm.agmultiservices.online/api/portal/config?accountId=...`
     2. Fallback Storage CDN: `https://kpvjenicwrzuzrxvucmf.supabase.co/storage/v1/object/public/portal-config/tenant-config.json`
     3. Local static fallback: `/tenant.config.json`
   - NEVER overwrite live dynamic announcements with hardcoded strings on language change.
2. **Bilingual Support (मराठी & English)**:
   - All citizen UI elements must support Marathi (`mr`) as primary language and English (`en`) as secondary.
3. **Telemetry Integration**:
   - Runtime errors and unhandled promise rejections are automatically sent to CRM telemetry hub via `reportWebsiteError()` with Sentry-style breadcrumbs.
