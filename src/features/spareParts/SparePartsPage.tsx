import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Pagination,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Add,
  Remove,
  FilterList,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addToCart, fetchSpareParts } from '../../store/slices/sparePartsSlice';
import { SparePart, SparePartCategory, SparePartOrderItem } from '../../types/spareParts.types';

const CATEGORIES: Array<{ value: SparePartCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All Parts' },
  { value: 'engine', label: 'Engine Parts' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'fuel', label: 'Fuel System' },
  { value: 'cooling', label: 'Cooling System' },
  { value: 'filters', label: 'Filters' },
  { value: 'accessories', label: 'Accessories' },
];

const ITEMS_PER_PAGE = 12;

export const SparePartsPage = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { cart, parts: storeParts } = useAppSelector((state) => state.spareParts);
  
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [filteredParts, setFilteredParts] = useState<SparePart[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SparePartCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchSpareParts());
  }, [dispatch]);

  useEffect(() => {
    setSpareParts(storeParts);
    setFilteredParts(storeParts);
  }, [storeParts]);

  useEffect(() => {
    // Filter and sort
    let filtered = [...spareParts];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((part) => part.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (part) =>
          part.name.toLowerCase().includes(query) ||
          part.description.toLowerCase().includes(query) ||
          part.partNumber.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredParts(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, spareParts]);

  const handleQuantityChange = (partId: string, delta: number): void => {
    setQuantities((prev) => {
      const current = prev[partId] || 1;
      const newQty = Math.max(1, current + delta);
      return { ...prev, [partId]: newQty };
    });
  };

  const handleAddToCart = (part: SparePart): void => {
    const quantity = quantities[part.id] || 1;
    const cartItem: SparePartOrderItem = {
      partId: part.id,
      partName: part.name,
      partNumber: part.partNumber,
      quantity,
      unitPrice: part.price,
      totalPrice: part.price * quantity,
    };
    dispatch(addToCart(cartItem));
    setQuantities((prev) => ({ ...prev, [part.id]: 1 }));
  };

  const getStockStatus = (stock: number): { label: string; color: 'success' | 'warning' | 'error' } => {
    if (stock > 10) {
      return { label: 'In Stock', color: 'success' };
    } else if (stock > 0) {
      return { label: `Only ${stock} left`, color: 'warning' };
    } else {
      return { label: 'Out of Stock', color: 'error' };
    }
  };

  const totalPages = Math.ceil(filteredParts.length / ITEMS_PER_PAGE);
  const paginatedParts = filteredParts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight={700}>
            Spare Parts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Genuine spare parts for your generator
          </Typography>
        </Box>
        <IconButton color="primary" size="large">
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value as SparePartCategory | 'all')}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price-low' | 'price-high')}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary" align="right">
              {filteredParts.length} part{filteredParts.length !== 1 ? 's' : ''} found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Parts Grid */}
      {filteredParts.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No spare parts found matching your criteria
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedParts.map((part) => {
              const stockStatus = getStockStatus(part.stock);
              const quantity = quantities[part.id] || 1;
              const isOutOfStock = part.stock === 0;

              return (
                <Grid item xs={12} sm={6} md={4} key={part.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      opacity: isOutOfStock ? 0.7 : 1,
                    }}
                  >
                    {/* Stock Badge */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                      <Chip
                        label={stockStatus.label}
                        color={stockStatus.color}
                        size="small"
                      />
                    </Box>

                    {/* Image */}
                    <CardMedia
                      component="img"
                      height="180"
                      image={part.imageUrl}
                      alt={part.name}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Part Number */}
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Part# {part.partNumber}
                      </Typography>

                      {/* Name */}
                      <Typography variant="h6" component="div" gutterBottom>
                        {part.name}
                      </Typography>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {part.description}
                      </Typography>

                      {/* Category */}
                      <Chip
                        label={CATEGORIES.find((c) => c.value === part.category)?.label || part.category}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />

                      {/* Compatible Models */}
                      {part.compatibleModels && part.compatibleModels.length > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Compatible: {part.compatibleModels.slice(0, 2).join(', ')}
                          {part.compatibleModels.length > 2 && '...'}
                        </Typography>
                      )}

                      {/* Price */}
                      <Typography variant="h5" color="primary" fontWeight={700} sx={{ mt: 2 }}>
                        ₹{part.price.toLocaleString('en-IN')}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {/* Quantity Selector */}
                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(part.id, -1)}
                            disabled={quantity <= 1 || isOutOfStock}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ px: 2, minWidth: 30, textAlign: 'center' }}>
                            {quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(part.id, 1)}
                            disabled={quantity >= part.stock || isOutOfStock}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Add to Cart Button */}
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleAddToCart(part)}
                          disabled={isOutOfStock}
                        >
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Info Section */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                🔧 Genuine Parts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All parts are original equipment manufacturer (OEM) quality
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                📦 Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Same-day dispatch for orders placed before 3 PM
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                ✓ Warranty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All spare parts come with a 6-month warranty
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
