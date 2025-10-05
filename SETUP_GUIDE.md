# Game Admin Dashboard - Complete Setup Guide

A complete admin dashboard for managing games with file uploads, authentication, and automatic game-data.json updates.

## 🎮 Features

- ✅ **Secure Login System** - JWT-based authentication
- ✅ **File Upload** - Upload game GIFs, logos, thumbnails, and HTML files
- ✅ **Game Management** - Add, edit, and delete games
- ✅ **JSON Viewer** - View and edit game-data.json directly
- ✅ **Auto-Update** - Automatically updates game-data.json on every upload
- ✅ **Separate Backend** - Backend server runs independently

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- Access to the gamingPortal folder

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd D:\GAMELAUNCHER\dashboard\server
npm install
```

### Step 2: Configure Backend Environment

1. A `.env` file should exist in the server folder
2. Update these critical settings:

```env
PORT=3000
JWT_SECRET=change-this-to-random-string-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
UPLOAD_DIR=../../gamingPortal/public
GAME_DATA_PATH=../../gamingPortal/public/game-data.json
```

### Step 3: Install Frontend Dependencies

```bash
cd D:\GAMELAUNCHER\dashboard
npm install
```

### Step 4: Configure Frontend Environment

Create `.env` file in the dashboard root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 5: Start Backend Server

```bash
cd D:\GAMELAUNCHER\dashboard\server
npm start
```

You should see:
```
🚀 Server running on port 3000
📝 Environment: development
🔐 Admin Login: admin
```

### Step 6: Start Frontend Dashboard

Open a **NEW terminal** window:

```bash
cd D:\GAMELAUNCHER\dashboard
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173
```

### Step 7: Login to Dashboard

1. Open browser: `http://localhost:5173`
2. You'll see the login page
3. Default credentials:
   - Username: `admin`
   - Password: `admin123`

## 📁 How to Use

### Upload a New Game

1. **Navigate** to "Upload Game" from sidebar
2. **Fill in game details:**
   - Game Name (required)
   - Category (required)
   - Description (required)
   - Developer
   - Tags
   - Age Rating
   - Release Date

3. **Upload files:**
   - **Thumbnail** (required) - Main game image
   - **Game ZIP/HTML** - The actual game files
   - **Icon/Logo** - Game icon
   - **Preview GIF** - Animated preview

4. **Click "Upload Game"**
   - Files are uploaded to correct folders
   - game-data.json is automatically updated
   - You'll see a success message

### View/Edit game-data.json

1. **Navigate** to "Game Data (JSON)" from sidebar
2. **View** all games in a table
3. **Edit JSON directly:**
   - Click "Edit JSON" button
   - Modify the JSON structure
   - Click "Save Changes"
4. **Delete games** using the delete icon

### Edit Existing Game

1. Go to "Game Data (JSON)"
2. View the game you want to edit
3. Click "Edit JSON" to modify game-data.json
4. Or re-upload files to update assets

## 🗂️ File Organization

When you upload files, they're automatically organized:

```
gamingPortal/public/
├── games/                  # Game HTML/ZIP files
│   └── your-game-123.zip
├── thumbnail/              # Logos and thumbnails
│   ├── logo-123.png
│   └── thumbnail-456.jpg
├── gif/                    # Preview GIFs
│   └── preview-789.gif
└── game-data.json          # Auto-updated game database
```

## 📊 game-data.json Structure

The system maintains this structure:

```json
{
  "games": [
    {
      "id": "game_1696234567890",
      "name": "My Awesome Game",
      "description": "<p>Game description in HTML</p>",
      "category": "Action",
      "thumbnail": "/public/thumbnail/thumb-123.jpg",
      "gif": "/public/gif/preview-456.gif",
      "logo": "/public/thumbnail/logo-789.png",
      "htmlFile": "/public/games/game-111.zip",
      "tags": ["action", "adventure"],
      "developer": "Your Name",
      "releaseDate": "2024-10-04",
      "ageRating": "All Ages",
      "languages": ["English"],
      "createdAt": "2024-10-04T10:30:00.000Z",
      "updatedAt": "2024-10-04T10:30:00.000Z"
    }
  ]
}
```

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Protected Endpoints** - All upload/edit endpoints require login
3. **File Validation** - Only allowed file types accepted
4. **Path Security** - Prevents directory traversal attacks

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Kill the process using port 3000 (Windows)
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=3001
```

### Login fails
- Verify username/password in `server/.env`
- Check backend server is running
- Check browser console for errors

### File upload fails
- Ensure backend server is running
- Check `UPLOAD_DIR` path exists
- Verify you're logged in (token valid)
- Check file size limits (default 50MB)

### game-data.json not updating
- Check `GAME_DATA_PATH` in server/.env
- Verify file permissions (writable)
- Check backend server logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check backend is running on correct port
- Try: `http://localhost:3000/api/health`

## 🎯 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Games
- `GET /api/games` - Get all games
- `POST /api/games` - Create game (auth required)
- `PUT /api/games/:id` - Update game (auth required)
- `DELETE /api/games/:id` - Delete game (auth required)

### Upload
- `POST /api/upload/files` - Upload multiple files (auth required)
- `POST /api/upload/file` - Upload single file (auth required)

## 💡 Tips

1. **Always start backend first** before frontend
2. **Use Chrome DevTools** to debug upload issues
3. **Check server logs** for detailed error messages
4. **Backup game-data.json** before major edits
5. **Use JSON Editor** for bulk game edits

## 🔄 Production Deployment

For production use:

1. **Change credentials:**
   ```env
   JWT_SECRET=<generate-random-string>
   ADMIN_USERNAME=<your-username>
   ADMIN_PASSWORD=<strong-password>
   ```

2. **Use environment variables:**
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   ```

3. **Enable HTTPS**
4. **Add rate limiting**
5. **Set up database** (instead of .env credentials)

## 📞 Support

If you encounter issues:
1. Check server logs: `server/` terminal
2. Check browser console: F12 in browser
3. Verify file paths in `.env`
4. Ensure all dependencies installed

## 🎉 Success Indicators

Everything is working when:
- ✅ Backend shows "Server running on port 3000"
- ✅ Frontend loads at http://localhost:5173
- ✅ You can login successfully
- ✅ Files upload without errors
- ✅ game-data.json updates automatically
- ✅ New games appear in Game Data viewer

---

**You're all set! Start uploading your games! 🎮**
