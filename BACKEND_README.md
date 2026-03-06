# DeliverX Backend - API Documentation

Complete API documentation for the DeliverX shipment management system backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation & Running

```
bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
echo "MONGO_URI=mongodb://localhost:27017/DeliverX" > .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Seed the database (optional)
npm run seed

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

## 📁 Backend File Structure

```
backend/
├── config/
│   ├── constants.js          # HTTP status codes, app constants
│   └── database.js           # MongoDB connection setup
├── controllers/
│   ├── authController.js     # Login, register, logout
│   ├── driverController.js   # Driver CRUD operations
│   ├── notificationController.js
│   ├── shipmentController.js # Shipment CRUD operations
│   ├── statController.js     # Analytics/stats endpoints
│   └── userController.js     # User management
├── middleware/
│   ├── auth.js               # JWT token verification
│   ├── catchAsync.js         # Async error wrapper
│   └── errorHandler.js       # Global error handling
├── models/
│   ├── Driver.js             # Driver schema
│   ├── Notification.js       # Notification schema
│   ├── Shipment.js           # Shipment schema
│   ├── Stat.js               # Statistics schema
│   └── User.js               # User schema (with roles)
├── routes/
│   ├── authRoutes.js         # /api/auth
│   ├── driverRoutes.js       # /api/drivers
│   ├── notificationRoutes.js # /api/notifications
│   ├── shipmentRoutes.js     # /api/shipments
│   ├── statRoutes.js         # /api/stats
│   └── userRoutes.js         # /api/users
├── scripts/
│   └── seed.js               # Database seeding script
├── utils/
│   ├── apiResponse.js        # JSON response helper
│   └── logger.js             # Logging utility
├── .env                      # Environment variables
├── package.json
└── server.js                 # Express app entry point
```

## 🔌 API Base URL

```
http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request:**
```
json
{
  "email": "admin@deliverx.com",
  "password": "admin123"
}
```

**Response:**
```
json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "65abc123...",
      "name": "Alex Rivera",
      "email": "admin@deliverx.com",
      "role": "admin",
      "department": "Operations HQ"
    }
  }
}
```

---

### Users

#### GET /api/users
Get all users (Admin only).

**Response:**
```
json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "name": "Alex Rivera",
      "email": "admin@deliverx.com",
      "role": "admin",
      "department": "Operations HQ",
      "status": "active",
      "createdAt": "2025-02-15T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/users
Create a new user (Admin only).

**Request:**
```
json
{
  "name": "John Doe",
  "email": "john@deliverx.com",
  "password": "password123",
  "role": "clerk",
  "department": "Intake & Processing",
  "status": "active"
}
```

**Response:**
```
json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@deliverx.com",
    "role": "clerk",
    "department": "Intake & Processing",
    "status": "active",
    "createdAt": "2025-02-20T10:00:00.000Z"
  }
}
```

#### PUT /api/users/:id
Update a user (Admin only).

**Request:**
```
json
{
  "name": "John Updated",
  "department": "Operations HQ",
  "status": "inactive"
}
```

#### DELETE /api/users/:id
Delete a user (Admin only).

**Response:**
```
json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Shipments

