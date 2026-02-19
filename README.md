# DeliverX – Shipment Management System

A full-featured React frontend for managing shipments across multiple roles.

## 🚀 Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@deliverx.com | admin123 |
| Manager | manager@deliverx.com | manager123 |
| Clerk | clerk@deliverx.com | clerk123 |
| Driver | driver@deliverx.com | driver123 |
| Delivery Person | delivery@deliverx.com | delivery123 |

## 🗂 Project Structure

```
src/
├── components/
│   └── common/
│       ├── AppShell.jsx        # Main layout (sidebar + topbar)
│       ├── Sidebar.jsx         # Role-based navigation
│       ├── Topbar.jsx          # Header with search & notifications
│       ├── ShipmentsTable.jsx  # Reusable shipments data table
│       └── StatsCard.jsx       # Metric card component
├── context/
│   └── AuthContext.jsx         # Auth + role management
├── pages/
│   ├── auth/
│   │   └── Login.jsx           # Login page with demo accounts
│   ├── admin/
│   │   ├── AdminDashboard.jsx  # Charts, driver status, activity
│   │   ├── UsersManagement.jsx # CRUD for all users
│   │   ├── Fleet.jsx           # Driver cards with status
│   │   └── Analytics.jsx       # Full analytics with charts
│   ├── manager/
│   │   └── ManagerDashboard.jsx
│   ├── clerk/
│   │   └── ClerkDashboard.jsx  # Register + process shipments
│   ├── driver/
│   │   └── DriverDashboard.jsx # Route view + status updates
│   └── delivery/
│       └── DeliveryDashboard.jsx # Parcels + proof of delivery
├── utils/
│   └── mockData.js             # All mock data
├── App.jsx
├── index.js
└── index.css                   # Global styles + utility classes
```

## ✨ Features by Role

### Admin
- Full analytics dashboard with Recharts
- Shipment management (CRUD)
- User management
- Fleet & driver oversight
- Revenue & delivery analytics

### Manager  
- Regional shipment overview
- Fleet visibility
- Staff management
- Reports

### Clerk
- Register new shipments
- Processing queue management
- Shipment tracking

### Driver
- Daily route & assigned shipments
- Real-time status updates
- Navigation shortcuts
- Trip logging

### Delivery Person
- Today's parcel list
- Proof of Delivery (POD) with signature capture
- Delivery confirmation / failure reporting

## 🛠 Tech Stack

- **React 18** – UI framework
- **React Router v6** – routing
- **Tailwind CSS** – utility styling
- **Recharts** – data visualization
- **Lucide React** – icons
- **Google Fonts** – Bebas Neue, Barlow Condensed, DM Sans
