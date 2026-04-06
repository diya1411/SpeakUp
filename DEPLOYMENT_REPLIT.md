# Deploying SpeakUp to Replit

## Step-by-Step Guide

### 1. Create a New Replit Project

- Go to [Replit.com](https://replit.com)
- Click "Create" → "New Replit"
- Choose "Node.js" as the language
- Name it "SpeakUp" (or your preferred name)

### 2. Upload Project Files

**Option A: Upload ZIP**
- Download all SpeakUp files as ZIP
- In Replit, go to Files (folder icon)
- Click the upload icon and select the ZIP
- Extract the files

**Option B: Git Clone**
- Open Replit terminal
- Run: `git clone <your-github-repo-url>`

**Option C: Manual Upload**
- Go to Files → Upload
- Upload the `backend/` and `frontend/` folders individually

### 3. Set Environment Variables

1. Click the lock icon (Secrets) in Replit sidebar
2. Add the following secrets:
   ```
   GEMINI_API_KEY=your_api_key_here
   ELEVENLABS_API_KEY=your_api_key_here
   ELEVENLABS_VOICE_ID=your_voice_id_here
   ```

### 4. Install Dependencies

In Replit terminal:
```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 5. Create .replit Configuration

Create a `.replit` file in the root directory:

```bash
run = "bash -c 'cd backend && npm start & cd frontend && npm run build && npm run dev'"
```

Or manually start servers:
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend (open new terminal)
cd frontend && npm run build && npm run preview
```

### 6. Make Public

- Click the "Share" button (top right)
- Toggle "Public" on
- Copy the shared URL
- Anyone can now visit your app

### 7. Access Your App

- Your app will be available at: `https://[your-replit-name].repl.co`
- Or use the "Open in new tab" button

## Important Notes

- **Environment Variables:** Replit Secrets are automatically available as `process.env.*`
- **Always HTTPS:** Replit provides automatic HTTPS
- **Microphone Access:** Users must allow microphone permissions
- **Mobile Support:** App is fully mobile responsive
- **Performance:** Free tier Repits may go to sleep - upgrade for always-on

## Troubleshooting on Replit

### Servers not starting
- Check the terminal for errors
- Ensure all dependencies installed
- Verify environment variables are set

### Microphone permission denied
- Ask user to check browser settings
- Try a different browser
- HTTPS is required for microphone access (Replit provides this)

### API calls failing
- Verify API keys in Secrets
- Check network tab in browser dev tools
- Ensure backend is running

### Frontend not loading
- Wait a few seconds for Vite to build
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors

## Monitoring Logs

**Backend logs:**
- Check Replit terminal output
- Look for "SpeakUp backend running on port..."

**Frontend logs:**
- Check browser console (F12)
- Look for "SpeakUp" page loading

## Custom Domain (Premium)

If you have Replit Pro:
1. Go to Replit Settings
2. Click "Domains"
3. Add your custom domain
4. Update frontend REACT_APP_API_URL if needed

## Maintenance

- **Keep dependencies updated:** Periodically run `npm update`
- **Monitor logs:** Check for errors regularly
- **Backup sessions:** Consider exporting session data regularly

---

Your SpeakUp app is now live! 🚀