#### GET /api/shipments
Get all shipments.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "id": "SHP-001",
      "tracking": "DX-7842-KL",
      "origin": "New York, NY",
      "destination": "Los Angeles, CA",
      "status": "transit",
      "weight": "12.4 kg",
      "customer": "Acme Corp",
      "driver": "Taylor Quinn",
      "eta": "2025-02-20",
      "priority": "high",
      "created": "2025-02-15"
    }
  ]
}
```

#### POST /api/shipments
Create a new shipment.

**Request:**
```
json
{
  "tracking": "DX-8000-AB",
  "origin": "San Francisco, CA",
  "destination": "Seattle, WA",
  "weight": "5.0 kg",
  "customer": "Tech Corp",
  "priority": "high"
}
```

**Response:**
```
json
{
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "_id": "65abc123...",
    "id": "SHP-009",
    "tracking": "DX-8000-AB",
    "origin": "San Francisco, CA",
    "destination": "Seattle, WA",
    "status": "pending",
    "weight": "5.0 kg",
    "customer": "Tech Corp",
    "driver": "Unassigned",
    "priority": "high",
    "created": "2025-02-20"
  }
}
```

#### PUT /api/shipments/:id
Update a shipment.

**Request:**
```
json
{
  "status": "transit",
  "driver": "Taylor Quinn",
  "eta": "2025-02-25"
}
```

#### DELETE /api/shipments/:id
Delete a shipment.

**Response:**
```
json
{
  "success": true,
  "message": "Shipment deleted successfully"
}
```

---

### Drivers

#### GET /api/drivers
Get all drivers.

**Response:**
```
json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "name": "Taylor Quinn",
      "vehicle": "Ford Transit – TX-847",
      "status": "on_route",
      "deliveries": 12,
      "rating": 4.8,
      "phone": "+1 555-0101",
      "zone": "Route 7 – North",
      "todayTrips": 3
    }
  ]
}
```

#### POST /api/drivers
Create a new driver.

**Request:**
```
json
{
  "name": "New Driver",
  "vehicle": "Toyota Camry – CA-123",
  "status": "available",
  "phone": "+1 555-0199",
  "zone": "Route 1 – South"
}
```

#### PUT /api/drivers/:id
Update a driver.

**Request:**
```
json
{
  "status": "on_route",
  "deliveries": 13
}
```

#### DELETE /api/drivers/:id
Delete a driver.

---

### Statistics

#### GET /api/stats/monthly
Get monthly shipment statistics.

**Response:**
```
json
{
  "success": true,
  "data": {
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "shipments": [120, 145, 132, 168, 195, 210]
  }
}
```

#### GET /api/stats/revenue
Get revenue data.

**Response:**
```
json
{
  "success": true,
  "data": {
    "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "revenue": [12000, 14500, 13200, 16800, 19500, 21000]
  }
}
```

#### GET /api/stats/status-distribution
Get shipment status distribution.

**Response:**
```
json
{
  "success": true,
  "data": [
    { "name": "Delivered", "value": 45 },
    { "name": "Transit", "value": 30 },
    { "name": "Pending", "value": 15 },
    { "name": "Processing", "value": 8 },
    { "name": "Failed", "value": 2 }
  ]
}
```

#### GET /api/stats/summary
Get summary metrics.

**Response:**
```
json
{
  "success": true,
  "data": {
    "totalShipments": 156,
    "activeDrivers": 4,
    "deliveredToday": 12,
    "pendingShipments": 23,
    "revenue": 45600
  }
}
```

---

### Notifications

#### GET /api/notifications
Get all notifications.

**Response:**
```
json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "type": "alert",
      "message": "SHP-005 delivery failed – customer not available",
      "time": "2m ago"
    },
    {
      "_id": "65abc124...",
      "type": "success",
      "message": "SHP-002 successfully delivered to TechFlow Inc",
      "time": "18m ago"
    }
  ]
}
```

---

### Health Check

#### GET /api/health
Check server and database status.

**Response:**
```
json
{
  "status": "ok",
  "database": "connected",
  "environment": "development",
  "timestamp": "2025-02-20T10:00:00.000Z"
}
```

---

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### User Roles
- `admin` - Full access
- `manager` - Regional access
- `clerk` - Shipment registration
- `driver` - Route & status updates
- `delivery` - Delivery confirmation

## 🧪 Testing with cURL

```
bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@deliverx.com","password":"admin123"}'

# Get all users (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer TOKEN"

# Create shipment (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"tracking":"DX-9000-TEST","origin":"Test City","destination":"Test City 2","weight":"1.0 kg","customer":"Test Corp"}'
```

## 📝 Environment Variables

Create `backend/.env` file:

```
env
MONGO_URI=mongodb://localhost:27017/DeliverX
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

## 🔧 Scripts

```
bash
npm run dev      # Start development server (with nodemon)
npm run start    # Start production server
npm run seed     # Seed database with sample data
npm run test:db  # Test database connection
```

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- bcryptjs (password hashing)
- JWT (authentication)
- cors
- dotenv
