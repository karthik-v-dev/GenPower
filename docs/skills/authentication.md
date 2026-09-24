# Authentication Feature - Skills Documentation

## Overview
The authentication system provides secure user registration and login functionality with role-based access control for Owners and Customers.

## Architecture

### Components
- **LoginPage** (`src/features/auth/LoginPage.tsx`)
- **RegisterPage** (`src/features/auth/RegisterPage.tsx`)

### State Management
- **Redux Slice**: `authSlice.ts`
- **Actions**: `loginUser`, `registerUser`, `logoutUser`, `getCurrentUser`
- **State**: `user`, `isAuthenticated`, `isLoading`, `error`

### Services
- **AuthService** (`src/services/auth.service.ts`)
  - `register()` - Create new user account
  - `login()` - Authenticate user
  - `logout()` - Sign out user
  - `getCurrentUser()` - Get authenticated user

## User Roles

### Customer
- Browse generators
- Request leases
- Purchase generators
- Request service
- Order spare parts

### Owner
- All customer permissions
- Manage generator inventory
- View all requests
- Process orders
- Manage spare parts

## Implementation Details

### Registration Flow
1. User fills registration form
2. Form validation (password match, field validation)
3. Dispatch `registerUser` action
4. Create Firebase Auth account
5. Store user data in Realtime Database
6. Auto-login after registration
7. Redirect to dashboard

### Login Flow
1. User enters email and password
2. Dispatch `loginUser` action
3. Authenticate with Firebase Auth
4. Fetch user data from database
5. Store user in Redux state
6. Redirect to dashboard

### Data Structure

```typescript
interface User {
  id: string;
  email: string;
  role: UserRole; // 'owner' | 'customer'
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- Validated on client side
- Stored securely in Firebase Auth

### Session Management
- Firebase handles authentication tokens
- Auto-refresh on page reload
- Secure logout clears all data

### Protected Routes
```typescript
// Check authentication before rendering
const { isAuthenticated } = useAppSelector((state) => state.auth);

if (!isAuthenticated) {
  navigate(ROUTES.LOGIN);
}
```

## Form Validation

### Registration
- Email format validation
- Password strength check
- Password confirmation match
- Phone number format (Indian: +91)
- Required fields validation

### Login
- Email format validation
- Required fields

## Error Handling

### Registration Errors
- Email already exists
- Weak password
- Network errors
- Database write errors

### Login Errors
- Invalid credentials
- User not found
- Network errors
- Account disabled

## Firebase Integration

### Authentication
```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
await createUserWithEmailAndPassword(auth, email, password);
```

### Database Storage
```typescript
import { ref, set } from 'firebase/database';
await set(ref(database, `users/${userId}`), userData);
```

## Best Practices

### Security
1. Never store passwords in plain text
2. Validate all inputs
3. Use HTTPS only
4. Implement rate limiting (Firebase handles this)
5. Validate email addresses

### User Experience
1. Show loading states
2. Display clear error messages
3. Auto-focus on first input
4. Remember user email (optional)
5. Smooth transitions

### Code Quality
1. Type-safe with TypeScript
2. Centralized error handling
3. Reusable form components
4. Consistent validation rules
5. Clean separation of concerns

## Usage Examples

### Registration
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const result = await dispatch(registerUser(formData));
  if (registerUser.fulfilled.match(result)) {
    navigate(ROUTES.DASHBOARD);
  }
};
```

### Login
```typescript
const result = await dispatch(loginUser(credentials));
if (loginUser.fulfilled.match(result)) {
  navigate(ROUTES.DASHBOARD);
}
```

### Logout
```typescript
await dispatch(logoutUser());
navigate(ROUTES.HOME);
```

### Check Authentication
```typescript
const { isAuthenticated, user } = useAppSelector((state) => state.auth);

if (isAuthenticated) {
  console.log(`Logged in as: ${user?.email}`);
}
```

## Testing Scenarios

### Registration
1. Valid registration → Success
2. Duplicate email → Error
3. Password mismatch → Validation error
4. Missing required fields → Validation error
5. Invalid email format → Validation error

### Login
1. Valid credentials → Success
2. Invalid password → Error
3. Non-existent email → Error
4. Empty fields → Validation error

## Future Enhancements

1. Email verification
2. Password reset
3. Two-factor authentication
4. Social login (Google, Facebook)
5. Profile picture upload
6. Account settings page
7. Change password
8. Delete account
9. Session timeout
10. Remember me functionality

## Troubleshooting

### Common Issues

**Error: Email already exists**
- Solution: Use different email or login

**Error: Weak password**
- Solution: Use minimum 8 characters

**Error: Network error**
- Solution: Check internet connection

**Error: Firebase not initialized**
- Solution: Check `.env` configuration

## Performance Considerations

1. Lazy load auth pages
2. Cache user data in Redux
3. Minimize re-renders
4. Debounce validation
5. Optimize form inputs

## Accessibility

1. Proper form labels
2. ARIA attributes
3. Keyboard navigation
4. Screen reader support
5. Focus management
6. Error announcements

## Mobile Responsiveness

1. Touch-friendly inputs
2. Proper viewport settings
3. Responsive form layout
4. Large tap targets
5. Mobile keyboard optimization
