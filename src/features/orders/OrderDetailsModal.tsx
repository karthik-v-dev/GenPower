import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Chip,
  IconButton,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardMedia,
} from '@mui/material';
import { Close as CloseIcon, LocalShipping as LocalShippingIcon, PictureAsPdf as PdfIcon, Gavel as LegalIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { UnifiedOrder, UnifiedOrderStatus } from '../../types/order.types';
import { CURRENCY_SYMBOL } from '../../constants';
import { termsPdfService } from '../../services/termsPdfService';

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: UnifiedOrder | null;
  onUpdateStatus: (orderId: string, status: UnifiedOrderStatus, trackingNumber?: string) => void;
  isOwner?: boolean;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
  onUpdateStatus,
  isOwner = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<UnifiedOrderStatus>('pending');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  if (!order) return null;

  const handleSaveStatus = () => {
    onUpdateStatus(order.id, selectedStatus, trackingNumber);
    onClose();
  };

  const getStatusColor = (status: UnifiedOrderStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
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

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case 'generator_purchase':
        return 'Generator Purchase';
      case 'generator_lease':
        return 'Generator Lease';
      case 'spare_parts':
        return 'Spare Parts Order';
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>
            Order: {order.orderNumber}
          </Typography>
          <Chip
            label={order.status.toUpperCase()}
            color={getStatusColor(order.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        {/* Status Update Bar for Owner or Customer Progress */}
        {isOwner ? (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f8fafc',
              border: (t) => `1px solid ${t.palette.mode === 'dark' ? '#24324d' : '#e2e8f0'}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon fontSize="small" color="primary" /> Manage Order Fulfillment Status (Store Owner)
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Order Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as UnifiedOrderStatus)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tracking / Consignment #"
                  placeholder="e.g. DTDC-9921034"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button variant="contained" fullWidth onClick={handleSaveStatus}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : '#f0fdf4',
              border: (t) => `1px solid ${t.palette.mode === 'dark' ? '#24324d' : '#bbf7d0'}`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingIcon color="primary" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Fulfillment Status: {order.status.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tracking Number: <strong>{order.trackingNumber || 'Pending Courier Dispatch'}</strong>
                  </Typography>
                </Box>
              </Box>
              <Chip label={order.status.toUpperCase()} color={getStatusColor(order.status)} sx={{ fontWeight: 700 }} />
            </Box>
          </Paper>
        )}

        {/* Terms and Conditions Confirmation Card */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc',
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  Terms &amp; Conditions Agreement Confirmed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Non-refundable/non-returnable policy, 2 free routine services (parts billed), and tiered service discounts agreed.
                </Typography>
              </Box>
            </Box>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<PdfIcon color="error" />}
              onClick={() => termsPdfService.downloadPdf('GenPower_Terms_And_Conditions.pdf')}
              sx={{ fontWeight: 600, textTransform: 'none', fontSize: '0.75rem' }}
            >
              Download Terms PDF
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Customer Information */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                Customer Details
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {order.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {order.customerEmail}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {order.customerPhone}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Order Date: {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>

          {/* Delivery & Payment Details */}
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
                Shipping & Payment
              </Typography>
              <Typography variant="body2">
                <strong>Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </Typography>
              <Typography variant="body2">
                <strong>Payment Status:</strong>{' '}
                <Chip
                  label={order.paymentStatus.toUpperCase()}
                  size="small"
                  color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                  sx={{ ml: 0.5, height: 20, fontSize: '0.75rem' }}
                />
              </Typography>
              {order.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Notes:</strong> {order.notes}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Order Items Table */}
        <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>
          Items in this Order ({order.items.length})
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Model / Part #</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {item.imageUrl && (
                        <CardMedia
                          component="img"
                          image={item.imageUrl}
                          alt={item.name}
                          sx={{ width: 44, height: 44, borderRadius: 1, objectFit: 'cover' }}
                        />
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {item.name}
                        </Typography>
                        {item.specifications && (
                          <Typography variant="caption" color="text.secondary">
                            {Object.entries(item.specifications)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' | ')}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{item.modelOrPartNumber || '-'}</TableCell>
                  <TableCell align="right">{CURRENCY_SYMBOL}{item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {CURRENCY_SYMBOL}{item.totalPrice.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Financial Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: 280 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
              <Typography variant="body2">{CURRENCY_SYMBOL}{order.subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="body2" color="text.secondary">GST (18%):</Typography>
              <Typography variant="body2">{CURRENCY_SYMBOL}{order.taxAmount.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Shipping / Handling:</Typography>
              <Typography variant="body2">{CURRENCY_SYMBOL}{order.shippingOrInstallationAmount.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={700}>Grand Total:</Typography>
              <Typography variant="subtitle1" fontWeight={700} color="primary">
                {CURRENCY_SYMBOL}{order.totalAmount.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
