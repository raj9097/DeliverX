# DeliverX Frontend - Setup & Documentation

Complete frontend documentation for the DeliverX shipment management system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```
bash
# Navigate to project root
cd deliverx

# Install frontend dependencies
npm install
```

### Running the Application

```
bash
# Start development server
npm run dev

# Frontend runs on http://localhost:5173
```

### Build for Production

```
bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Frontend File Structure

```
src/
├── assets/
│   └── react.svg              # React logo
├── components/
│   └── common/
│       ├── AppShell.jsx        # Main app layout wrapper
│       ├── Sidebar.jsx        # Navigation sidebar
│       ├── Topbar.jsx         # Top navigation bar
│       ├── ShipmentsTable.jsx # Shipment data table
│       └── StatsCard.jsx      # Statistics card component
├── context/
│   └── AuthContext.jsx        # Authentication context & provider
├── pages/
│   ├── auth/
│   │   └── Login.jsx          # Login page
│   ├── admin/
│   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   ├── UsersManagement.jsx # User management
│   │   ├── Fleet.jsx          # Fleet management
│   │   └── Analytics.jsx     # Analytics dashboard
│   ├── manager/
│   │   └── ManagerDashboard.jsx
│   ├── clerk/
│   │   └── ClerkDashboard.jsx
│   ├── driver/
│   │   └── DriverDashboard.jsx
│   └── delivery/
│       └── DeliveryDashboard.jsx
├── utils/
│   └── mockData.js            # Mock data for development
├── App.css                    # Global styles
├── App.jsx                    # Main App component
├── index.css                  # Tailwind CSS imports
├── index.js                   # Entry point
└── main.jsx                   # React DOM render
```

### Public Directory

```
public/
├── index.html                 # HTML template
└── vite.svg                   # Vite logo
```

## 🛠 Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library
- **Lucide React** - Icon library
- **Vite** - Build tool
- **React Hot Toast** - Toast notifications

## 🎨 Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint configuration
- `index.html` - HTML entry point

## 🔐 Authentication

The frontend uses React Context for authentication management.

### AuthContext Usage

```
jsx
import { useAuth } from './context/AuthContext';

// In your component
const { user, login, logout, isAuthenticated } = useAuth();
```

### Auth Context Methods

- `login(email, password)` - Authenticate user
- `logout()` - Clear session
- `user` - Current logged-in user object
- `isAuthenticated` - Boolean for login status

## 🎯 Role-Based Access

The app shows different dashboards based on user role:

| Role | Dashboard | Features |
|------|-----------|----------|
| admin | AdminDashboard | Full access |
| manager | ManagerDashboard | Regional overview |
| clerk | ClerkDashboard | Shipment registration |
| driver | DriverDashboard | Route management |
| delivery | DeliveryDashboard | Delivery confirmation |

## 🔗 API Integration

All API calls are made to the backend at `http://localhost:5000/api`.

### Example API Call

```
javascript
const response = await fetch('http://localhost:5000/api/shipments', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📦 Available Scripts

```
bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🐳 Docker Deployment

### Build Frontend Image

```
bash
docker build -f Dockerfile.frontend -t deliverx-frontend .
```

### Run Frontend Container

```
bash
# Run on port 80
docker run -p 80:80 deliverx-frontend

# Or use docker-compose
docker-compose up -d
```

## 🎨 Styling

The project uses Tailwind CSS for styling. Key classes:

- **Layout**: `flex`, `grid`, `container`
- **Spacing**: `p-4`, `m-2`, `gap-4`
- **Colors**: `bg-blue-500`, `text-gray-700`
- **Responsive**: `md:flex`, `lg:grid`

## 🔧 Environment Variables

Create a `.env` file in the root directory (optional for development):

```
VITE_API_URL=http://localhost:5000/api
```

## 🧩 Components

### AppShell
Main layout wrapper containing Sidebar and Topbar.

### Sidebar
Navigation menu with links based on user role.

### Topbar
Header with user info, notifications, and logout button.

### ShipmentsTable
Data table with sorting, filtering, and pagination for shipments.

### StatsCard
Reusable card component for displaying statistics with icons.

## 📱 Responsive Design

The application is fully responsive and works on:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## 🚀 Production Build

```
bash
# Build the application
npm run build

# The build output will be in the /dist directory
```

## 🔍 Troubleshooting

### Port Already in Use
```
bash
# Find and kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5173
kill -9 <PID>
```

### Module Not Found
```
bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Errors
```
bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

## 📄 License

MIT License
