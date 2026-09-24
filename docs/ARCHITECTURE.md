# GenPower - Architecture Documentation

## Overview
GenPower is a comprehensive web application for generator leasing, purchasing, selling, service, and spare parts management. Built with React, TypeScript, Vite, Redux Toolkit, Firebase, and Tailwind CSS.

## Technology Stack

### Frontend
- **React 19**: UI library
- **TypeScript 6**: Type-safe development
- **Vite 8**: Build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS framework
- **Material-UI (MUI)**: Component library (transitioning to Tailwind)
- **Redux Toolkit**: State management with Thunk
- **React Router v7**: Navigation
- **React Hook Form + Yup**: Form validation

### Styling
- **Tailwind CSS**: Primary styling solution
- **@tailwindcss/postcss**: PostCSS integration
- **Dark Mode**: Class-based with system preference detection
- **Responsive**: Mobile-first design approach

### Backend
- **Firebase Auth**: Authentication (Email/Password)
- **Firebase Realtime Database**: Data storage
- **Firebase Analytics**: User analytics (configured)

## Project Structure

```
src/
├── components/          # Shared components
│   ├── UI/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── TextField.tsx
│   └── Layout/         # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── MainLayout.tsx
├── features/           # Feature-based modules
│   ├── auth/          # Authentication pages
│   ├── generators/    # Generator listing/details
│   ├── lease/         # Lease management
│   ├── purchase/      # Purchase management
│   ├── service/       # Service requests
│   └── spareParts/    # Spare parts catalog
├── store/             # Redux store
│   ├── slices/       # Redux slices
│   └── index.ts      # Store configuration
├── services/         # API and business logic
│   ├── firebase.service.ts
│   ├── auth.service.ts
│   └── mockData.service.ts
├── hooks/            # Custom React hooks
│   ├── useAppDispatch.ts
│   └── useAppSelector.ts
├── types/            # TypeScript type definitions
│   ├── user.types.ts
│   ├── generator.types.ts
│   ├── lease.types.ts
│   ├── purchase.types.ts
│   ├── service.types.ts
│   └── spareParts.types.ts
├── constants/        # App constants
│   └── index.ts
└── assets/          # Static assets
    └── images/
```

## Design Principles

### 1. Type Safety
- **No `any` types**: Every object has strict TypeScript types
- Interfaces and types defined in `types/` directory
- Type-safe Redux with typed hooks

### 2. Component Reusability
- UI components in `components/UI/` are fully reusable
- Consistent prop interfaces
- Composition over inheritance

### 3. Separation of Concerns
- Features organized by domain
- Services layer for business logic
- Redux slices for state management
- Components focus on presentation

### 4. Clean Code
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Clear naming conventions
- Consistent code formatting

