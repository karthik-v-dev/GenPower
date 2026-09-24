# GenPower - Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (for production)
- Git (optional)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React & React DOM
- Redux Toolkit & React Redux
- Firebase
- Material-UI
- React Router DOM
- React Hook Form & Yup
- TypeScript
- Vite

### 2. Configure Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Realtime Database
5. Copy your configuration

#### Database Rules (Development)
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

#### Database Rules (Production - More Secure)
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'owner'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'owner'"
      }
    },
    "generators": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'owner'"
    },
    "leases": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "purchases": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "services": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "spareParts": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('role').val() === 'owner'"
    },
    "sparePartOrders": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## Initial Data Setup

The application uses mock data for generators and spare parts. When you connect Firebase:

1. The mock data will automatically populate on first load
2. You can modify the mock data in `src/services/mockData.service.ts`
3. For production, implement proper data seeding scripts

## Testing the Application

### Test User Accounts
Create test accounts via the registration page:

1. **Owner Account**
   - Register with role: "Owner"
   - Can manage generators, view all requests
   
2. **Customer Account**
   - Register with role: "Customer"
   - Can browse, request leases, make purchases, request service

### Features to Test

1. **Authentication**
   - Register new account
   - Login
   - Logout

2. **Generators**
   - Browse generator catalog
   - Filter by type, fuel, status
   - Search by name/model
   - View generator details

3. **Leasing**
   - Request generator lease
   - Select lease period
   - Provide project details

4. **Purchase**
   - Purchase generator
   - Select payment method
   - Provide delivery details

5. **Service**
   - Request service
   - Select service type
   - Schedule preferred time

6. **Spare Parts**
   - Browse parts catalog
   - Add to cart
   - Checkout

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port.

### Firebase Connection Issues
- Verify environment variables are correct
- Check Firebase project is active
- Ensure Authentication and Database are enabled

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### TypeScript Errors
- Ensure all types are properly defined
- Check import paths
- Restart TypeScript server in your IDE

## Development Tips

1. Use React DevTools for debugging
2. Use Redux DevTools for state inspection
3. Check browser console for errors
4. Firebase console for database inspection

## Next Steps

1. Implement remaining pages (lease, purchase, service, spare parts detail pages)
2. Add form validation
3. Implement owner dashboard
4. Add real-time updates
5. Implement image upload
6. Add email notifications
7. Implement payment gateway
8. Add analytics
