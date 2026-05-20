# Sovereign Accounting & Management System

Unified accounting system for Dormitory, Garage, and Rental Houses.

## Project Structure
- `/backend`: FastAPI application.
- `/frontend`: Next.js web dashboard.
- `docker-compose.yml`: Database configuration.

## How to Run

### 1. Database
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
# Set environment variables in .env
uvicorn main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features (Phase 1)
- **Income/Expense Tracking:** Manage invoices for different business units.
- **Customer Management:** Link tenants/customers to LINE OA.
- **LINE OA Integration:** 
  - Send "เช็คยอด" to view outstanding balances.
  - Automatic notifications (Webhook setup required).