## State Management

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  generators: {
    generators: Generator[],
    selectedGenerator: Generator | null,
    isLoading: boolean,
    error: string | null,
    filter: GeneratorFilter
  },
  spareParts: {
    parts: SparePart[],
    cart: SparePartOrderItem[],
    orders: SparePartOrder[],
    selectedPart: SparePart | null,
    isLoading: boolean,
    error: string | null
  }
}
```

### Async Operations
- Redux Thunk for async actions
- Consistent loading/error states
- Optimistic updates where appropriate

## Authentication Flow

1. User registers/logs in via Firebase Auth
2. User data stored in Firebase Realtime Database
3. Authentication state managed in Redux
4. Protected routes check authentication status
5. Role-based access control (Owner/Customer)

## Data Flow

1. **User Action** → Component
2. **Dispatch** → Redux Action
3. **Thunk** → Service Layer
4. **Service** → Firebase API
5. **Response** → Redux State Update
6. **State Change** → Component Re-render

## Mobile Responsiveness

- Mobile-first design approach
- MUI's responsive grid system
- Breakpoints: xs, sm, md, lg, xl
- Touch-friendly UI elements
- Hamburger menu for mobile navigation

## Performance Optimizations

- Lazy loading for routes
- Image optimization
- Memoized selectors
- Code splitting
- Efficient re-rendering

## Security

- Firebase Authentication
- Secure API calls
- Input validation
- XSS prevention
- CSRF protection

## Testing Strategy (Future)

- Unit tests for utilities and services
- Component tests with React Testing Library
- Integration tests for Redux flows
- E2E tests with Playwright

## Deployment

- Build command: `npm run build`
- Preview: `npm run preview`
- Deploy to Firebase Hosting, Vercel, or Netlify


### Localization
- **Country**: India
- **Currency**: INR (₹)
- **Number Format**: Indian lakh system (1,00,000)
- **Tax**: 18% GST
- **Phone Format**: +91 XXXXX XXXXX

## Core Features

### 1. Theme System
- **Light Mode**: Default light theme
- **Dark Mode**: High-contrast dark theme
- **System Mode**: Auto-detects OS preference
- **Persistence**: Saves to localStorage
- **Smooth Transitions**: CSS transitions for theme changes

### 2. Authentication
- **User Registration**: Email/password with role selection
- **User Login**: Secure authentication
- **Role-based Access**: Owner vs Customer permissions
- **Session Management**: Firebase handles tokens
- **Profile Data**: Stored in Realtime Database

### 3. Generator Catalog
- **Portable Generators Only**: 2-15 kW range
- **Advanced Filters**: Search, fuel type, status
- **Indian Manufacturers**: Honda, Yamaha, Kirloskar, Mahindra, Greaves
- **INR Pricing**: Indian rupee with lakh formatting
- **Location**: Major Indian cities

### 4. State Management
- **Redux Toolkit**: Centralized state
- **Redux Thunk**: Async operations
- **Typed Actions**: Full TypeScript support
- **Slices**: auth, generators, spareParts

## Project Structure (Enhanced)

```
GenPower/
├── public/
│   ├── favicon.svg              # Custom favicon
│   └── ...
├── src/
│   ├── components/
│   │   ├── UI/                  # Reusable components
│   │   │   ├── Button.tsx       # Custom button
│   │   │   ├── Card.tsx         # Enhanced card
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── TextField.tsx
│   │   └── Layout/              # Layout components
│   │       ├── Header.tsx       # Navigation + theme switcher
│   │       ├── Footer.tsx       # Footer with contact
│   │       └── MainLayout.tsx   # Main wrapper
│   │
│   ├── contexts/                # React contexts
│   │   └── ThemeContext.tsx    # Theme management
│   │
│   ├── features/                # Feature modules
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── generators/
│   │   │   ├── HomePage.tsx
│   │   │   └── GeneratorsPage.tsx
│   │   ├── lease/              # To implement
│   │   ├── purchase/           # To implement
│   │   ├── service/            # To implement
│   │   └── spareParts/         # To implement
│   │
│   ├── store/                  # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── generatorSlice.ts
│   │   │   └── sparePartsSlice.ts
│   │   └── index.ts            # Store config
│   │
│   ├── services/               # API and business logic
│   │   ├── firebase.service.ts
│   │   ├── auth.service.ts
│   │   └── mockData.service.ts # Indian generators
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAppDispatch.ts
│   │   └── useAppSelector.ts
│   │
│   ├── types/                  # TypeScript definitions
│   │   ├── user.types.ts
│   │   ├── generator.types.ts  # Portable only
│   │   ├── lease.types.ts
│   │   ├── purchase.types.ts
│   │   ├── service.types.ts
│   │   └── spareParts.types.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── currency.ts         # INR formatting
│   │   └── index.ts
│   │
│   ├── constants/              # App constants
│   │   └── index.ts            # India config
│   │
│   ├── assets/                 # Static assets
│   │   └── images/
│   │
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Tailwind directives
│   └── vite-env.d.ts           # Type definitions
│
├── docs/                       # Documentation
│   ├── skills/                 # Feature-specific docs
│   │   ├── authentication.md
│   │   ├── generators.md
│   │   └── theme-system.md
│   ├── ARCHITECTURE.md         # This file
│   ├── SETUP.md                # Setup guide
│   └── SKILLS.md               # Development patterns
│
├── .env                        # Firebase config (configured)
├── .env.example                # Template
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS + Tailwind
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # Project overview
```

## Design Principles (Updated)

### 1. Type Safety
- **No `any` types**: Every object has strict TypeScript types
- **Interfaces and types**: Defined in `types/` directory
- **Type-safe Redux**: Typed hooks and actions
- **Generic utilities**: Typed helper functions

### 2. Component Reusability
- **UI components**: Fully reusable in `components/UI/`
- **Tailwind classes**: Utility-first approach
- **Composition**: Component composition over inheritance
- **Props interfaces**: Clear, typed prop definitions

### 3. Separation of Concerns
- **Features by domain**: Clear feature boundaries
- **Services layer**: Business logic separation
- **Redux slices**: State management by feature
- **Context API**: Cross-cutting concerns (theme)

### 4. Clean Code
- **Single Responsibility**: Each file has one purpose
- **DRY principle**: No code duplication
- **Clear naming**: Descriptive variable/function names
- **Consistent formatting**: Automated linting

### 5. Performance
- **Lazy loading**: Route-based code splitting
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search and filter operations
- **Image optimization**: Lazy load below fold

## State Management (Enhanced)

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  generators: {
    generators: Generator[],  // Portable only
    selectedGenerator: Generator | null,
    isLoading: boolean,
    error: string | null,
    filter: GeneratorFilter
  },
  spareParts: {
    parts: SparePart[],
    cart: SparePartOrderItem[],
    orders: SparePartOrder[],
    selectedPart: SparePart | null,
    isLoading: boolean,
    error: string | null
  }
}
```

