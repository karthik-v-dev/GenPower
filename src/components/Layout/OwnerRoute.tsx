import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { UserRole } from '../../types/user.types';
import { ROUTES } from '../../constants';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { Security as SecurityIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface OwnerRouteProps {
  children?: React.ReactNode;
}

export const OwnerRoute: React.FC<OwnerRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <></>;
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('redirectAfterLogin', ROUTES.DASHBOARD);
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const isOwner =
    user?.role === UserRole.OWNER ||
    user?.email?.toLowerCase() === 'voorugondakarthik@gmail.com';

  if (!isOwner) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              mb: 2,
            }}
          >
            <SecurityIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Owner Access Only
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The Product Management & Admin Dashboard is strictly reserved for the store owner.
            Customers can explore our generator catalog, spare parts, and rental services.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate(ROUTES.HOME)}
            sx={{ mt: 2, px: 3, py: 1 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
