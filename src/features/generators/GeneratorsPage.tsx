import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  TextField,
  MenuItem,
  Paper,
} from '@mui/material';
import { PowerSettingsNew, Speed } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../../components/UI';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchGenerators } from '../../store/slices/generatorSlice';
import { Generator, GeneratorStatus, GeneratorType, FuelType } from '../../types';
import { ROUTES } from '../../constants';

export const GeneratorsPage = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { generators, isLoading } = useAppSelector((state) => state.generators);

  const [filters, setFilters] = useState({
    type: '',
    fuelType: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    dispatch(fetchGenerators());
  }, [dispatch]);

  const filteredGenerators = generators.filter((gen: Generator) => {
    if (filters.type && gen.type !== filters.type) return false;
    if (filters.fuelType && gen.fuelType !== filters.fuelType) return false;
    if (filters.status && gen.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        gen.name.toLowerCase().includes(searchLower) ||
        gen.manufacturer.toLowerCase().includes(searchLower) ||
        gen.model.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusColor = (status: GeneratorStatus): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case GeneratorStatus.AVAILABLE:
        return 'success';
      case GeneratorStatus.LEASED:
        return 'warning';
      case GeneratorStatus.SOLD:
        return 'error';
      default:
        return 'info';
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom fontWeight="bold">
        Available Generators
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Browse our extensive collection of generators
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Name, model, brand..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="">All Types</MenuItem>
              {Object.values(GeneratorType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Fuel Type"
              value={filters.fuelType}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
            >
              <MenuItem value="">All Fuel Types</MenuItem>
              {Object.values(FuelType).map((fuel) => (
                <MenuItem key={fuel} value={fuel}>
                  {fuel.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">All Status</MenuItem>
              {Object.values(GeneratorStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Showing {filteredGenerators.length} of {generators.length} generators
      </Typography>

      {/* Generators Grid */}
      <Grid container spacing={3}>
        {filteredGenerators.map((generator: Generator) => (
          <Grid item xs={12} sm={6} md={4} key={generator.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={generator.imageUrls[0]}
                alt={generator.name}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    label={generator.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(generator.status)}
                    size="small"
                  />
                  <Chip
                    icon={<Speed />}
                    label={`${generator.powerCapacityKW} kW`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {generator.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {generator.manufacturer} • {generator.year}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <PowerSettingsNew sx={{ fontSize: 16, verticalAlign: 'middle' }} />{' '}
                    {generator.fuelType.replace('_', ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${generator.dailyLeaseRate}/day
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Purchase: ${generator.salePrice.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/generators/${generator.id}`)}
                >
                  View Details
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(`/generators/${generator.id}`)}
                  disabled={generator.status !== GeneratorStatus.AVAILABLE}
                >
                  Request
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredGenerators.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No generators found matching your criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};