### Theme State (Context)
```typescript
{
  theme: 'light' | 'dark' | 'system',
  isDark: boolean,
  setTheme: (theme: ThemeMode) => void
}
```

## Styling Architecture

### Tailwind CSS
```typescript
// Utility-first classes
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
</div>
```

### Dark Mode Classes
```typescript
// Background
bg-white dark:bg-gray-900

// Text
text-gray-900 dark:text-gray-100

// Borders
border-gray-300 dark:border-gray-700

// Hover
hover:bg-gray-100 dark:hover:bg-gray-800
```

### Responsive Design
```typescript
// Mobile-first approach
<div className="
  text-base       /* Default (mobile) */
  md:text-lg      /* Tablet */
  lg:text-xl      /* Desktop */
">
```

## Authentication Flow (Enhanced)

1. **Registration**
   - User fills form (India defaults)
   - Client-side validation
   - Firebase Auth creates account
   - User data stored in Realtime Database
   - Auto-login and redirect

2. **Login**
   - Email/password authentication
   - Firebase Auth verification
   - Fetch user profile
   - Store in Redux state
   - Redirect to dashboard

3. **Session Management**
   - Firebase handles tokens
   - Auto-refresh on page load
   - Logout clears all state

## Data Flow (Enhanced)

1. **User Action** → Component
2. **Dispatch** → Redux Action (Thunk)
3. **Thunk** → Service Layer
4. **Service** → Firebase API / Mock Data
5. **Response** → Redux State Update
6. **State Change** → Component Re-render
7. **UI Update** → User sees changes

## Mobile Responsiveness (Enhanced)

### Breakpoints
```typescript
sm: '640px',   // Mobile landscape
md: '768px',   // Tablet
lg: '1024px',  // Desktop
xl: '1280px',  // Large desktop
2xl: '1536px'  // Extra large
```

### Features
- Mobile-first CSS
- Touch-friendly tap targets (44x44px minimum)
- Responsive images
- Hamburger menu for mobile
- Swipe gestures (future)

## Currency Formatting (India)

