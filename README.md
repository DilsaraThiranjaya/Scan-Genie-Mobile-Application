# Scan Genie - AI Shopping Assistant 🛒✨

An intelligent mobile application that helps users make better food choices through AI-powered product scanning and analysis. Built with React Native and Expo, featuring barcode scanning, AI image recognition, and smart product alternatives.

## 📱 Features

### Core Functionality
- **Barcode Scanning**: Instantly scan product barcodes to get detailed nutrition information
- **AI Photo Recognition**: Take photos of products without barcodes - AI will identify them
- **Smart Alternatives**: Get AI-powered suggestions for cheaper and healthier alternatives
- **Nutrition Analysis**: View detailed nutrition facts, grades, and health insights
- **Favorites System**: Save your favorite products for quick access
- **Shopping Analytics**: Track your scanning habits and discover patterns

### User Experience
- **Beautiful UI**: Modern, gradient-based design with smooth animations
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Secure Authentication**: Firebase-powered user accounts with email/password
- **Real-time Sync**: Data syncs across all your devices

## 🚀 Technology Stack

### Frontend
- **React Native** with Expo SDK 54
- **Expo Router** for navigation
- **TypeScript** for type safety
- **Lucide React Native** for icons
- **React Native Reanimated** for animations
- **Expo Camera** for barcode scanning
- **Expo Image Picker** for photo selection

### Backend & Services
- **Firebase Authentication** for user management
- **Firestore** for data storage
- **Google Gemini AI** for product identification
- **OpenFoodFacts API** for nutrition data
- **Custom AI algorithms** for alternative suggestions

### Development Tools
- **ESLint** for code quality
- **TypeScript** for static typing
- **Metro** bundler for React Native
- **EAS Build** for app compilation

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd scan-genie
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.example` file in the root directory with your API keys:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI API Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Add your configuration to the `.env.example` file

### 5. Google Gemini AI Setup
1. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the API key to your `.env.example` file

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start the development server
npm start

# Run on specific platforms
npm run android    # Android
npm run ios        # iOS
npm run web        # Web browser
```

### Production Build
```bash
# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

## 📱 Download & Demo

### 📥 Download APK
[Download Latest APK](https://expo.dev/artifacts/eas/vocPvo8foBXxpF74PqdDvh.apk)

### 🎥 Demo Video
[Watch Demo on YouTube](https://www.youtube.com/watch?v=j6pU0aUzB-Y&t=12s)

## 🏗️ Project Structure

```
scan-genie/
├── app/                          # App screens and navigation
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx             # Login screen
│   │   ├── signup.tsx            # Registration screen
│   │   └── forgot-password.tsx   # Password reset
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Home/Scanner screen
│   │   ├── results.tsx           # Product details
│   │   ├── suggestions.tsx       # AI alternatives
│   │   ├── favorites.tsx         # Saved products
│   │   └── analytics.tsx         # User analytics
│   ├── onboarding.tsx            # App introduction
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   └── ui/                       # UI-specific components
├── context/                      # React Context providers
│   └── AuthContext.tsx           # Authentication state
├── services/                     # External API integrations
│   ├── aiProductSearch.ts        # Gemini AI service
│   ├── openFoodFacts.ts          # Nutrition data API
│   └── firestore.ts              # Database operations
├── types/                        # TypeScript type definitions
└── assets/                       # Static assets
```

## 🔧 Key Components

### Authentication System
- Firebase Authentication with email/password
- Secure user session management
- Password reset functionality
- User profile management

### Product Scanning
- **Barcode Scanner**: Uses device camera to scan product barcodes
- **AI Image Recognition**: Gemini AI identifies products from photos
- **Nutrition Analysis**: Fetches detailed nutrition data from OpenFoodFacts

### AI-Powered Features
- **Product Identification**: Advanced AI recognizes products from images
- **Alternative Suggestions**: Machine learning suggests cheaper/healthier options
- **Nutrition Scoring**: Automated health assessment of products
- **Shopping Insights**: Analytics on user shopping patterns

### Data Management
- **Firestore Integration**: Real-time data synchronization
- **User Analytics**: Comprehensive tracking of user behavior
- **Favorites System**: Personal product collections

## 📊 Analytics & Insights

### User Analytics
- **Scan History**: Complete record of all scanned products
- **Category Tracking**: Monitor shopping patterns by product category
- **Monthly Reports**: Detailed monthly scanning statistics
- **Favorite Trends**: Analysis of saved product preferences

### Health Insights
- **Nutrition Scoring**: Automated health assessment of products
- **Dietary Tracking**: Monitor nutritional intake patterns
- **Health Recommendations**: Personalized suggestions for better choices

## 🤖 AI Integration

### Google Gemini AI
- **Image Recognition**: Advanced computer vision for product identification
- **Natural Language Processing**: Smart product name extraction
- **Confidence Scoring**: AI reliability metrics for each identification

### Alternative Suggestions
- **Price Comparison**: Find cheaper alternatives automatically
- **Health Optimization**: Suggest healthier product options
- **Availability Mapping**: Show where alternatives can be found

### Test Coverage
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and service integration testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: App performance and memory usage testing

## 🙏 Acknowledgments

### APIs & Services
- **OpenFoodFacts**: Comprehensive food product database
- **Google Gemini AI**: Advanced AI for image recognition
- **Firebase**: Backend infrastructure and authentication
- **Expo**: React Native development platform

### Open Source Libraries
- **React Native**: Mobile app framework
- **Lucide Icons**: Beautiful icon library
- **React Native Reanimated**: Smooth animations
- **Expo Camera**: Camera functionality

### Common Issues

#### Camera Permissions
If camera scanning isn't working:
1. Check device permissions in Settings
2. Restart the app after granting permissions
3. Ensure good lighting for barcode scanning

#### AI Recognition Issues
If AI photo recognition fails:
1. Verify your Gemini API key is valid
2. Check internet connection
3. Ensure photos are clear and well-lit
4. Try different angles of the product

#### Sync Issues
If data isn't syncing:
1. Check internet connection
2. Verify Firebase configuration
3. Try logging out and back in
4. Clear app cache if necessary

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Barcode scanning functionality
- AI image recognition
- Product alternatives
- User authentication
- Favorites and analytics

---

**Made with ❤️ by Dilsara Thiranjaya**

*Helping you make smarter, healthier shopping decisions through the power of AI.*
