╔═══════════════════════════════════════════════════════════════════════════════╗
║          🚀 DeliverX Backend - Complete Setup Checklist                       ║
║                                                                               ║
║  Follow these steps in order. Check off each item as you complete it.        ║
╚═══════════════════════════════════════════════════════════════════════════════╝


SECTION 1: REVIEW & UNDERSTAND (5 minutes)
─────────────────────────────────────────────────────────────────────────────

  ☐ Read: backend/IP_WHITELIST_FIX.md
    └─ Understand why MongoDB Atlas IP whitelist is needed
    └─ Location: c:\Users\Admin\OneDrive\Desktop\DeliverX\backend\IP_WHITELIST_FIX.md

  ☐ Read: backend/SETUP.md (Optional, for reference)
    └─ Comprehensive guide with API endpoints, troubleshooting, etc.

  ☐ Check your current IP address
    └─ Go to: https://www.whatismyipaddress.com/
    └─ Write it down: ___________________


SECTION 2: FIX MONGODB ATLAS IP WHITELIST (2-3 minutes)
─────────────────────────────────────────────────────────────────────────────

  ☐ Log in to MongoDB Atlas
    └─ Go to: https://cloud.mongodb.com
    └─ Click "Sign In"

  ☐ Navigate to Security Settings
    └─ Click your project name
    └─ Click "Security" in the sidebar
    └─ Select "Network Access"
    └─ Look for "IP Whitelist" tab

  ☐ Add Your IP Address
    └─ Click "Add IP Address" button
    
    Choose ONE option:
    
    Option A (Recommended for Security):
      ☐ Select "Add a single IP address"
      ☐ Enter your IP (from https://www.whatismyipaddress.com/)
      ☐ Example: 203.0.113.45
    
    Option B (Quick for Development):
      ☐ Select "Allow access from anywhere"
      ☐ Enter: 0.0.0.0/0
      ⚠️  ONLY for development! Never use in production!

  ☐ Confirm the Whitelist Entry
    └─ Click "Add IP Address" button
    └─ Status shows "Creating..."

  ☐ WAIT 1-2 MINUTES
    └─ Set a timer for 2 minutes
    └─ MongoDB takes time to update globally
    └─ Status will change to "✓" when complete


SECTION 3: VERIFY DATABASE CONNECTION (2 minutes)
─────────────────────────────────────────────────────────────────────────────

  ☐ Open Terminal/PowerShell in the project folder
    └─ Path: c:\Users\Admin\OneDrive\Desktop\DeliverX

  ☐ Navigate to backend folder
    └─ Run: cd backend

  ☐ Run the database diagnostic test
    └─ Run: npm run test:db
    
    Expected output:
    ✅ Connection Successful!
    📊 Database Statistics:
      Database Name: DeliverX
      Collections: N
      Data Size: X.XX MB
    📚 Collections:
      - [collection names...]

  ☐ If test FAILS:
    └─ Wait another 1-2 minutes (whitelist still updating)
    └─ Check: Did you wait long enough after whitelisting?
    └─ Check: Is the .env file correct? (cat .env)
    └─ Check: Are credentials in MONGO_URI correct?
    └─ Retry: npm run test:db


SECTION 4: START THE BACKEND SERVER (1 minute)
─────────────────────────────────────────────────────────────────────────────

  ☐ From backend folder, start the development server
    └─ Run: npm run dev
    
    Expected output:
    Server running on port 5000
    Environment: development
    API Base URL: http://localhost:5000/api
    Frontend: http://localhost:5173

  ☐ Backend is now running! Keep this terminal open.
    └─ To stop: Press Ctrl+C


SECTION 5: TEST API HEALTH CHECK (1 minute)
─────────────────────────────────────────────────────────────────────────────

  ☐ Open a web browser

  ☐ Visit: http://localhost:5000/api/health
    
    Expected JSON response:
    {
      "status": "ok",
      "database": "connected",
      "environment": "development",
      "timestamp": "2026-03-06T..."
    }

  ☐ You should see "database": "connected" ✅


SECTION 6: SEED TEST DATA (Optional, 1 minute)
─────────────────────────────────────────────────────────────────────────────

  ☐ Open a new terminal (keep backend running in first terminal)

  ☐ Navigate to backend folder
    └─ Run: cd backend

  ☐ Seed the database with test data
    └─ Run: npm run seed
    
    Expected output:
    Database seeding completed!
    - Users created: 5
    - Drivers created: 10
    - Shipments created: 20+
    - Etc.

  ☐ Test data is now in MongoDB
    └─ Demo users created (admin@, manager@, etc.)
    └─ Drivers, shipments, and more populated


SECTION 7: START THE FRONTEND (2 minutes)
─────────────────────────────────────────────────────────────────────────────

  ☐ Open a new terminal (keep backend running!)

  ☐ Navigate to PROJECT ROOT (not backend folder)
    └─ Run: cd c:\Users\Admin\OneDrive\Desktop\DeliverX
    └─ Or just: cd ..  (if currently in backend folder)

  ☐ Install frontend dependencies (if not already done)
    └─ Run: npm install

  ☐ Start the frontend development server
    └─ Run: npm run dev
    
    Expected output:
    VITE v... ready in ... ms
    
    ➜  Local:   http://localhost:5173/
    ➜  press h to show help

  ☐ Frontend is now running!


SECTION 8: TEST THE FULL APPLICATION (5 minutes)
─────────────────────────────────────────────────────────────────────────────

  ☐ Open web browser and visit: http://localhost:5173

  ☐ You should see the DeliverX Login page

  ☐ Try logging in with demo credentials (from SETUP.md):
    
    Admin Account:
      Email: admin@deliverx.com
      Password: admin123
    
    Alternative accounts:
      manager@deliverx.com / manager123
      clerk@deliverx.com / clerk123
      driver@deliverx.com / driver123
      delivery@deliverx.com / delivery123

  ☐ After login, you should see the dashboard

  ☐ Test navigation:
    └─ Click different menu items
    └─ View shipments, drivers, stats, etc.
    └─ Verify data is displaying correctly


SECTION 9: VERIFY ALL TERMINALS ARE RUNNING
─────────────────────────────────────────────────────────────────────────────

  You should have 2-3 terminals open:

  Terminal 1: Backend Server
    └─ Location: backend folder
    └─ Command: npm run dev
    └─ Status: Running (should show "Server running on port 5000")
    └─ Keep open: YES

  Terminal 2: Frontend Server
    └─ Location: Project root
    └─ Command: npm run dev
    └─ Status: Running (should show "http://localhost:5173")
    └─ Keep open: YES

  Terminal 3: Optional (for commands)
    └─ Use this to run: npm run seed, or other commands


SECTION 10: COMMON ISSUES & TROUBLESHOOTING
─────────────────────────────────────────────────────────────────────────────

  ❌ Issue: "EADDRINUSE: address already in use :::5000"
     Solution:
       netstat -ano | findstr :5000
       taskkill /PID <PID> /F
       npm run dev

  ❌ Issue: MongoDB connection timeout / blocked
     Solution:
       ☐ Wait 2-3 minutes after whitelisting
       ☐ Check IP whitelist: https://cloud.mongodb.com
       ☐ Try: 0.0.0.0/0 for quick test
       ☐ Run: npm run test:db to diagnose

  ❌ Issue: "Cannot find module" errors
     Solution:
       ☐ Run: npm install
       ☐ Make sure node_modules exists
       ☐ Delete node_modules and reinstall if needed

  ❌ Issue: Frontend not connecting to backend
     Solution:
       ☐ Make sure backend is running (terminal 1)
       ☐ Check: http://localhost:5000/api/health
       ☐ Verify CORS_ORIGIN in .env

  ❌ Issue: Login not working
     Solution:
       ☐ Run: npm run seed (to populate test users)
       ☐ Use demo credentials: admin@deliverx.com / admin123
       ☐ Check browser console for errors (F12)

  ☐ Still stuck? Read: backend/SETUP.md (Troubleshooting section)


SECTION 11: BACKUP & DEPLOYMENT (For Later)
─────────────────────────────────────────────────────────────────────────────

  ☐ Keep .env file safe (contains credentials!)
    └─ Never commit .env to Git
    └─ Add .env to .gitignore (should already be there)

  ☐ For production deployment:
    └─ Change JWT_SECRET to something random and strong
    └─ Use specific IP whitelist (not 0.0.0.0/0)
    └─ Set NODE_ENV=production
    └─ Use proper database backups


═══════════════════════════════════════════════════════════════════════════════

🎉 FINAL CHECKLIST - Application Ready!
─────────────────────────────────────────────────────────────────────────────

  ☐ Backend running on http://localhost:5000
  ☐ Frontend running on http://localhost:5173
  ☐ MongoDB connected and working
  ☐ Health check responding with "connected"
  ☐ Login page loading
  ☐ Users can log in with demo credentials
  ☐ Dashboard displaying data
  ☐ All features working as expected

  🎊 CONGRATULATIONS! Your DeliverX application is ready for development!


═══════════════════════════════════════════════════════════════════════════════

📞 Need Help?
─────────────────────────────────────────────────────────────────────────────

1. Check backend/SETUP.md for comprehensive documentation
2. Check backend/IP_WHITELIST_FIX.md if MongoDB won't connect
3. Review error messages carefully - they often provide solutions
4. Check browser console (F12) for frontend errors
5. View backend logs for server errors

═══════════════════════════════════════════════════════════════════════════════
