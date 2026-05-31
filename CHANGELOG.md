# Changelog

## [1.1.0] - 2026-05-31

### Added
- i18n support with English and Vietnamese translations
- Language switcher (🇺🇸 / 🇻🇳) on login page and sidebar
- Dark/Light/System theme switcher
- Demo user picker on login page (Admin, Manager, Staff)
- Mock API layer for Vercel deployment (no backend required)
- Create Import operation page with SKU search and line items
- Create Export operation page with stock availability display
- Favicon matching the WMS branding
- Vercel deployment configuration

### Fixed
- API client handles empty JSON responses gracefully
- Vite proxy configuration for correct port forwarding
- Input text visibility in dark mode

## [1.0.0] - 2026-05-31

### Added
- Full-stack Warehouse Management System
- Backend: Express.js + Prisma + PostgreSQL + Redis + BullMQ
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- Authentication with JWT (15min access / 7d refresh tokens)
- Role-based access control (Admin, Manager, Staff, Viewer)
- Catalog item CRUD with unique name+category constraint
- SKU management with barcode validation (EAN-13, UPC-A, Code 128)
- Import/Export operations with approval workflow (Draft → Review → Approve/Reject)
- Atomic inventory updates via database transactions
- Inventory tracking with low-stock alerts
- Periodic reporting (daily, weekly, monthly, quarterly, yearly)
- Analytics: moving averages, top products, turnover rates, trend lines
- Predictive sales forecasting with reorder alerts
- Audit logging (append-only, immutable)
- Docker Compose for local development (PostgreSQL 16 + Redis 7)
