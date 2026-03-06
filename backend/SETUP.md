# 🚀 DeliverX Backend - Setup & MongoDB Atlas Configuration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB Atlas
The backend is configured to use MongoDB Atlas. Follow these steps:

#### **Step 1: Get Your MongoDB Atlas Connection String**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Log in to your account
3. Click on "Clusters" in the left sidebar
4. Click "Connect" on your cluster
5. Choose "Connect Your Application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)
7. Replace `username`, `password` with your credentials

#### **Step 2: Fix IP Whitelist Error**
If you see: `Could not connect to any servers in your MongoDB Atlas cluster ... IP that isn't whitelisted`

**Solution:**
1. Go to [MongoDB Atlas Security/IP Whitelist](https://cloud.mongodb.com/v2)
2. Click your project → "Security" → "Network Access"
3. Click "Add IP Address"
4. Choose one of these options:
   - Option A: Add your current IP address (get it from https://www.whatismyipaddress.com/)
   - Option B: **Allow access from anywhere** (0.0.0.0/0) - Only for development!
5. Click "Confirm"
6. Wait 1-2 minutes for the whitelist to update

#### **Step 3: Update .env File**
Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/DeliverX
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

### 3. Start the Backend Server
```bash
npm run dev
```

### 4. Verify Connection
- Open http://localhost:5000/api/health
- You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "development",
  "timestamp": "2026-03-06T..."
}
```

---

## Backend Folder Structure

```
backend/
├── config/
│   ├── database.js        # MongoDB connection logic
│   └── constants.js       # App-wide constants
├── controllers/           # Business logic for routes
├── middleware/            # Auth, error handling, validation
├── models/                # MongoDB Mongoose schemas
├── routes/                # API endpoint definitions
├── scripts/               # Database seeding scripts
├── utils/
│   ├── logger.js          # Centralized logging
│   └── apiResponse.js     # Standard API response format
├── .env                   # Environment variables (don't commit)
├── .env.example           # Example .env template
├── server.js              # Express app entry point
└── package.json
```

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/DeliverX` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment type | `development` or `production` |
| `JWT_SECRET` | JWT signing key | `your-secret-key` (change in production!) |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

---

## Troubleshooting MongoDB Atlas Connection

### Error: "Could not connect to any servers"
**Causes:**
1. ❌ IP address not whitelisted
2. ❌ Wrong username/password in connection string
3. ❌ MongoDB Atlas cluster is paused/not running
4. ❌ Database user doesn't have proper permissions

**Solutions:**
```bash
# Check if .env file has MONGO_URI
cat .env

# Try connecting with mongo shell (install if needed)
mongosh "mongodb+srv://username:password@cluster.mongodb.net/DeliverX"

# If mongosh is not installed, use mongo instead
mongo "mongodb+srv://username:password@cluster.mongodb.net/DeliverX"
```

### Error: "EADDRINUSE: address already in use :::5000"
**Solution - Kill the process using port 5000:**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

---

## API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "development",
  "timestamp": "2026-03-06T10:00:00.000Z"
}
```

### Shipments
```
GET    /api/shipments          - List all shipments
POST   /api/shipments          - Create shipment
PUT    /api/shipments/:id      - Update shipment
DELETE /api/shipments/:id      - Delete shipment
```

### Users
```
GET    /api/users              - List all users
POST   /api/users              - Create user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
POST   /api/auth/login         - User login
```

### Drivers
```
GET    /api/drivers            - List all drivers
POST   /api/drivers            - Create driver
PUT    /api/drivers/:id        - Update driver
DELETE /api/drivers/:id        - Delete driver
```

### Stats
```
GET    /api/stats/monthly      - Monthly shipment stats
GET    /api/stats/revenue      - Revenue data
GET    /api/stats/status-distribution - Status pie chart
GET    /api/stats/summary      - Summary metrics
```

---

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Seed database with test data
npm run seed
```

---

## Database Seeding

To populate the database with test data:

```bash
npm run seed
```

This creates:
- Admin user: admin@deliverx.com / admin123
- Manager user: manager@deliverx.com / manager123
- Clerk user: clerk@deliverx.com / clerk123
- Driver user: driver@deliverx.com / driver123
- Delivery Person: delivery@deliverx.com / delivery123
- Sample shipments and drivers

---

## Production Deployment

1. **Use MongoDB Atlas** (recommended over local MongoDB)
2. **Set strong JWT_SECRET** - Don't use default!
3. **Set NODE_ENV=production**
4. **Use environment-specific .env** file
5. **Enable HTTPS** for production
6. **Configure CORS** for your production domain

Example production `.env`:
```env
MONGO_URI=mongodb+srv://produser:securepass@prod-cluster.mongodb.net/DeliverX
PORT=5000
NODE_ENV=production
JWT_SECRET=generate-a-random-secure-key-here
CORS_ORIGIN=https://yourdomain.com
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `EADDRINUSE: address already in use :::5000` | Kill the process: `taskkill /PID <PID> /F` |
| MongoDB IP whitelist error | Add your IP to MongoDB Atlas IP whitelist |
| Cannot find module errors | Run `npm install` |
| Wrong credentials | Double-check username/password in MONGO_URI |
| Network timeout | Check internet connection and firewall |

---

## Logging & Debugging

### Built-in Logger Utility

```javascript
// In any controller or route file:
const logger = require('../utils/logger');

logger.info('Information message');
logger.success('Operation successful');
logger.warn('Warning message');
logger.error('Error occurred', errorObject);
logger.debug('Debug info'); // Only shows in development
```

### Checking Logs

```bash
# Check if there are any log files
dir *.log

# View recent error logs
tail -f server.err
```

---

## Next Steps

1. ✅ Fix MongoDB Atlas IP whitelist
2. ✅ Update .env with your credentials
3. ✅ Run `npm install`
4. ✅ Run `npm run seed` (optional, for test data)
5. ✅ Run `npm run dev`
6. ✅ Verify health check at http://localhost:5000/api/health
7. ✅ Start frontend: `npm run dev` (from project root)

---

For more help, check the main README.md in the project root.
