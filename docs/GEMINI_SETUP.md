# 🤖 Gemini API Setup Guide

Complete step-by-step guide to set up Google Gemini API for AI product recognition in your Shopping Assistant app.

## 📋 Prerequisites

- Google account (Gmail)
- Internet connection
- Your React Native Expo project ready

## 🚀 Step 1: Get Your Free Gemini API Key

### 1.1 Visit Google AI Studio
1. Open your web browser
2. Go to: **https://makersuite.google.com/app/apikey**
3. Sign in with your Google account

### 1.2 Create API Key
1. Click **"Create API Key"** button
2. Select **"Create API key in new project"** (recommended for new users)
3. Wait for the key generation (usually takes 10-30 seconds)
4. **Copy your API key** - it looks like: `AIzaSyC7Xj9Kp2Mn8Qr5St6Uv7Wx8Yz9Ab0Cd1Ef`

⚠️ **IMPORTANT**: Save this key securely! You won't be able to see it again.

### 1.3 Free Tier Limits
- **60 requests per minute**
- **1,500 requests per day**
- **No credit card required**
- **No charges for basic usage**

## 🔧 Step 2: Configure Your App

### 2.1 Update the AI Service File

Open `services/aiProductSearch.ts` and replace the placeholder:

```typescript
// Replace this line:
const GEMINI_API_KEY = 'your-gemini-api-key-here';

// With your actual API key:
const GEMINI_API_KEY = 'AIzaSyC7Xj9Kp2Mn8Qr5St6Uv7Wx8Yz9Ab0Cd1Ef';
```

### 2.2 Alternative: Use Environment Variables (Recommended)

Create a `.env` file in your project root:

```bash
# .env file
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyC7Xj9Kp2Mn8Qr5St6Uv7Wx8Yz9Ab0Cd1Ef
```

Then update `services/aiProductSearch.ts`:

```typescript
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'your-fallback-key';
```

## 🧪 Step 3: Test Your Setup

### 3.1 Run Your App
```bash
npm run dev
```

### 3.2 Test AI Features
1. Open the app on your device/simulator
2. Go to **Home tab**
3. Tap **"AI Photo Scan"**
4. Take a picture of any product
5. Watch for "AI is analyzing your image..." message
6. Check if product gets identified successfully

### 3.3 Expected Behavior
✅ **Success**: Product name appears with "AI Identified" badge
❌ **Error**: Check console logs and verify API key

## 🔍 Step 4: Troubleshooting

### 4.1 Common Issues

**Issue**: "API key not valid" error
**Solution**: 
- Double-check your API key is correct
- Ensure no extra spaces or characters
- Try regenerating the key

**Issue**: "Quota exceeded" error
**Solution**:
- You've hit the daily limit (1,500 requests)
- Wait 24 hours or upgrade to paid plan
- Implement caching to reduce API calls

**Issue**: "Network error" or timeout
**Solution**:
- Check internet connection
- Verify Gemini API service status
- Try again after a few minutes

### 4.2 Debug Mode

Add console logging to debug API calls:

```typescript
// In aiProductSearch.ts, add this before the API call:
console.log('Sending request to Gemini API...');
console.log('API Key (first 10 chars):', GEMINI_API_KEY.substring(0, 10));
```

### 4.3 Test API Key Manually

You can test your API key with a simple curl command:

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello, test message"}]
    }]
  }'
```

## 📊 Step 5: Monitor Usage

### 5.1 Check Usage Dashboard
1. Go to: **https://console.cloud.google.com/**
2. Select your project
3. Navigate to **APIs & Services > Quotas**
4. Search for "Generative Language API"
5. Monitor your daily usage

### 5.2 Set Up Alerts (Optional)
1. In Google Cloud Console
2. Go to **Monitoring > Alerting**
3. Create alert for API quota usage
4. Get notified when approaching limits

## 🔒 Step 6: Security Best Practices

### 6.1 Protect Your API Key
- ✅ Use environment variables
- ✅ Add `.env` to `.gitignore`
- ✅ Never commit API keys to version control
- ✅ Rotate keys periodically

### 6.2 Rate Limiting
The app includes built-in rate limiting:
- Maximum 1 request per 2 seconds
- Automatic retry with exponential backoff
- User-friendly error messages

## 🚀 Step 7: Production Deployment

### 7.1 Environment Variables for Production
When deploying, set environment variables in your hosting platform:

**Expo EAS Build:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value your-api-key
```

**Netlify/Vercel:**
Add environment variable in dashboard:
- Name: `EXPO_PUBLIC_GEMINI_API_KEY`
- Value: `your-api-key`

## 📈 Step 8: Upgrade Options

### 8.1 When to Upgrade
Consider upgrading if you need:
- More than 1,500 requests/day
- Higher rate limits
- Advanced features
- Production SLA

### 8.2 Pricing Tiers
- **Free**: 1,500 requests/day
- **Pay-as-you-go**: $0.00025 per request
- **Enterprise**: Custom pricing

## 🎯 Quick Start Checklist

- [ ] Created Google account
- [ ] Visited Google AI Studio
- [ ] Generated API key
- [ ] Updated `aiProductSearch.ts` with key
- [ ] Tested with photo scan
- [ ] Verified product identification works
- [ ] Set up environment variables
- [ ] Added error handling
- [ ] Monitored usage dashboard

## 📞 Support

If you encounter issues:
1. Check the [Google AI Studio documentation](https://ai.google.dev/docs)
2. Review the [Gemini API reference](https://ai.google.dev/api/rest)
3. Check our app's console logs for detailed error messages
4. Ensure you're using the latest version of the app

---

🎉 **Congratulations!** Your AI Shopping Assistant is now powered by Google Gemini for intelligent product recognition!