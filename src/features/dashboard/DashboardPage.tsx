import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Tooltip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ElectricBolt as GeneratorIcon,
  Build as SparePartIcon,
  ShoppingCart as OrderIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  fetchGenerators,
  saveGeneratorAsync,
  deleteGeneratorAsync,
} from '../../store/slices/generatorSlice';
import {
  fetchSpareParts,
  saveSparePartAsync,
  deleteSparePartAsync,
} from '../../store/slices/sparePartsSlice';
import { fetchOrders } from '../../store/slices/orderSlice';
import { Generator, GeneratorStatus, FuelType } from '../../types/generator.types';
import { SparePart, PartCategory, PartStatus } from '../../types/spareParts.types';
import { GeneratorModal } from '../generators/GeneratorModal';
import { SparePartModal } from '../spareParts/SparePartModal';
import { OrderListView } from '../orders/OrderListView';
import { CURRENCY_SYMBOL, ROUTES } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { generators, isLoading: genLoading } = useAppSelector((state) => state.generators);
  const { parts, isLoading: partsLoading } = useAppSelector((state) => state.spareParts);
  const { orders, isLoading: ordersLoading } = useAppSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState(0);

  // Generator management state
  const [genSearch, setGenSearch] = useState('');
  const [genFuelFilter, setGenFuelFilter] = useState('all');
  const [genStatusFilter, setGenStatusFilter] = useState('all');
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<Generator | null>(null);

  // Spare parts management state
  const [partSearch, setPartSearch] = useState('');
  const [partCategoryFilter, setPartCategoryFilter] = useState('all');
  const [partStatusFilter, setPartStatusFilter] = useState('all');
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);

  useEffect(() => {
    dispatch(fetchGenerators());
    dispatch(fetchSpareParts());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Generators CRUD handlers
  const handleOpenAddGenerator = () => {
    setSelectedGenerator(null);
    setIsGenModalOpen(true);
  };

  const handleEditGenerator = (gen: Generator) => {
    setSelectedGenerator(gen);
    setIsGenModalOpen(true);
  };

  const handleSaveGenerator = async (generator: Generator) => {
    try {
      await dispatch(saveGeneratorAsync(generator)).unwrap();
      toast.success(
        selectedGenerator
          ? `Generator "${generator.name}" updated successfully!`
          : `Generator "${generator.name}" added to inventory!`
      );
    } catch (err: any) {
      toast.error(`Failed to save generator: ${err}`);
    }
  };

  const handleDeleteGenerator = async (gen: Generator) => {
    if (window.confirm(`Are you sure you want to delete "${gen.name}"?`)) {
      try {
        await dispatch(deleteGeneratorAsync(gen.id)).unwrap();
        toast.info(`Generator "${gen.name}" deleted.`);
      } catch (err: any) {
        toast.error(`Failed to delete generator: ${err}`);
      }
    }
  };

  // Spare Parts CRUD handlers
  const handleOpenAddSparePart = () => {
    setSelectedPart(null);
    setIsPartModalOpen(true);
  };

  const handleEditSparePart = (part: SparePart) => {
    setSelectedPart(part);
    setIsPartModalOpen(true);
  };

  const handleSaveSparePart = async (part: SparePart) => {
    try {
      await dispatch(saveSparePartAsync(part)).unwrap();
      toast.success(
        selectedPart
          ? `Spare part "${part.name}" updated successfully!`
          : `Spare part "${part.name}" added to catalog!`
      );
    } catch (err: any) {
      toast.error(`Failed to save spare part: ${err}`);
    }
  };

  const handleDeleteSparePart = async (part: SparePart) => {
    if (window.confirm(`Are you sure you want to delete "${part.name}"?`)) {
      try {
        await dispatch(deleteSparePartAsync(part.id)).unwrap();
        toast.info(`Spare part "${part.name}" deleted.`);
      } catch (err: any) {
        toast.error(`Failed to delete spare part: ${err}`);
      }
    }
  };

  // Filtered generators
  const filteredGenerators = generators.filter((gen) => {
    if (genFuelFilter !== 'all' && gen.fuelType !== genFuelFilter) return false;
    if (genStatusFilter !== 'all' && gen.status !== genStatusFilter) return false;
    if (genSearch.trim()) {
      const q = genSearch.toLowerCase();
      return (
        gen.name.toLowerCase().includes(q) ||
        gen.model.toLowerCase().includes(q) ||
        gen.manufacturer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered spare parts
  const filteredParts = parts.filter((part) => {
    if (partCategoryFilter !== 'all' && part.category !== partCategoryFilter) return false;
    if (partStatusFilter !== 'all' && part.status !== partStatusFilter) return false;
    if (partSearch.trim()) {
      const q = partSearch.toLowerCase();
      return (
        part.name.toLowerCase().includes(q) ||
        part.partNumber.toLowerCase().includes(q) ||
        part.manufacturer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Summary Metrics
  const totalGenerators = generators.length;
  const availableGenerators = generators.filter((g) => g.status === GeneratorStatus.AVAILABLE).length;
  const leasedGenerators = generators.filter((g) => g.status === GeneratorStatus.LEASED).length;

  const totalParts = parts.length;
  const totalPartsStock = parts.reduce((sum, p) => sum + (p.stockQuantity || p.stock || 0), 0);
  const lowStockParts = parts.filter(
    (p) => p.status === PartStatus.LOW_STOCK || (p.stockQuantity || p.stock || 0) <= 5
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Top Banner / Welcome */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography variant="h4" fontWeight={800}>
                Dashboard & Product Management
              </Typography>
              <Chip
                label={user?.role?.toUpperCase() || 'OWNER'}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, backgroundColor: '#3b82f6' }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Administrator'}! Manage
              generators, spare parts inventory, and fulfill customer orders.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddGenerator}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  fontWeight: 600,
                }}
              >
                Add Generator
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}

                onClick={handleOpenAddSparePart}
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' },
                  fontWeight: 600,
                }}
              >
                Add Spare Part
              </Button>
              <Button
                variant="outlined"
                onClick={() => setActiveTab(3)}
                sx={{ color: '#ffffff', borderColor: '#475569', fontWeight: 600 }}
              >
                Orders ({orders.length})
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Top 4 KPI Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: (t) => t.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 18px rgba(37, 99, 235, 0.08)',
              border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.3)' : '#dbeafe'}`,
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.28) 0%, #1e293b 80%)'
                  : 'radial-gradient(circle at 0% 0%, #ffffff 0%, #eff6ff 45%, #dbeafe 100%)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  GENERATOR FLEET
                </Typography>
                <Box sx={{ p: 1, backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: 2 }}>
                  <GeneratorIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {totalGenerators} Models
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`${availableGenerators} Available`} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                <Chip label={`${leasedGenerators} Leased`} size="small" color="warning" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: (t) => t.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 18px rgba(22, 163, 74, 0.08)',
              border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(22, 163, 74, 0.3)' : '#dcfce7'}`,
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'radial-gradient(circle at 0% 0%, rgba(22, 163, 74, 0.28) 0%, #1e293b 80%)'
                  : 'radial-gradient(circle at 0% 0%, #ffffff 0%, #f0fdf4 45%, #dcfce7 100%)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  SPARE PARTS INVENTORY
                </Typography>
                <Box sx={{ p: 1, backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(22, 163, 74, 0.2)' : '#f0fdf4', color: '#16a34a', borderRadius: 2 }}>
                  <SparePartIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {totalParts} Items
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Units: <strong>{totalPartsStock}</strong>
                </Typography>
                {lowStockParts.length > 0 && (
                  <Chip label={`${lowStockParts.length} Low Stock`} size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: (t) => t.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 18px rgba(217, 119, 6, 0.08)',
              border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(217, 119, 6, 0.3)' : '#fef3c7'}`,
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'radial-gradient(circle at 0% 0%, rgba(217, 119, 6, 0.28) 0%, #1e293b 80%)'
                  : 'radial-gradient(circle at 0% 0%, #ffffff 0%, #fefce8 45%, #fef3c7 100%)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  ORDERS & FULFILLMENT
                </Typography>
                <Box sx={{ p: 1, backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(217, 119, 6, 0.2)' : '#fef3c7', color: '#d97706', borderRadius: 2 }}>
                  <OrderIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {orders.length} Orders
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`${pendingOrders.length} Pending`} size="small" color={pendingOrders.length > 0 ? 'warning' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {orders.filter((o) => o.status === 'delivered' || o.status === 'completed').length} Delivered
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: (t) => t.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 18px rgba(124, 58, 237, 0.08)',
              border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.3)' : '#f3e8ff'}`,
              background: (t) =>
                t.palette.mode === 'dark'
                  ? 'radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.28) 0%, #1e293b 80%)'
                  : 'radial-gradient(circle at 0% 0%, #ffffff 0%, #faf5ff 45%, #f3e8ff 100%)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  TOTAL SALES VOLUME
                </Typography>
                <Box sx={{ p: 1, backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.2)' : '#f5f3ff', color: '#7c3aed', borderRadius: 2 }}>
                  <TrendingUpIcon fontSize="small" />
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {CURRENCY_SYMBOL}{totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cumulative across purchases, leases & spare parts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Tabs Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label="Overview"
            icon={<InventoryIcon />}
            iconPosition="start"
            sx={{ fontWeight: 600, minHeight: 56 }}
          />
          <Tab
            label={`Generator Models (${generators.length})`}
            icon={<GeneratorIcon />}
            iconPosition="start"
            sx={{ fontWeight: 600, minHeight: 56 }}
          />
          <Tab
            label={`Spare Parts (${parts.length})`}
            icon={<SparePartIcon />}
            iconPosition="start"
            sx={{ fontWeight: 600, minHeight: 56 }}
          />
          <Tab
            label={`Order List (${orders.length})`}
            icon={<OrderIcon />}
            iconPosition="start"
            sx={{ fontWeight: 600, minHeight: 56 }}
          />
        </Tabs>
      </Paper>

      {/* ================= TAB 0: OVERVIEW ================= */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Quick Actions & Low Stock Widget */}
          <Grid item xs={12} md={5}>
            {/* Quick Actions Card */}
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.mode === 'dark' ? '#24324d' : '#e2e8f0'}`,
                background: (t) =>
                  t.palette.mode === 'dark'
                    ? 'radial-gradient(circle at 0% 0%, #24324d 0%, #1e293b 85%)'
                    : 'radial-gradient(circle at 0% 0%, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
              }}
            >
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create new products to expand your inventory, or jump straight to active order lists.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddGenerator}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Add Generator
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddSparePart}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Add Spare Part
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<OrderIcon />}
                    onClick={() => setActiveTab(3)}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Manage Orders
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(ROUTES.GENERATORS)}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    Customer Catalog
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Low Stock Alerts */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.mode === 'dark' ? '#3b2020' : '#fee2e2'}`,
                background: (t) =>
                  t.palette.mode === 'dark'
                    ? 'radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.18) 0%, #1e293b 80%)'
                    : 'radial-gradient(circle at 0% 0%, #ffffff 0%, #fff7ed 50%, #fed7aa 100%)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" fontSize="small" /> Inventory Alerts
                </Typography>
                <Chip label={`${lowStockParts.length} Items`} size="small" color={lowStockParts.length > 0 ? 'error' : 'success'} />
              </Box>

              {lowStockParts.length === 0 ? (
                <Alert severity="success">All spare parts are well-stocked.</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {lowStockParts.slice(0, 5).map((part) => (
                    <Box
                      key={part.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        backgroundColor: '#fffbeb',
                        borderRadius: 2,
                        border: '1px solid #fde68a',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CardMedia
                          component="img"
                          image={part.imageUrl}
                          alt={part.name}
                          sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {part.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Part #: {part.partNumber}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          label={`Stock: ${part.stockQuantity || part.stock || 0}`}
                          size="small"
                          color="error"
                          sx={{ fontWeight: 700 }}
                        />
                        <Box sx={{ mt: 0.5 }}>
                          <Button size="small" onClick={() => handleEditSparePart(part)}>
                            Restock / Edit
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  {lowStockParts.length > 5 && (
                    <Button size="small" onClick={() => setActiveTab(2)}>
                      View All {lowStockParts.length} Alerts
                    </Button>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Orders Preview */}
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: (t) => `1px solid ${t.palette.mode === 'dark' ? '#24324d' : '#e2e8f0'}`,
                background: (t) =>
                  t.palette.mode === 'dark'
                    ? 'radial-gradient(circle at 0% 0%, #24324d 0%, #1e293b 85%)'
                    : 'radial-gradient(circle at 0% 0%, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Recent Customer Orders
                </Typography>
                <Button size="small" onClick={() => setActiveTab(3)}>
                  View All Orders →
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.slice(0, 6).map((order) => (
                      <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => setActiveTab(3)}>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.items[0]?.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {CURRENCY_SYMBOL}{order.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status.toUpperCase()}
                            size="small"
                            color={
                              order.status === 'delivered' || order.status === 'completed'
                                ? 'success'
                                : order.status === 'pending'
                                  ? 'warning'
                                  : 'info'
                            }
                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ================= TAB 1: GENERATOR MODELS MANAGEMENT ================= */}
      {activeTab === 1 && (
        <Box>
          {/* Controls Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by generator model, name, manufacturer..."
                  value={genSearch}
                  onChange={(e) => setGenSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Fuel Type"
                  value={genFuelFilter}
                  onChange={(e) => setGenFuelFilter(e.target.value)}
                >
                  <MenuItem value="all">All Fuel Types</MenuItem>
                  <MenuItem value={FuelType.PETROL}>Petrol</MenuItem>
                  <MenuItem value={FuelType.DIESEL}>Diesel</MenuItem>
                  <MenuItem value={FuelType.DUAL_FUEL}>Dual Fuel</MenuItem>
                  <MenuItem value={FuelType.LPG}>LPG</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Status"
                  value={genStatusFilter}
                  onChange={(e) => setGenStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value={GeneratorStatus.AVAILABLE}>Available</MenuItem>
                  <MenuItem value={GeneratorStatus.LEASED}>Leased</MenuItem>
                  <MenuItem value={GeneratorStatus.SOLD}>Sold</MenuItem>
                  <MenuItem value={GeneratorStatus.IN_SERVICE}>In Service</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddGenerator}
                  sx={{ py: 0.9, fontWeight: 700 }}
                >
                  + Add Model
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Generators Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Model & Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Manufacturer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Power (kW)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fuel / Voltage</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Sale Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Lease Rates</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGenerators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      <Typography variant="body1">No generator models found matching search.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGenerators.map((gen) => (
                    <TableRow key={gen.id} hover>
                      <TableCell>
                        <CardMedia
                          component="img"
                          image={gen.imageUrls?.[0]}
                          alt={gen.name}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            objectFit: 'cover',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          {gen.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Model: {gen.model} | S/N: {gen.serialNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{gen.manufacturer}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {gen.powerCapacityKW} kW
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {gen.fuelType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {gen.voltage}V | {gen.phase} Phase
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {CURRENCY_SYMBOL}{gen.salePrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" display="block">
                          Day: <strong>{CURRENCY_SYMBOL}{gen.dailyLeaseRate}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Month: {CURRENCY_SYMBOL}{gen.monthlyLeaseRate.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={gen.status.toUpperCase()}
                          size="small"
                          color={
                            gen.status === GeneratorStatus.AVAILABLE
                              ? 'success'
                              : gen.status === GeneratorStatus.LEASED
                                ? 'warning'
                                : 'default'
                          }
                          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Edit Generator Model">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditGenerator(gen)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Generator">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteGenerator(gen)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ================= TAB 2: SPARE PARTS MANAGEMENT ================= */}
      {activeTab === 2 && (
        <Box>
          {/* Controls Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by part number, name, or manufacturer..."
                  value={partSearch}
                  onChange={(e) => setPartSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Category"
                  value={partCategoryFilter}
                  onChange={(e) => setPartCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value={PartCategory.FILTERS}>Filters</MenuItem>
                  <MenuItem value={PartCategory.ENGINE}>Engine</MenuItem>
                  <MenuItem value={PartCategory.ELECTRICAL}>Electrical</MenuItem>
                  <MenuItem value={PartCategory.BATTERIES}>Batteries</MenuItem>
                  <MenuItem value={PartCategory.FUEL_SYSTEM}>Fuel System</MenuItem>
                  <MenuItem value={PartCategory.COOLING_SYSTEM}>Cooling System</MenuItem>
                  <MenuItem value={PartCategory.CONTROL_PANEL}>Control Panel</MenuItem>
                  <MenuItem value={PartCategory.ALTERNATOR}>Alternator</MenuItem>
                  <MenuItem value={PartCategory.ACCESSORIES}>Accessories</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Stock Status"
                  value={partStatusFilter}
                  onChange={(e) => setPartStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Stock Statuses</MenuItem>
                  <MenuItem value={PartStatus.IN_STOCK}>In Stock</MenuItem>
                  <MenuItem value={PartStatus.LOW_STOCK}>Low Stock</MenuItem>
                  <MenuItem value={PartStatus.OUT_OF_STOCK}>Out of Stock</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddSparePart}
                  sx={{ py: 0.9, fontWeight: 700 }}
                >
                  + Add Part
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Spare Parts Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Part #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Part Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Manufacturer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Stock Qty</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredParts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      <Typography variant="body1">No spare parts found matching search.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParts.map((part) => (
                    <TableRow key={part.id} hover>
                      <TableCell>
                        <CardMedia
                          component="img"
                          image={part.imageUrl}
                          alt={part.name}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            objectFit: 'cover',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {part.partNumber}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {part.name}
                        </Typography>
                        {part.compatibleModels && (
                          <Typography variant="caption" color="text.secondary">
                            Fits: {part.compatibleModels.slice(0, 2).join(', ')}
                            {part.compatibleModels.length > 2 && '...'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{part.category}</TableCell>
                      <TableCell>{part.manufacturer}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {CURRENCY_SYMBOL}{part.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={
                            (part.stockQuantity || part.stock || 0) <= 5
                              ? 'error.main'
                              : 'text.primary'
                          }
                        >
                          {part.stockQuantity || part.stock || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={part.status.toUpperCase()}
                          size="small"
                          color={
                            part.status === PartStatus.IN_STOCK
                              ? 'success'
                              : part.status === PartStatus.LOW_STOCK
                                ? 'warning'
                                : 'error'
                          }
                          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Edit Spare Part">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditSparePart(part)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Spare Part">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteSparePart(part)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ================= TAB 3: ORDER LIST ================= */}
      {activeTab === 3 && (
        <Box>
          <OrderListView />
        </Box>
      )}

      {/* Generator Modal (Add & Edit) */}
      <GeneratorModal
        open={isGenModalOpen}
        onClose={() => setIsGenModalOpen(false)}
        onSave={handleSaveGenerator}
        generator={selectedGenerator}
      />

      {/* Spare Part Modal (Add & Edit) */}
      <SparePartModal
        open={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        onSave={handleSaveSparePart}
        part={selectedPart}
      />
    </Container>
  );
};
