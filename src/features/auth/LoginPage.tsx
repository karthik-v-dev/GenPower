import { useState, FormEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  Link as MuiLink,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button } from '../../components/UI';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { ROUTES } from '../../constants';
import { LoginCredentials, UserRole } from '../../types';

export const LoginPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      const loggedInUser = result.payload;
      const isOwner =
        loggedInUser?.role === UserRole.OWNER ||
        loggedInUser?.email?.toLowerCase() === 'voorugondakarthik@gmail.com';

      // Check if there's a redirect URL stored
      const redirectTo = sessionStorage.getItem('redirectAfterLogin');
      if (redirectTo && (!redirectTo.includes('dashboard') || isOwner)) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
      } else if (isOwner) {
        navigate(ROUTES.DASHBOARD);
      } else {
        navigate(ROUTES.HOME);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Access your GenPower account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              isLoading={isLoading}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <MuiLink component={Link} to={ROUTES.REGISTER} underline="hover">
                  Register here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
