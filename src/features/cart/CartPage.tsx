import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCartOutlined,
  ArrowBack,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removeFromCart, updateCartQuantity, clearCart } from '../../store/slices/sparePartsSlice';
import { createOrder } from '../../store/slices/orderSlice';
import { UnifiedOrder } from '../../types/order.types';
import { ROUTES, TAX_RATE, SHIPPING_RATES } from '../../constants';
import { TermsAgreementCheckbox } from '../../components/UI';
import { TERMS_AND_CONDITIONS } from '../../constants/terms';
import { toast } from 'react-toastify';

export const CartPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.spareParts);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<string>('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Save intended destination
      sessionStorage.setItem('redirectAfterLogin', ROUTES.CART);
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = (partId: string, currentQty: number, delta: number): void => {
    const newQty = Math.max(1, currentQty + delta);
    dispatch(updateCartQuantity({ partId, quantity: newQty }));
  };

  const handleRemoveItem = (partId: string): void => {
    dispatch(removeFromCart(partId));
  };

  const handleClearCart = (): void => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = (): void => {
    if (!termsAccepted) {
      setTermsError('You must read and agree to the Terms & Conditions before placing your order');
      toast.error('Please read and agree to the Terms & Conditions before placing your order.');
      return;
    }

    const newOrder: UnifiedOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `GP-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderType: 'spare_parts',
      customerId: user?.id || 'guest',
      customerName: user ? `${user.firstName} ${user.lastName}` : 'Customer',
      customerEmail: user?.email || 'customer@example.com',
      customerPhone: user?.phone || '+91 9800000000',
      items: cart.map((item) => ({
        id: item.partId,
        name: item.partName,
        modelOrPartNumber: item.partNumber,
        category: 'Spare Parts',
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      subtotal,
      taxAmount: gst,
      shippingOrInstallationAmount: shipping,
      totalAmount: total,
      shippingAddress: {
        street: user?.address || 'Main Road',
        city: user?.city || 'Warangal',
        state: user?.state || 'Telangana',
        pincode: user?.zipCode || '506002',
        country: user?.country || 'India',
      },
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      status: 'pending',
      notes: 'Spare parts order placed from cart.',
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: TERMS_AND_CONDITIONS.version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(createOrder(newOrder));
    dispatch(clearCart());
    setTermsAccepted(false);
    toast.success('Order placed successfully! Viewing your orders.');
    navigate(ROUTES.ORDERS);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const gst = subtotal * TAX_RATE;
  const shipping = subtotal > 0 ? SHIPPING_RATES.standard : 0;
  const total = subtotal + gst + shipping;

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return <></>;
  }

  if (cart.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingCartOutlined sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Browse our spare parts catalog and add items to your cart
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(ROUTES.SPARE_PARTS)}
            sx={{ mt: 2 }}
          >
            Browse Spare Parts
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(ROUTES.SPARE_PARTS)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClearCart}
          disabled={cart.length === 0}
        >
          Clear Cart
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Part Details</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.partId}>
                      {/* Part Details */}
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {item.partName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Part# {item.partNumber}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Quantity Controls */}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.partId, item.quantity, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 2, minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.partId, item.quantity, 1)}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>

                      {/* Unit Price */}
                      <TableCell align="right">
                        <Typography variant="body2">
                          ₹{item.unitPrice.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>

                      {/* Total Price */}
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600}>
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.partId)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Continue Shopping */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(ROUTES.SPARE_PARTS)}
            >
              Continue Shopping
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Order Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Subtotal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal ({cart.length} items)</Typography>
              <Typography variant="body2">
                ₹{subtotal.toLocaleString('en-IN')}
              </Typography>
            </Box>

            {/* GST */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">GST (18%)</Typography>
              <Typography variant="body2">
                ₹{gst.toLocaleString('en-IN')}
              </Typography>
            </Box>

            {/* Shipping */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Shipping</Typography>
              <Typography variant="body2">
                ₹{shipping.toLocaleString('en-IN')}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                ₹{total.toLocaleString('en-IN')}
              </Typography>
            </Box>

            {/* Terms and Conditions Agreement */}
            <Box sx={{ mb: 2.5 }}>
              <TermsAgreementCheckbox
                checked={termsAccepted}
                onChange={(checked) => {
                  setTermsAccepted(checked);
                  if (checked) setTermsError('');
                }}
                error={termsError}
              />
            </Box>

            {/* Checkout Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={!termsAccepted}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            {/* Shipping Info */}
            <Alert severity="info" sx={{ mt: 2 }}>
              Free delivery for orders above ₹10,000
            </Alert>

            {/* Payment Methods */}
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  We Accept:
                </Typography>
                <Typography variant="body2">
                  💳 Card • 📱 UPI • 🏦 Net Banking • 💵 Cash on Delivery
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
