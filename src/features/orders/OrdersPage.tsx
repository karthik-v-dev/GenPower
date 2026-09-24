import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Paper,
} from '@mui/material';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  PictureAsPdf as PdfIcon,
  ShoppingBag as ShoppingBagIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { OrderListView } from './OrderListView';
import { ROUTES } from '../../constants';
import { useAppSelector } from '../../hooks';
import { UserRole } from '../../types';
import { TermsModal } from '../../components/UI/TermsModal';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const isOwner =
    user?.role === UserRole.OWNER ||
    user?.email?.toLowerCase() === 'voorugondakarthik@gmail.com';

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center', borderRadius: 3 }}>
          <ShoppingBagIcon color="primary" sx={{ fontSize: { xs: 48, sm: 64 }, mb: 2 }} />
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: '1.35rem', sm: '1.8rem', md: '2.125rem' } }}
          >
            Sign in to view your Order History
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Please log in with your registered account to track your orders, view order summaries, and access warranty and service schedules.
          </Typography>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => {
                sessionStorage.setItem('redirectAfterLogin', ROUTES.ORDERS);
                navigate(ROUTES.LOGIN);
              }}
              size="medium"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 180 },
                py: { xs: 1, sm: 1.25 },
                fontWeight: 600,
              }}
            >
              Login to GenPower
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.REGISTER)}
              size="medium"
              sx={{
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 180 },
                py: { xs: 1, sm: 1.25 },
                fontWeight: 600,
              }}
            >
              Create New Account
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to={ROUTES.HOME} underline="hover" color="inherit">
          Home
        </MuiLink>
        {isOwner ? (
          <MuiLink component={Link} to={ROUTES.DASHBOARD} underline="hover" color="inherit">
            Dashboard
          </MuiLink>
        ) : null}
        <Typography color="text.primary">
          {isOwner ? 'All Customer Orders Management' : 'My Orders & History'}
        </Typography>
      </Breadcrumbs>

      {/* Header section */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' } }}
          >
            {isOwner ? 'Orders & Fulfillment Management (Store Owner)' : 'My Orders & Order History'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.88rem', sm: '1rem' } }}>
            {isOwner
              ? 'Complete overview of all incoming customer generator purchases, rental leases, and spare parts orders.'
              : `Welcome back, ${user?.firstName || 'Valued Customer'}. Track your orders, delivery status, and view order summaries.`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<PdfIcon color="error" />}
            onClick={() => setTermsModalOpen(true)}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            Terms &amp; Service Policy (PDF)
          </Button>

          {!isOwner && (
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.GENERATORS)}
              sx={{ fontWeight: 600, textTransform: 'none' }}
            >
              Explore Generators
            </Button>
          )}
        </Box>
      </Box>

      {/* Order List / Management View */}
      <OrderListView />

      {/* Terms Modal */}
      <TermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </Container>
  );
};
