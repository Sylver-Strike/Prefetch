# PreFetch — Campus eCommerce Platform

> Zero-wait campus cooperative store. Pre-order textbooks, lab kits, uniforms and pick up in 30 seconds.
>Designed for grading purposes only.Data is handled without encryption, so use dummy/test inputs only.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Frontend](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite%205-61dafb)
![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203.x-6db33f)
![Database](https://img.shields.io/badge/database-Firebase%20Firestore-ffca28)

## Architecture

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite 5 (Mobile-first SPA) |
| **Styling** | Vanilla CSS with design tokens |
| **Backend** | Java 17 / Spring Boot 3.x |
| **Database** | Firebase Cloud Firestore |
| **Auth** | JWT (HS256) + RBAC (Student/Staff/Admin) |
| **Payments** | UPI Deep-links + QR Code Generation |

## Features

- **3-Role RBAC** — Student, Staff, and Admin portals with JWT authentication
- **Real-Time Catalog** — Department-filtered product browsing with live stock badges
- **Atomic Checkout** — `db.runTransaction()` for race-condition-free inventory decrement
- **UPI QR Payments** — Native Google Pay / PhonePe deep-linking
- **Digital Pickup Tokens** — 30-second collection at dispatch counters
- **AI Smart Bundling** — Syllabus-matched item bundles with 15% discount
- **HoloCard Effects** — WebGL holographic card component across key touchpoints

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### Backend
```bash
cd backend
./mvnw spring-boot:run   # → http://localhost:8080
```

> **Note:** The frontend currently runs with demo data and doesn't require the backend to be running.

## Project Structure

```
prefetch/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/  # Reusable UI components (HoloCard, etc.)
│   │   ├── context/     # Auth & Cart state management
│   │   ├── pages/       # LoginPage, StudentStore, StaffDashboard, AdminDashboard
│   │   ├── services/    # Axios API client
│   │   └── index.css    # Design system tokens
│   └── package.json
│
├── backend/           # Spring Boot 3.x REST API
│   ├── src/main/java/com/prefetch/
│   │   ├── config/      # Firebase, Security, CORS
│   │   ├── controller/  # Auth, Catalog, Order endpoints
│   │   ├── model/       # User, InventoryItem, Order
│   │   ├── security/    # JWT provider, auth filter, roles
│   │   └── exception/   # Global error handling
│   └── pom.xml
│
└── design/            # Stitch design reference HTML
```

## Screens

| Screen | Route | Role |
|--------|-------|------|
| Multi-Role Login Portal | `/login` | Public |
| Student Store & UPI Checkout | `/store` | STUDENT |
| Staff Order Fulfillment | `/staff/orders` | STAFF |
| Admin Inventory Management | `/admin` | ADMIN |

## License

MIT
