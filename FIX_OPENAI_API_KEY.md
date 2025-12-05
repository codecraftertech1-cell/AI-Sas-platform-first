# Fix OpenAI API Key Error

## Error Detected
```
OpenAI API Error: AuthenticationError: 401 Incorrect API key provided
code: 'invalid_api_key'
```

## Issue
Your OpenAI API key in `backend/.env` is invalid, expired, or incorrectly formatted.

## Solution

### Step 1: Get a Valid OpenAI API Key

1. Go to https://platform.openai.com/account/api-keys
2. Sign in to your OpenAI account
3. Click **"Create new secret key"**
4. Copy the key (it starts with `sk-` and you won't be able to see it again)

### Step 2: Update Your `.env` File

1. Open `backend/.env` file
2. Find the line with `OPENAI_API_KEY=`
3. Replace it with your new key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
4. **Important**: 
   - Don't add quotes around the key
   - Don't add spaces
   - Make sure there are no extra characters
   - The key should start with `sk-` or `sk-proj-`

### Step 3: Restart Your Backend Server

1. Stop the server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Verify It Works

The server should start without OpenAI API errors. You should see:
```
✅ OpenAI client initialized
🚀 Server running on port 5000
```

## Common Issues

### Issue: "API key not found"
- **Solution**: Make sure `OPENAI_API_KEY` is in `backend/.env` (not `frontend/.env`)

### Issue: "Invalid API key" after updating
- **Solution**: 
  - Check for extra spaces or quotes
  - Make sure you copied the entire key
  - Verify the key is active at https://platform.openai.com/account/api-keys

### Issue: "Insufficient quota"
- **Solution**: Add credits to your OpenAI account at https://platform.openai.com/account/billing

## Test Your API Key

Run this command to test your API key:
```bash
cd backend
npm run test-openai
```

If successful, you'll see:
```
✅ OpenAI API key is valid!
```

## Security Note

⚠️ **Never commit your `.env` file to Git!** It contains sensitive API keys.

Make sure `.env` is in your `.gitignore` file.

