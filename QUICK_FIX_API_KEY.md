# Quick Fix: Invalid OpenAI API Key

## Current Error
```
❌ OpenAI API Key Error: 401 Incorrect API key provided
Invalid OpenAI API key. Please check your OPENAI_API_KEY in backend/.env file
```

## Quick Fix Steps

### 1. Get a Valid API Key
- Go to: https://platform.openai.com/account/api-keys
- Sign in to your OpenAI account
- Click **"Create new secret key"**
- Copy the key (starts with `sk-`)

### 2. Update backend/.env File

Open `backend/.env` and update this line:

**Before (WRONG):**
```
OPENAI_API_KEY=sk-proj-...DGAA
```

**After (CORRECT):**
```
OPENAI_API_KEY=sk-your-actual-key-here
```

**Important:**
- ✅ No quotes around the key
- ✅ No spaces before or after `=`
- ✅ Key should start with `sk-` (not `sk-proj-` unless it's a valid project key)
- ✅ Make sure there are no extra characters

### 3. Restart Server

The server will auto-restart with nodemon, but if errors persist:
1. Stop server (Ctrl+C)
2. Start again: `npm run dev`

### 4. Verify

After updating, you should see:
- ✅ No more "Invalid API key" errors
- ✅ Chat messages work properly
- ✅ AI responses appear

## Test Your Key

Run this command to test:
```bash
cd backend
npm run test-openai
```

## Common Issues

### Issue: Key still shows as invalid
- **Check**: Make sure you saved the `.env` file
- **Check**: Make sure there are no spaces or quotes
- **Check**: Verify the key is active at https://platform.openai.com/account/api-keys

### Issue: "Insufficient quota"
- **Solution**: Add credits at https://platform.openai.com/account/billing

### Issue: Key format looks wrong
- Valid keys start with: `sk-` (for personal) or `sk-proj-` (for projects)
- Length: Usually 51+ characters
- No spaces or special characters except dashes

## Need Help?

If you're still having issues:
1. Double-check the key at https://platform.openai.com/account/api-keys
2. Make sure you copied the entire key
3. Try creating a new key if the current one doesn't work

