# GenPower - Latest Updates

## ✅ Completed Changes

### 1. **Firebase Configuration** ✅
- Updated `.env` with your Firebase credentials
- Database URL: `https://genpower-46b1a-default-rtdb.firebaseio.com`
- Project ID: `genpower-46b1a`
- All Firebase keys configured

### 2. **Tailwind CSS Integration** ✅
- Installed Tailwind CSS, PostCSS, Autoprefixer
- Created `tailwind.config.js` with custom theme
- Created `postcss.config.js`
- Updated `src/index.css` with Tailwind directives
- Dark mode support configured with `class` strategy

### 3. **Dark/Light/System Theme** ✅
- Created `ThemeContext` with system preference detection
- Supports: Light, Dark, System (auto-detects OS preference)
- Theme persists in localStorage
- Automatic switching based on system preference

### 4. **India Localization** ✅
- **Country**: Changed from USA to India
- **Currency**: Changed to INR (₹)
- **Phone**: Indian format (+91)
- **Address**: Mumbai, Maharashtra, India
- **Tax Rate**: 18% GST (Indian standard)
- **Cities**: Mumbai, Delhi, Bangalore, Chennai, Pune, Hyderabad, Kolkata

### 5. **Portable Generators Only** ✅
- Updated `GeneratorType` enum to only include `PORTABLE`
- Updated fuel types to Indian market: Petrol, Diesel, LPG, Dual Fuel
- Updated manufacturers: Honda, Yamaha, Kirloskar, Mahindra, Greaves, Cummins
- Power capacity: 2-15 kW (suitable for portable generators)
- Indian-specific descriptions and specifications

### 6. **Currency Formatting** ✅
- Created `utils/currency.ts` with Indian number formatting
- Format: ₹1,00,000 (Indian lakh system)
- `formatCurrency()` - Full currency format
- `formatPrice()` - Simple price format

### 7. **Mock Data Updates** ✅
- All generators are portable type
- Indian cities as locations
- Indian manufacturers
- Realistic pricing in INR
- Runtime, noise levels, weight in appropriate units

---

## 🎯 How to Use Theme Switcher

You need to add theme switcher UI to the header. Here's the code:

### Add to Header Component:

```typescript
import { useTheme } from '../../contexts/ThemeContext';
import { Brightness4, Brightness7, SettingsBrightness } from '@mui/icons-material';

// Inside Header component:
const { theme, setTheme } = useTheme();

// Add this button in the header:
<IconButton
  onClick={() => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  }}
  color="inherit"
>
  {theme === 'light' && <Brightness7 />}
  {theme === 'dark' && <Brightness4 />}
  {theme === 'system' && <SettingsBrightness />}
</IconButton>
```

---

## 🚀 Next Steps

### 1. Wrap App with ThemeProvider

Update `src/main.tsx`:

```typescript
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

### 2. Use Currency Formatting

In any component showing prices:

```typescript
import { formatPrice } from '../utils';

// Usage:
<Typography>{formatPrice(generator.dailyLeaseRate)}/day</Typography>
<Typography>Purchase: {formatPrice(generator.salePrice)}</Typography>
```

### 3. Start Migration to Tailwind CSS

**Replace MUI components with Tailwind:**

Old (MUI):
```typescript
<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
```

New (Tailwind):
```typescript
<div className="flex justify-center p-4">
```

### 4. Enable Firebase Authentication

In Firebase Console:
1. Go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Click **Save**

### 5. Set Firebase Database Rules

Go to **Realtime Database** → **Rules**:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
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

---

## 📋 Updated Constants

### Currency & Location
```typescript
export const COUNTRY = 'India';
export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';
export const TAX_RATE = 0.18; // 18% GST
```

### Contact Info
```typescript
export const CONTACT_INFO = {
  phone: '+91 98765 43210',
  email: 'info@genpower.co.in',
  address: '123 Generator Street, Mumbai, Maharashtra 400001, India',
};
```

### Fuel Types (Indian Market)
```typescript
export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  DUAL_FUEL = 'dual_fuel',
  LPG = 'lpg',
}
```

---

## 🎨 Tailwind Dark Mode Classes

Use these classes for dark mode styling:

```typescript
// Background
className="bg-white dark:bg-gray-900"

// Text
className="text-gray-900 dark:text-gray-100"

// Borders
className="border-gray-300 dark:border-gray-700"

// Cards
className="bg-gray-50 dark:bg-gray-800"

// Hover
className="hover:bg-gray-100 dark:hover:bg-gray-700"
```

---

## 🔥 Test Your Changes

1. **Run the app**:
   ```bash
   npm run dev
   ```

2. **Test Firebase**:
   - Try registering a new user
   - Check if data appears in Firebase Console → Realtime Database

3. **Test Theme**:
   - Toggle between Light/Dark/System
   - Check if theme persists on page reload
   - Change OS theme and see if System mode responds

4. **Test Currency**:
   - Check generator prices show ₹ symbol
   - Verify Indian number format (lakhs system)

5. **Test Generators**:
   - All should be portable type
   - Fuel options: Petrol, Diesel, LPG
   - Locations should be Indian cities

---

## 📝 TODO: Complete Tailwind Migration

Current components still use MUI. To fully migrate to Tailwind:

1. **Replace MUI components** in:
   - `components/UI/*`
   - `components/Layout/*`
   - `features/**/*.tsx`

2. **Remove MUI dependencies** (optional, after migration):
   ```bash
   npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

3. **Use Tailwind classes** for all styling

---

## ✅ What's Working Now

- ✅ Firebase fully configured
- ✅ Tailwind CSS installed
- ✅ Dark/Light/System theme context ready
- ✅ India localization (INR, Indian cities, phone format)
- ✅ Only portable generators in mock data
- ✅ Currency formatting utilities
- ✅ GST tax rate (18%)

---

## 🎉 Ready to Go!

Your app is now configured for:
- **Firebase Authentication & Database**
- **Tailwind CSS with Dark Mode**
- **Indian Market** (INR, GST, Indian locations)
- **Portable Generators** only

Just wrap your app with `ThemeProvider` and start using the new features!

**Run: `npm run dev`** 🚀