### Utilities
```typescript
// Format as INR currency
formatCurrency(150000) → "₹1,50,000.00"

// Simple price format
formatPrice(150000) → "₹1,50,000"
```

### Indian Number System
```typescript
// Lakh system
1,00,000 = 1 lakh
10,00,000 = 10 lakhs
1,00,00,000 = 1 crore
```

## Firebase Configuration

### Environment Variables
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=genpower-46b1a.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://genpower-46b1a-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=genpower-46b1a
VITE_FIREBASE_STORAGE_BUCKET=genpower-46b1a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=932243642864
VITE_FIREBASE_APP_ID=1:932243642864:web:8c3a92533312340430a535
VITE_FIREBASE_MEASUREMENT_ID=G-QKX8XMDHDV
```

### Database Structure
```
/users/{userId}
  - id, email, role, firstName, lastName, phone, address, etc.
  
/generators/{generatorId}
  - All generator details (portable only)
  
/leases/{leaseId}
  - Lease requests and agreements
  
/purchases/{purchaseId}
  - Purchase orders
  
/services/{serviceId}
  - Service requests
  
/spareParts/{partId}
  - Spare parts catalog
  
/sparePartOrders/{orderId}
  - Spare parts orders
```

## Performance Optimizations (Enhanced)

### Code Splitting
```typescript
// Lazy load routes
const GeneratorsPage = lazy(() => import('./features/generators/GeneratorsPage'));
```

### Image Optimization
- Copyright-free images from Unsplash
- WebP format support
- Lazy loading below fold
- Responsive images with srcset

### Caching
- Redux persists state
- LocalStorage for theme
- Service worker (future)

## Security (Enhanced)

### Firebase Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "generators": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'owner'"
    }
  }
}
```

### Input Validation
- Client-side: React Hook Form + Yup
- Server-side: Firebase Security Rules
- XSS prevention: React escapes by default
- CSRF protection: Firebase handles

## Testing Strategy

### Unit Tests
- Component rendering
- Redux actions/reducers
- Utility functions
- Service methods

### Integration Tests
- User flows (register, login)
- Redux flow (action → reducer → state)
- API integration

### E2E Tests (Future)
- Critical user paths
- Cross-browser testing
- Mobile testing

## Deployment

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Deploy Options
- **Firebase Hosting**: Integrated with Firebase
- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment
- **Custom Server**: Nginx/Apache

## Monitoring & Analytics

### Firebase Analytics
- Page views
- User interactions
- Conversion tracking
- Performance monitoring

### Error Tracking (Future)
- Sentry integration
- Error boundaries
- Console error logging

## Future Architecture

### Micro-frontends
- Separate builds for features
- Independent deployments
- Team scalability

### PWA
- Offline support
- Push notifications
- App-like experience
- Install to home screen

### Real-time Features
- Live availability updates
- Real-time chat support
- Notification system
- WebSocket connections

## Documentation Structure

### Code Documentation
- TSDoc comments
- Type definitions
- Inline comments for complex logic

### Feature Documentation
- `docs/skills/*.md` for each feature
- Architecture overview
- API documentation
- User guides

## Maintenance

### Code Quality
- ESLint for linting
- Prettier for formatting (future)
- TypeScript strict mode
- Code reviews

### Dependencies
- Regular updates
- Security audits
- Version pinning
- Deprecation tracking

### Performance
- Lighthouse audits
- Bundle size monitoring
- Runtime performance
- User feedback

---

## Quick Reference

### Key Technologies
- React 19 + TypeScript 6
- Vite 8 + Tailwind CSS 4
- Redux Toolkit + Firebase
- India localization (INR, GST)

### Core Features
- Theme system (Light/Dark/System)
- Authentication (Owner/Customer)
- Portable generators catalog
- Currency formatting (Indian)

### Getting Started
1. Install: `npm install`
2. Configure: `.env` with Firebase
3. Run: `npm run dev`
4. Build: `npm run build`

---

**Last Updated**: September 24, 2026
**Version**: 1.0.0
