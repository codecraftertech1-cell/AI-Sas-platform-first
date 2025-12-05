# How to Start MySQL in WAMP64

## Issue
The error `Can't reach database server at localhost:3306` means MySQL is not running.

## Solution: Start MySQL Service

### Method 1: Using WAMP64 Control Panel (Recommended)
1. **Open WAMP64 Control Panel** (usually in system tray or Start Menu)
2. **Click on the WAMP64 icon** in the system tray
3. **Click "Start All Services"** or specifically **"Start MySQL"**
4. The icon should turn **green** when MySQL is running

### Method 2: Using Windows Services
1. Press `Win + R` to open Run dialog
2. Type `services.msc` and press Enter
3. Find **"wampmysqld64"** in the list
4. Right-click and select **"Start"**
5. Wait for the status to change to "Running"

### Method 3: Using PowerShell (Run as Administrator)
```powershell
Start-Service -Name "wampmysqld64"
```

### Method 4: Using Command Prompt (Run as Administrator)
```cmd
net start wampmysqld64
```

## Verify MySQL is Running

After starting MySQL, verify it's running:

### Check Service Status
```powershell
Get-Service -Name "wampmysqld64" | Select-Object Name, Status
```
Status should show: **Running**

### Test Connection
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```
Should show: **TcpTestSucceeded : True**

## After Starting MySQL

1. **Restart your backend server** (if it's running):
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

2. **Test the connection**:
   - Try registering a new user
   - Try logging in
   - The database errors should be gone

## Common Issues

### Issue: Service won't start
- **Solution**: Check if port 3306 is already in use by another application
- **Solution**: Restart WAMP64 completely
- **Solution**: Check WAMP64 error logs

### Issue: MySQL starts but connection fails
- **Solution**: Check `backend/.env` file has correct `DATABASE_URL`
- **Solution**: Verify database name exists in MySQL
- **Solution**: Check MySQL user permissions

## Database URL Format

Your `DATABASE_URL` in `backend/.env` should look like:
```
DATABASE_URL="mysql://root:@localhost:3306/aisas"
```

Or if you have a password:
```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/aisas"
```

## Quick Check Script

Run this to check if MySQL is accessible:
```bash
cd backend
node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany().then(() => { console.log('✅ Database connection successful'); process.exit(0); }).catch(err => { console.error('❌ Database connection failed:', err.message); process.exit(1); });"
```

