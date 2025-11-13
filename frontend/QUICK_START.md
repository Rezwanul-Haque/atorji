# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Run the App

**Web (Recommended for quick preview):**
```bash
npm run web
```
Access at: http://localhost:8081

**Mobile Preview:**
```bash
npm start
```
Scan QR code with Expo Go app on your phone

### Project Structure

```
frontend/
├── app/                 # 📱 Screens (Expo Router)
│   ├── index.tsx       # Home - Product listing
│   ├── products/[id].tsx # Product details
│   ├── cart.tsx        # Shopping cart
│   ├── checkout.tsx    # Checkout
│   └── order-success.tsx # Success page
│
├── features/           # 🎯 Feature modules
│   ├── products/       # Product components
│   └── cart/           # Cart state (Context API)
│
├── shared/             # 🔧 Shared utilities
│   ├── components/     # UI components
│   ├── constants/      # Configuration
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   └── utils/          # Helper functions
│
└── data/               # 📊 Static data (mock backend)
    └── products.ts     # 8 sample perfumes
```

### Key Features

✅ **Product Browsing**
- Search by name/brand
- Filter by gender
- View details with notes

✅ **Shopping Cart**
- Add/remove items
- Update quantities
- Persistent storage

✅ **Checkout**
- Form validation
- Shipping info
- Payment simulation

✅ **Production-Ready**
- TypeScript
- Error handling
- Accessibility
- Responsive design

### Common Commands

```bash
# Development
npm start          # Start Expo dev server
npm run web        # Run on web browser
npm run android    # Run on Android
npm run ios        # Run on iOS (macOS only)

# Check for issues
npx expo-doctor    # Diagnose issues
```

### Port Configuration

- **3000**: App preview (configure in settings)
- **8081**: Metro bundler (default)
- **8000**: Dev server (HMR)

### Quick Tips

1. **Hot Reload**: Changes auto-reload in development
2. **Debug**: Press `d` in terminal for dev menu
3. **Clear Cache**: `npx expo start -c` to clear Metro cache
4. **Type Check**: `npx tsc --noEmit` to check types

### Customization

**Change Theme:**
Edit `shared/constants/theme.ts`

**Add Products:**
Edit `data/products.ts`

**Connect Backend:**
Replace static data with API calls in feature modules

### Need Help?

📖 See `README.md` for detailed documentation
📝 See `PROJECT_SUMMARY.md` for architecture overview

### Production Deployment

**Web:**
```bash
npx expo export:web
```
Deploy `web-build/` directory to your hosting

**Mobile:**
```bash
eas build --platform all
```
Requires Expo Application Services (EAS) account

---

**Questions?** Check the documentation or create an issue!
