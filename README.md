# Atorji - Premium Perfume E-Commerce Platform

A modern, full-stack e-commerce application for premium perfumes built with React Native and Expo.

## Project Overview

Atorji is a comprehensive perfume shopping platform featuring a responsive design that works seamlessly across web and mobile platforms. The application provides an elegant shopping experience with advanced features including product browsing, cart management, secure checkout, and theme customization.

## Project Structure

```
atorji/
├── frontend/          # React Native/Expo frontend application
│   ├── app/          # Application screens and navigation
│   ├── shared/       # Shared components, utilities, and contexts
│   ├── features/     # Feature-specific modules (cart, products, etc.)
│   └── data/         # Static data and mock products
└── backend/          # Backend API (coming soon)
```

## Frontend

### Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet with custom theme system
- **State Management**: React Context API
- **UI Components**: Custom component library with responsive design

### Key Features

- **Responsive Design**: Optimized layouts for mobile and web platforms
- **Theme Support**: Light/Dark mode with system preference detection
- **Product Catalog**: Browse perfumes by category, brand, gender, and price
- **Shopping Cart**: Add, update, and remove items with real-time calculations
- **Checkout Flow**: Complete form validation with shipping and payment details
- **Order History**: Track past orders and purchases
- **User Profile**: Account management and preferences
- **Search & Filter**: Advanced product search and filtering capabilities
- **Custom Alert System**: Cross-platform alert/modal system
- **Accessibility**: Full ARIA labels and accessibility support

### Design Features

- Material Design-inspired components
- Smooth animations and transitions
- Shadow system for depth and hierarchy
- Consistent spacing and typography
- Color-coded categories and status indicators

### Getting Started (Frontend)

```bash
cd frontend
npm install
npm run web       # Start web development server
npm run ios       # Start iOS simulator (requires macOS)
npm run android   # Start Android emulator
```

### Available Scripts (Frontend)

- `npm run web` - Start Expo web server on http://localhost:8000
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Backend (Coming Soon)

The backend API will provide:
- User authentication and authorization
- Product management
- Order processing
- Payment integration
- Database management
- API endpoints for frontend consumption

## Environment Setup

### Prerequisites

- Node.js 18+ and npm
- Expo CLI
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

### Development URLs

- Frontend (Web): http://localhost:8000
- Frontend (Dev Server): http://localhost:8081
- Backend API: (Coming soon)

## Project Highlights

### Component Architecture

The frontend uses a modular component architecture with:
- Reusable UI components (Button, Input, Card, Alert, etc.)
- Feature-based organization
- Shared utilities and hooks
- Context providers for global state

### Theme System

Dynamic theming with three modes:
- **Light Mode**: Bright, clean interface
- **Dark Mode**: Eye-friendly dark interface
- **Auto Mode**: Follows system preference

### Validation & Security

- Client-side form validation
- Input sanitization
- Credit card validation
- Email and phone validation
- Secure payment handling (simulated)

### Responsive Breakpoints

- Mobile: < 768px
- Desktop: ≥ 768px
- Adaptive layouts for optimal viewing

## Development Status

- ✅ Frontend: Core features complete
- ✅ UI/UX: Design system implemented
- ✅ Theme System: Light/Dark mode functional
- ✅ Cart System: Full functionality
- ✅ Checkout Flow: Complete with validation
- 🚧 Backend: In planning
- 🚧 Payment Integration: Pending
- 🚧 User Authentication: Pending

## Contributing

This is a personal project. If you'd like to contribute or provide feedback, please reach out.

## License

All rights reserved.

## Contact

For inquiries about this project, please contact the repository owner.

---

**Note**: This is a demonstration/portfolio project. Payment processing is simulated and no real transactions occur.
