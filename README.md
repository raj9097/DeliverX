# DeliverX – Shipment Management System

A full-featured MERN stack shipment management system with React frontend and Node.js/Express backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (for deployment)

### Development Setup

1. **Install dependencies:**
```
bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

2. **Start MongoDB:**
```
bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use local MongoDB
mongod
```

3. **Seed the database:**
```
bash
cd backend
npm run seed
```

4. **Start the servers:**
```
bash
# Terminal 1 - Backend (port 5000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 5173)
npm run dev
```

5. **Open browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@deliverx.com | admin123 |
| Manager | manager@deliverx.com | manager123 |
| Clerk | clerk@deliverx.com | clerk123 |
| Driver | driver@deliverx.com | driver123 |
| Delivery Person | delivery@deliverx.com | delivery123 |

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and run all services:**
```
bash
docker-compose up -d
```

2. **Check services:**
```
bash
# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

3. **Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Manual Docker Build

**Frontend:**
```
bash
docker build -f Dockerfile.frontend -t deliverx-frontend .
docker run -p 80:80 deliverx-frontend
```

**Backend:**
```
bash
docker build -f Dockerfile.backend -t deliverx-backend .
docker run -p 5000:5000 -e MONGO_URI=mongodb://host.docker.internal:27017/DeliverX deliverx-backend
```

## 📁 Project Structure

```
deliverx/
├── backend/
│   ├── models/          # MongoDB models (Shipment, Driver, User, Notification)
│   ├── middleware/      # Auth, error handling
│   ├── scripts/         # Database seeding
│   ├── server.js        # Express server with all API routes
│   └── package.json
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── AppShell.jsx
│   │       ├── Sidebar.jsx
│   │       ├── Topbar.jsx
│   │       ├── ShipmentsTable.jsx
│   │       └── StatsCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── auth/Login.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UsersManagement.jsx
│   │   │   ├── Fleet.jsx
│   │   │   └── Analytics.jsx
│   │   ├── manager/
│   │   ├── clerk/
│   │   ├── driver/
│   │   └── delivery/
│   └── utils/
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
├── nginx.conf
└── package.json
```

## 🔧 Environment Variables

Create `backend/.env` file:

```
env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/DeliverX
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/DeliverX

# Server
PORT=5000
NODE_ENV=development

# JWT (for production)
JWT_SECRET=your-secret-key
```

## ✨ Features by Role

### Admin
- Full analytics dashboard with Recharts
- Shipment management (CRUD)
- User management (CRUD)
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

### Delivery Person
- Today's parcel list
- Proof of Delivery (POD)
- Delivery confirmation / failure reporting

## 🛠 Tech Stack

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Recharts
- Lucide React
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs (password hashing)
- JWT (authentication)

## 📝 API Endpoints

### Shipments
- `GET /api/shipments` - List all shipments
- `POST /api/shipments` - Create shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Users
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/auth/login` - User login

### Drivers
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Stats
- `GET /api/stats/monthly` - Monthly shipment stats
- `GET /api/stats/revenue` - Revenue data
- `GET /api/stats/status-distribution` - Status pie chart data
- `GET /api/stats/summary` - Summary metrics

### Other
- `GET /api/notifications` - List notifications
- `GET /api/health` - Health check

## 🚢 Production Deployment

For production, consider:

1. **Use MongoDB Atlas** for cloud database
2. **Set proper JWT_SECRET** in environment
3. **Enable HTTPS** with SSL certificates
4. **Configure CORS** properly for production domain
5. **Set up monitoring** (e.g., PM2, logs)

Example production environment:
```
env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/DeliverX
PORT=5000
NODE_ENV=production
JWT_SECRET=complex-random-string
```

## 📄 License

MIT License
