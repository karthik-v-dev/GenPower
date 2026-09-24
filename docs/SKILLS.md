# GenPower - Skills & Development Guide

## Agentic Skills Documentation

This document outlines the development skills, patterns, and best practices used in the GenPower project.

## TypeScript Best Practices

### 1. Strict Type Safety
```typescript
// ✅ Good - Explicit types
interface User {
  id: string;
  email: string;
  role: UserRole;
}

// ❌ Bad - Using any
const user: any = getData();
```

### 2. Enum Usage
```typescript
// Use enums for fixed sets of values
export enum UserRole {
  OWNER = 'owner',
  CUSTOMER = 'customer',
}

export enum GeneratorStatus {
  AVAILABLE = 'available',
  LEASED = 'leased',
  SOLD = 'sold',
}
```

### 3. Type Exports
```typescript
// Always export types for reusability
export interface Generator {
  id: string;
  name: string;
  // ...
}

export type GeneratorFilter = {
  search?: string;
  type?: GeneratorType;
};
```

## React Component Patterns

### 1. Functional Components with TypeScript
```typescript
interface ButtonProps {
  isLoading?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  children: React.ReactNode;
}

export const Button = ({ isLoading, children, ...props }: ButtonProps): JSX.Element => {
  return <MuiButton {...props}>{children}</MuiButton>;
};
```

### 2. Custom Hooks
```typescript
// Custom typed hooks for Redux
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3. Event Handlers
```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();
  // Handle form submission
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

## Redux Patterns

### 1. Slice Structure
```typescript
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Async thunk handlers
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      });
  },
});
```

### 2. Async Thunks
```typescript
export const fetchGenerators = createAsyncThunk(
  'generators/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getGenerators();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
```

### 3. Typed Selectors
```typescript
const { user, isLoading } = useAppSelector((state) => state.auth);
const { generators } = useAppSelector((state) => state.generators);
```

## Service Layer Patterns

### 1. Service Classes
```typescript
class AuthService {
  async register(data: RegisterData): Promise<User> {
    // Implementation
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // Implementation
  }
}

export const authService = new AuthService();
```

### 2. Firebase Integration
```typescript
import { ref, set, get } from 'firebase/database';
import { database } from './firebase.service';

await set(ref(database, `users/${userId}`), userData);
const snapshot = await get(ref(database, `users/${userId}`));
```

## Component Organization

### 1. Feature-Based Structure
```
features/
  auth/
    LoginPage.tsx
    RegisterPage.tsx
  generators/
    GeneratorsPage.tsx
    GeneratorDetail.tsx
    HomePage.tsx
```

### 2. Reusable UI Components
```
components/
  UI/
    Button.tsx
    Card.tsx
    TextField.tsx
    LoadingSpinner.tsx
```

### 3. Layout Components
```
components/
  Layout/
    Header.tsx
    Footer.tsx
    MainLayout.tsx
```

## Styling Patterns

### 1. Material-UI sx Prop
```typescript
<Box sx={{ 
  display: 'flex', 
  justifyContent: 'center',
  mt: 4,
  px: { xs: 2, md: 4 }  // Responsive
}}>
```

### 2. Styled Components
```typescript
const StyledCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));
```

### 3. Responsive Design
```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

<Typography variant={isMobile ? 'h5' : 'h3'}>
```

## Form Handling

### 1. Controlled Components
```typescript
const [formData, setFormData] = useState<LoginCredentials>({
  email: '',
  password: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
```

### 2. Form Validation
```typescript
if (formData.password !== formData.confirmPassword) {
  setValidationError('Passwords do not match');
  return;
}
```

## Error Handling

### 1. Try-Catch Pattern
```typescript
try {
  const result = await dispatch(loginUser(credentials));
  if (loginUser.fulfilled.match(result)) {
    navigate(ROUTES.DASHBOARD);
  }
} catch (error) {
  console.error('Login failed:', error);
}
```

### 2. Error Display
```typescript
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
```

## Performance Optimization

### 1. Conditional Rendering
```typescript
if (isLoading) {
  return <LoadingSpinner fullPage />;
}
```

### 2. Efficient Filtering
```typescript
const filteredGenerators = generators.filter((gen: Generator) => {
  if (filters.type && gen.type !== filters.type) return false;
  if (filters.search) {
    return gen.name.toLowerCase().includes(filters.search.toLowerCase());
  }
  return true;
});
```

## Constants Management

### 1. Route Constants
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  GENERATORS: '/generators',
  // ...
} as const;
```

### 2. Configuration Constants
```typescript
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  GENERATORS: 'generators',
  // ...
} as const;
```

## Testing Considerations

### 1. Component Testing
```typescript
// Future: Test component rendering
// Future: Test user interactions
// Future: Test state changes
```

### 2. Service Testing
```typescript
// Future: Test API calls
// Future: Test error handling
// Future: Test data transformation
```

## Security Best Practices

### 1. Environment Variables
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // Never commit actual values
};
```

### 2. Input Validation
```typescript
if (formData.password.length < 8) {
  setValidationError('Password must be at least 8 characters');
  return;
}
```

### 3. Role-Based Access
```typescript
if (user?.role !== UserRole.OWNER) {
  // Restrict access
}
```

## Code Quality

### 1. Naming Conventions
- Components: PascalCase (`GeneratorsPage`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`FIREBASE_COLLECTIONS`)
- Types/Interfaces: PascalCase (`Generator`, `UserRole`)

### 2. File Naming
- Components: PascalCase (`Header.tsx`)
- Services: camelCase.service.ts (`auth.service.ts`)
- Types: camelCase.types.ts (`user.types.ts`)
- Constants: lowercase (`index.ts`)

### 3. Import Organization
```typescript
// External imports
import { useState } from 'react';
import { Box, Typography } from '@mui/material';

// Internal imports
import { Button } from '../../components/UI';
import { useAppSelector } from '../../hooks';
import { ROUTES } from '../../constants';
```

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase rules updated
- [ ] Build runs successfully
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Mobile responsiveness tested
- [ ] Authentication flow tested
- [ ] All features functional

## Maintenance Tasks

### Regular Updates
- Keep dependencies up to date
- Monitor Firebase usage
- Review and optimize performance
- Update documentation
- Add new features incrementally

### Code Review Points
- Type safety maintained
- No code duplication
- Consistent formatting
- Proper error handling
- Accessibility maintained
