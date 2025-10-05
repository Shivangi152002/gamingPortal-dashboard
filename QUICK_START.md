# ⚡ Quick Start Guide

## 🚀 First Time Setup (5 minutes)

### Step 1: Install Dependencies
```bash
# Install backend dependencies
cd D:\GAMELAUNCHER\dashboard\server
npm install

# Install frontend dependencies
cd D:\GAMELAUNCHER\dashboard
npm install
```

### Step 2: Configure .env Files

**Backend (.env in `server/` folder):**
Already configured! But you can change:
- `ADMIN_USERNAME=admin` → Your username
- `ADMIN_PASSWORD=admin123` → Your password

**Frontend (.env in dashboard root):**
Create this file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 3: Start Everything!

**Option A - Easy Way (Windows):**
Double-click `start-all.bat`

**Option B - Manual Way:**
```bash
# Terminal 1 - Backend
cd D:\GAMELAUNCHER\dashboard\server
npm start

# Terminal 2 - Frontend
cd D:\GAMELAUNCHER\dashboard
npm run dev
```

### Step 4: Login
1. Open: http://localhost:5173
2. Login with:
   - Username: `admin`
   - Password: `admin123`

---

## 📤 Upload Your First Game

1. **Click** "Upload Game" in sidebar
2. **Fill** game details:
   - Name: "My Awesome Game"
   - Category: "Action"
   - Description: "A fun game!"
3. **Upload** files:
   - Thumbnail (required)
   - Game ZIP/HTML
   - GIF preview
   - Logo
4. **Click** "Upload Game"
5. **Done!** Check "Game Data (JSON)" to see it

---

## 🎯 What You Can Do

| Feature | Where | What It Does |
|---------|-------|-------------|
| **Upload Games** | Upload Game | Upload game files & assets |
| **View Games** | Game Data (JSON) | See all games in table |
| **Edit JSON** | Game Data (JSON) | Edit game-data.json directly |
| **Delete Games** | Game Data (JSON) | Remove games |
| **Logout** | Sidebar (bottom) | Logout of admin panel |

---

## 📁 File Paths

Your uploads go here:
```
gamingPortal/public/
├── games/          ← Game ZIP/HTML files
├── thumbnail/      ← Logos & thumbnails
├── gif/           ← Preview GIFs
└── game-data.json ← Auto-updated!
```

---

## ⚙️ Configuration Reference

### Backend Server (server/.env)
```env
PORT=3000                          # Server port
ADMIN_USERNAME=admin               # Your username
ADMIN_PASSWORD=admin123            # Your password
UPLOAD_DIR=../../gamingPortal/public    # Upload folder
GAME_DATA_PATH=../../gamingPortal/public/game-data.json
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🔧 Troubleshooting

### Login doesn't work
→ Check backend is running on port 3000

### Upload fails
→ Ensure you're logged in and backend is running

### Port 3000 already in use
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### Backend won't start
→ Check `.env` file exists in `server/` folder

---

## 🎮 API Testing (Optional)

Test if backend works:
```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# Get games
curl http://localhost:3000/api/games
```

---

## 📋 Checklist

Before uploading games, ensure:
- [ ] Backend running (port 3000)
- [ ] Frontend running (port 5173)
- [ ] Logged in successfully
- [ ] game-data.json file exists
- [ ] Upload folders exist

---

## 🎉 Success!

If you see:
- ✅ Backend: "Server running on port 3000"
- ✅ Frontend: Opens at http://localhost:5173
- ✅ Login works
- ✅ Can upload files
- ✅ game-data.json updates

**You're all set! Start uploading games! 🚀**

---

## 📞 Need Help?

1. Check server logs in terminal
2. Check browser console (F12)
3. Read `SETUP_GUIDE.md` for detailed help

---

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Change these in:** `server/.env`
