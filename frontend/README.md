# Perfume Store - E-Commerce Application

A production-ready, modern e-commerce application for selling perfumes, built with React Native and Expo. Supports web, iOS, and Android platforms with a clean, minimalistic design.

## 🚀 Features

- **Product Catalog**: Browse premium perfumes with search and filter functionality
- **Product Details**: View detailed product information including fragrance notes
- **Shopping Cart**: Add, remove, and update quantities with persistent storage
- **Checkout Flow**: Complete checkout process with form validation
- **Responsive Design**: Optimized for mobile and web platforms
- **Accessibility**: WCAG-compliant with proper ARIA labels and keyboard navigation
- **Performance**: Optimized with memoization, debouncing, and lazy loading
- **Error Handling**: Production-ready error boundaries and validation
- **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture

The application follows a **Vertical Slice Architecture** pattern, organizing code by feature rather than technical concerns:

```
frontend/
├── app/                      # Expo Router pages (file-based routing)
│   ├── _layout.tsx          # Root layout with providers
│   ├── index.tsx            # Home/Product listing
│   ├── products/[id].tsx    # Product details
│   ├── cart.tsx             # Shopping cart
│   ├── checkout.tsx         # Checkout flow
│   └── order-success.tsx    # Order confirmation
├── features/                 # Feature modules (vertical slices)
│   ├── products/            # Product-related components
│   └── cart/                # Cart state management
├── shared/                   # Shared utilities and components
│   ├── components/          # Reusable UI components
│   ├── constants/           # Configuration and theme
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
└── data/                     # Static data (mock backend)
```

## 🛠️ Tech Stack

- **Framework**: React Native 0.81 + Expo SDK 54
- **Language**: TypeScript 5.9
- **Navigation**: Expo Router 6.0 (file-based)
- **State Management**: React Context + Hooks
- **Storage**: AsyncStorage (persistent cart)
- **Styling**: StyleSheet API with design tokens
- **Platform Support**: iOS, Android, Web

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (optional but recommended)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## 🚦 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

## 🎨 Design System

The application uses a comprehensive design system with:

- **Colors**: Primary, neutral, and semantic color palettes
- **Typography**: Consistent font sizes, weights, and line heights
- **Spacing**: 8px base grid system
- **Border Radius**: Standardized corner radii
- **Shadows**: Platform-specific elevation
- **Breakpoints**: Responsive design tokens

All design tokens are defined in `shared/constants/theme.ts`.

## 🧪 Code Quality

### Type Safety

Full TypeScript coverage with strict mode enabled:
- Proper typing for all components and functions
- No `any` types (except where absolutely necessary)
- Interface-driven development

### Error Handling

Production-ready error handling:
- Custom error classes with user-friendly messages
- Error boundaries for component failures
- Validation utilities with comprehensive checks
- Safe async operations with error recovery

### Validation

Comprehensive form validation:
- Email format validation
- Phone number validation
- Credit card validation (Luhn algorithm)
- Address validation
- Real-time field validation
- XSS prevention through input sanitization

### Accessibility

WCAG 2.1 AA compliant:
- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Touch target sizes (44x44pt minimum)

## 🌐 Platform Support

### Web
- Fully responsive design
- SEO-ready structure
- Fast loading with code splitting
- Browser compatibility: Chrome, Firefox, Safari, Edge

### Mobile (iOS/Android)
- Native performance
- Platform-specific UI adaptations
- Offline support with AsyncStorage
- Deep linking support

## 📱 Screens

1. **Home**: Product catalog with search and filters
2. **Product Details**: Detailed product information
3. **Cart**: Shopping cart management
4. **Checkout**: Complete checkout with validation
5. **Order Success**: Order confirmation

## 🔐 Security

- Input sanitization to prevent XSS attacks
- Form validation on client-side
- Secure payment simulation (ready for backend integration)
- No sensitive data in state or storage
- HTTPS-ready configuration

## 🚀 Deployment

### Web
```bash
npm run web
# Build for production
npx expo export:web
```

### Mobile
```bash
# Development build
npx expo run:android
npx expo run:ios

# Production build
eas build --platform all
```

## 🔄 Future Enhancements

Ready for backend integration:
- API service layer structure in place
- Authentication context ready
- Order management system
- Payment gateway integration (Stripe/PayPal)
- User profiles and order history
- Product reviews and ratings
- Wishlist functionality
- Push notifications
- Analytics integration

## 📝 Environment Variables

Create a `.env` file for configuration:
```env
API_URL=https://api.yourbackend.com
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🤝 Contributing

This is a production-ready template. Key considerations:
- Follow the established architecture patterns
- Maintain TypeScript strict mode
- Add proper error handling
- Include accessibility features
- Write descriptive commit messages

## 📄 License

MIT License - feel free to use this project for commercial purposes.

## 👥 Credits

Built with modern React Native best practices and Expo SDK 54.

---

**Note**: This project uses static data for demonstration. Connect to your backend API by replacing the mock data in the `data/` directory with API calls in a service layer.
