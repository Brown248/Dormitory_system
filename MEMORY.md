# Project Memory - Sovereign Dormitory System

## Project Context
A unified accounting and management system for Dormitory, Garage, and Rental Houses. The system features a FastAPI backend, a Next.js frontend, and LINE OA integration for tenants/customers to check balances and receive automated notifications.

## Stack & Architecture
- **Backend:** FastAPI, SQLAlchemy ORM, Uvicorn, Pydantic, Line Bot SDK (v3)
- **Frontend:** Next.js
- **Database:** PostgreSQL (configured via Docker Compose)
- **Local Dev Standard:** Support Postgres with fallback option to SQLite for seamless local/offline development.

## Project State
- **Backend Dependencies:** Installed `line-bot-sdk-3.23.0` and other packages in `requirements.txt`.
- **__init__.py Fix:** Overwritten the initial UTF-16LE `__init__.py` with a clean UTF-8 comment file to resolve python tokenizer null byte syntax errors.
- **Absolute Imports Migration:** Refactored backend relative imports to absolute imports (`main.py`, `models.py`, `schemas.py`) so Uvicorn can run seamlessly directly inside the `backend/` directory using `uvicorn main:app --reload`.
- **Local Dev Standard:** Completed the implementation of a robust PostgreSQL -> SQLite fallback in `database.py`. The local DB file `dormitory.db` is successfully initialized with all models.
- **Phase 1 Backend MVP:** Completed 100% of Phase 1 requirements:
  - Added new `Transaction` model and endpoint routes (`/transactions/`, `/transactions/summary`) to retrieve overall and per-business-unit financial dashboards.
  - Implemented automatic database seeding on application startup for the 5 target Business Units: `หอพัก`, `อู่ซ่อมรถ`, `บ้านเช่า หลังที่ 1`, `บ้านเช่า หลังที่ 2`, `บ้านเช่า หลังที่ 3`.
  - Upgraded the LINE Webhook parser to parse on-the-go owner logs (`รับ [amount] [description]` and `จ่าย [amount] [description]`) and automatically map them to corresponding business units using high-quality regex and Thai text-matching heuristics.
  - Added fast owner commands: `สรุปวันนี้` (daily overview) and `ยอดเงิน` (business unit balance breakdown) that return polished, easy-to-read text messages.
- **Multi-Dormitory Frontend Module:** Designed and integrated a gorgeous, light-themed Multi-Dormitory Selector Module covering all target assets:
  - **หอ 26/20:** 26 rooms spanning 5 floors (exactly matching user specifications, rates, and 303 room pricing).
  - **หอ 26/577:** 30 rooms spanning 3 floors (flat 2,500 THB rate, with room 104 correctly adjusted to 2,000 THB). Removed the duplicate Room 302 as requested by the user, bringing the total rooms count to exactly 30 (10 rooms per floor).
  - **หอ 73/17:** 14 rooms dynamically grouped by Building A (ตึก A) and Building B (ตึก B) wings with 3,500 THB rate.
  - **Utility Billing:** Integrated meter invoice generator (Water @ 18 ฿/unit, Electricity @ 8 ฿/unit) with real-time success alert feedbacks.
- **Garage & House Modules:** Successfully implemented `src/app/garage/page.tsx` and `src/app/house/page.tsx` featuring KPI cards, interactive management tables/cards, and full backend API synchronization, replacing the previous local mock state.
- **Database Synchronization Phase:** Complete! All modules (Dormitory, Garage, and Rental Houses) now sync directly to the SQLite backend (`dormitory.db`), ensuring automatic ledger updates on paid transactions, unified pricing logic, and persistent state management.
- **Current Blockers:** None. Local frontend and backend run perfectly.

## Active TODOs
1. Test LINE Webhook endpoint (`/webhook`) with local tunneling (e.g. ngrok).
2. Expand the "Settings" page to include theme customization and more business parameters.
3. Implement a "Transaction History" page to view and filter all past transactions across all business units.
