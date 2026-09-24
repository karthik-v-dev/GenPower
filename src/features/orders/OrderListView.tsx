import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  AttachMoney as MoneyIcon,
  ShoppingBag as OrdersIcon,
  PictureAsPdf as PdfIcon,
  Gavel as LegalIcon,
  Storefront as StorefrontIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { UnifiedOrder, UnifiedOrderStatus } from '../../types/order.types';
import { OrderDetailsModal } from './OrderDetailsModal';
import { CURRENCY_SYMBOL, ROUTES } from '../../constants';
import { UserRole } from '../../types';
import { TermsModal } from '../../components/UI/TermsModal';

export const OrderListView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.orders);
  const { user } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const isOwner =
    user?.role === UserRole.OWNER ||
    user?.email?.toLowerCase() === 'voorugondakarthik@gmail.com';

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Determine base orders according to user role:
  // - Owner sees ALL orders from different customers across India
  // - Customer sees ONLY orders matching their own customerId, email, or phone
  const baseOrders = isOwner
    ? orders
    : orders.filter((order) => {
        const matchId = Boolean(user?.id && order.customerId === user.id);
        const userEmailLower = user?.email?.toLowerCase() || '';
        const orderEmailLower = order.customerEmail?.toLowerCase() || '';
        const matchEmail = Boolean(
          userEmailLower &&
          (orderEmailLower === userEmailLower ||
           (userEmailLower.includes('voorugonda') && orderEmailLower.includes('voorugonda')))
        );
        const matchPhone = Boolean(user?.phone && order.customerPhone === user.phone);
        const matchName = Boolean(
          user?.firstName &&
          order.customerName?.toLowerCase().includes(user.firstName.toLowerCase())
        );
        return matchId || matchEmail || matchPhone || matchName;
      });

  const handleOpenOrder = (order: UnifiedOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleUpdateStatus = (
    orderId: string,
    status: UnifiedOrderStatus,
    trackingNumber?: string
  ) => {
    dispatch(updateOrderStatus({ orderId, status, trackingNumber }));
  };

  // Filtered orders
  const filteredOrders = baseOrders.filter((order) => {
    if (selectedStatusFilter !== 'all' && order.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchCust = order.customerName.toLowerCase().includes(q);
      const matchEmail = order.customerEmail.toLowerCase().includes(q);
      const matchItem = order.items.some((it) => it.name.toLowerCase().includes(q));
      return matchOrderNum || matchCust || matchEmail || matchItem;
    }
    return true;
  });

  // Calculate statistics
  const totalRevenue = baseOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = baseOrders.filter((o) => o.status === 'pending').length;
  const transitCount = baseOrders.filter(
    (o) => o.status === 'shipped' || o.status === 'processing'
  ).length;
  const deliveredCount = baseOrders.filter(
    (o) => o.status === 'delivered' || o.status === 'completed'
  ).length;

  const getStatusChipColor = (
    status: UnifiedOrderStatus
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'approved':
        return 'primary';
      case 'shipped':
        return 'secondary';
      case 'delivered':
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getOrderTypeBadge = (type: string) => {
    switch (type) {
      case 'generator_purchase':
        return (
          <Chip
            label="Gen Purchase"
            size="small"
            variant="outlined"
            color="primary"
            sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
          />
        );
      case 'generator_lease':
        return (
          <Chip
            label="Gen Lease"
            size="small"
            variant="outlined"
            color="secondary"
            sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
          />
        );
      case 'spare_parts':
        return (
          <Chip
            label="Spare Parts"
            size="small"
            variant="outlined"
            color="info"
            sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
          />
        );
      default:
        return (
          <Chip
            label={type}
            size="small"
            variant="outlined"
            sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
          />
        );
    }
  };

  const statusFilters = [
    { label: isOwner ? 'All Customer Orders' : 'All My Orders', value: 'all', count: baseOrders.length },
    { label: 'Pending', value: 'pending', count: baseOrders.filter((o) => o.status === 'pending').length },
    { label: 'Processing', value: 'processing', count: baseOrders.filter((o) => o.status === 'processing').length },
    { label: 'Shipped', value: 'shipped', count: baseOrders.filter((o) => o.status === 'shipped').length },
    {
      label: 'Delivered',
      value: 'delivered',
      count: baseOrders.filter((o) => o.status === 'delivered' || o.status === 'completed').length,
    },
    { label: 'Cancelled', value: 'cancelled', count: baseOrders.filter((o) => o.status === 'cancelled').length },
  ];

  return (
    <Box>
      {/* Top Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <OrdersIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {isOwner ? 'TOTAL ORDERS' : 'MY ORDERS PLACED'}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {baseOrders.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: (t) =>
                    t.palette.mode === 'dark' ? 'rgba(217, 119, 6, 0.2)' : '#fffbeb',
                  color: '#d97706',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <PendingIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {isOwner ? 'ACTION NEEDED' : 'PENDING APPROVAL'}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {pendingCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: (t) =>
                    t.palette.mode === 'dark' ? 'rgba(22, 163, 74, 0.2)' : '#f0fdf4',
                  color: '#16a34a',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <CheckCircleIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {isOwner ? 'DELIVERED ORDERS' : 'DELIVERED & COMPLETE'}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {deliveredCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: (t) =>
                    t.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.2)' : '#f5f3ff',
                  color: '#7c3aed',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <MoneyIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {isOwner ? 'TOTAL SALES VOLUME' : 'MY TOTAL SPENDING'}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {CURRENCY_SYMBOL}{totalRevenue.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder={
                isOwner
                  ? 'Search by Order #, Customer, Email, or Item name...'
                  : 'Search by Order # or Item name...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {statusFilters.map((sf) => (
                <Chip
                  key={sf.value}
                  label={`${sf.label} (${sf.count})`}
                  clickable
                  color={selectedStatusFilter === sf.value ? 'primary' : 'default'}
                  variant={selectedStatusFilter === sf.value ? 'filled' : 'outlined'}
                  onClick={() => setSelectedStatusFilter(sf.value)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Mobile Orders Card View (Each row shown as one card on mobile) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {filteredOrders.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <OrdersIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body1" fontWeight={600}>
              {isOwner
                ? 'No orders found matching the filter.'
                : 'You have not placed any orders matching this filter.'}
            </Typography>
            {!isOwner && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(ROUTES.GENERATORS)}
                >
                  Explore Generators
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(ROUTES.SPARE_PARTS)}
                >
                  Browse Spare Parts
                </Button>
              </Box>
            )}
          </Paper>
        ) : (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              elevation={2}
              sx={{
                borderRadius: 2.5,
                border: (t) =>
                  `1px solid ${t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Header: Order Number, Date, Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ fontSize: '0.92rem', cursor: 'pointer' }}
                      onClick={() => handleOpenOrder(order)}
                    >
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={order.status.toUpperCase()}
                      size="small"
                      color={getStatusChipColor(order.status)}
                      sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Details Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 1 }}>
                  {/* Order Type */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      TYPE
                    </Typography>
                    {getOrderTypeBadge(order.orderType)}
                  </Box>

                  {/* Items */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ minWidth: 60 }}>
                      ITEMS
                    </Typography>
                    <Typography variant="body2" fontWeight={600} align="right" sx={{ flex: 1, ml: 1 }}>
                      {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </Typography>
                  </Box>

                  {/* Destination / Customer */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ minWidth: 60 }}>
                      {isOwner ? 'CUSTOMER' : 'DELIVERY'}
                    </Typography>
                    <Box sx={{ textAlign: 'right', flex: 1, ml: 1 }}>
                      {isOwner ? (
                        <>
                          <Typography variant="body2" fontWeight={600}>
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customerPhone}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" fontWeight={600}>
                            {order.shippingAddress.street ? `${order.shippingAddress.street}, ` : ''}
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            PIN: {order.shippingAddress.pincode}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>

                  {/* Total Amount */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      TOTAL AMOUNT
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Card Action Button */}
                <Box sx={{ mt: 1.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenOrder(order)}
                    fullWidth
                    sx={{ py: 0.75, fontWeight: 600, borderRadius: 1.5, textTransform: 'none' }}
                  >
                    View Order Summary
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Desktop Orders Table (Hidden on Mobile xs & sm, visible on md and up) */}
      <TableContainer
        component={Paper}
        sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 2, overflow: 'hidden' }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: (t) => (t.palette.mode === 'dark' ? '#141e33' : '#f8fafc') }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              {isOwner ? (
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
              ) : (
                <TableCell sx={{ fontWeight: 700 }}>Delivery Destination</TableCell>
              )}
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Order Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  <OrdersIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>
                    {isOwner
                      ? 'No orders found matching the filter.'
                      : 'You have not placed any orders matching this filter.'}
                  </Typography>
                  {!isOwner && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(ROUTES.GENERATORS)}
                      >
                        Explore Generators
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(ROUTES.SPARE_PARTS)}
                      >
                        Browse Spare Parts
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  hover
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => handleOpenOrder(order)}
                >
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </TableCell>

                  {/* Customer (Owner View) vs Delivery Destination (Customer View) */}
                  {isOwner ? (
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customerPhone}
                      </Typography>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pin: {order.shippingAddress.pincode}
                      </Typography>
                    </TableCell>
                  )}

                  <TableCell>{getOrderTypeBadge(order.orderType)}</TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {order.items[0]?.name}
                    </Typography>
                    {order.items.length > 1 && (
                      <Typography variant="caption" color="text.secondary">
                        +{order.items.length - 1} more item(s)
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>
                    {CURRENCY_SYMBOL}{order.totalAmount.toLocaleString('en-IN')}
                  </TableCell>

                  {/* Status Column: Editable for Owner, Visual Badge + Tracking for Customer */}
                  <TableCell onClick={(e) => isOwner && e.stopPropagation()}>
                    {isOwner ? (
                      <TextField
                        select
                        size="small"
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value as UnifiedOrderStatus)
                        }
                        sx={{
                          minWidth: 120,
                          '& .MuiSelect-select': {
                            py: 0.7,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          },
                        }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </TextField>
                    ) : (
                      <Box>
                        <Chip
                          label={order.status.toUpperCase()}
                          size="small"
                          color={getStatusChipColor(order.status)}
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                        {order.trackingNumber && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            Track: {order.trackingNumber}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </TableCell>

                  {/* Action Column */}
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="View Order Summary & Terms Details">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenOrder(order)}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}
                      >
                        Summary
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Dialog */}
      <OrderDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        isOwner={isOwner}
      />

      {/* Terms Modal */}
      <TermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </Box>
  );
};
