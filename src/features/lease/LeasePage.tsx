import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { LocationOn, Place } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { VALIDATION, ROUTES } from '../../constants';
import { LeaseFormData, LeaseDuration } from '../../types/lease.types';
import { createOrder } from '../../store/slices/orderSlice';
import { UnifiedOrder } from '../../types/order.types';
import { TermsAgreementCheckbox } from '../../components/UI';
import { TERMS_AND_CONDITIONS } from '../../constants/terms';
import {
  getAllIndianCities,
  getCityLocationsAndPincodes,
  CityOption,
  LocationInfo,
} from '../../services/locationService';

const LEASE_DURATIONS: Array<{ value: LeaseDuration; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

export const LeasePage = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: generators } = useAppSelector((state) => state.generators);

  // All Indian cities from country-state-city (4,200+ cities across India)
  const allIndianCities = useMemo(() => getAllIndianCities(), []);

  // Location and pincode loading states
  const [selectedCityOption, setSelectedCityOption] = useState<CityOption | null>(null);
  const [isLoadingPincodes, setIsLoadingPincodes] = useState<boolean>(false);
  const [cityLocations, setCityLocations] = useState<LocationInfo[]>([]);
  const [cityPincodes, setCityPincodes] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<LeaseFormData>>({
    duration: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync city selection: auto-selects state and triggers dynamic pincode/location loading
  const handleCitySelect = async (cityOption: CityOption | null) => {
    setSelectedCityOption(cityOption);
    if (!cityOption) {
      handleAddressChange('city', '');
      handleAddressChange('state', '');
      handleAddressChange('pincode', '');
      setCityLocations([]);
      setCityPincodes([]);
      return;
    }

    // 1. Auto-select city and state
    handleAddressChange('city', cityOption.name);
    handleAddressChange('state', cityOption.state);

    // 2. Fetch city-associated locations and suggested pincodes
    setIsLoadingPincodes(true);
    try {
      const { locations, pincodes } = await getCityLocationsAndPincodes(cityOption.name);
      setCityLocations(locations);
      setCityPincodes(pincodes);

      // If exactly 1 pincode available, auto-select it
      if (pincodes.length === 1) {
        handleAddressChange('pincode', pincodes[0]);
      }
    } catch {
      // fallback
    } finally {
      setIsLoadingPincodes(false);
    }
  };

  const handleInputChange = (field: string, value: string | number): void => {
    setFormData((prev: Partial<LeaseFormData>) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (field: string, value: string): void => {
    setFormData((prev: Partial<LeaseFormData>) => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress!,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.generatorId) {
      newErrors.generatorId = 'Please select a generator';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (new Date(formData.startDate) < new Date()) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.deliveryAddress?.street?.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.deliveryAddress?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.deliveryAddress?.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.deliveryAddress?.pincode?.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.deliveryAddress.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (formData.notes && formData.notes.length > VALIDATION.MAX_NOTES_LENGTH) {
      newErrors.notes = `Notes cannot exceed ${VALIDATION.MAX_NOTES_LENGTH} characters`;
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must read and agree to the Terms & Conditions before submitting a lease request';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setErrors({ form: 'Please login to submit a lease request' });
      return;
    }

    if (!termsAccepted) {
      setErrors((prev) => ({
        ...prev,
        terms: 'You must read and agree to the Terms & Conditions before submitting a lease request',
      }));
      return;
    }

    if (validateForm()) {
      // Calculate estimated lease subtotal
      const days = formData.duration === 'daily' ? 1 : formData.duration === 'weekly' ? 7 : formData.duration === 'monthly' ? 30 : 90;
      const rate = selectedGenerator?.dailyLeaseRate || 1000;
      const qty = formData.quantity || 1;
      const subtotal = rate * qty * days;
      const tax = subtotal * 0.18;
      const total = subtotal + tax + 2000;

      const leaseOrder: UnifiedOrder = {
        id: `ord-lease-${Date.now()}`,
        orderNumber: `GP-LS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        orderType: 'generator_lease',
        customerId: user?.id || 'guest',
        customerName: user ? `${user.firstName} ${user.lastName}` : 'Customer',
        customerEmail: user?.email || 'customer@example.com',
        customerPhone: user?.phone || '+91 9800000000',
        items: selectedGenerator
          ? [
              {
                id: selectedGenerator.id,
                name: `${selectedGenerator.name} (${formData.duration?.toUpperCase()} Lease)`,
                modelOrPartNumber: selectedGenerator.model,
                category: 'Generators',
                imageUrl: selectedGenerator.imageUrls?.[0],
                unitPrice: selectedGenerator.dailyLeaseRate,
                quantity: qty,
                totalPrice: subtotal,
                specifications: {
                  'Power': `${selectedGenerator.powerCapacityKW} kW`,
                  'Fuel': selectedGenerator.fuelType,
                  'Duration': formData.duration || 'monthly',
                  'Start Date': formData.startDate || '',
                },
              },
            ]
          : [],
        subtotal,
        taxAmount: tax,
        shippingOrInstallationAmount: 2000,
        totalAmount: total,
        shippingAddress: {
          street: formData.deliveryAddress?.street || '',
          city: formData.deliveryAddress?.city || '',
          state: formData.deliveryAddress?.state || '',
          pincode: formData.deliveryAddress?.pincode || '',
          country: 'India',
        },
        paymentMethod: 'UPI / Direct Billing',
        paymentStatus: 'pending',
        status: 'pending',
        notes: formData.notes || '',
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: TERMS_AND_CONDITIONS.version,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(createOrder(leaseOrder));
      toast.success('Lease request submitted successfully! Your order has been placed.');
      setSubmitSuccess(true);
      setTermsAccepted(false);
      
      // Immediately reset all entry fields to empty except default required fields
      setFormData({
        generatorId: '',
        duration: 'monthly', // default required
        startDate: new Date().toISOString().split('T')[0], // default required
        quantity: 1, // default required
        deliveryAddress: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India', // default required
        },
        notes: '',
      });
      setSelectedCityOption(null);
      setCityLocations([]);
      setCityPincodes([]);
      setErrors({});

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
  };

  const selectedGenerator = generators.find((g) => g.id === formData.generatorId);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
        Lease a Generator
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Flexible generator leasing options for your power needs. Choose from daily, weekly, monthly, or long-term rentals.
      </Typography>

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please login or register to submit a lease request.
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Lease request submitted successfully! We will contact you shortly.
        </Alert>
      )}

      {errors.form && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.form}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4, mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Generator Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.generatorId}>
                <InputLabel>Select Generator *</InputLabel>
                <Select
                  value={formData.generatorId || ''}
                  label="Select Generator *"
                  onChange={(e) => handleInputChange('generatorId', e.target.value)}
                >
                  {generators.map((gen) => (
                    <MenuItem key={gen.id} value={gen.id}>
                      {gen.name} ({gen.powerCapacityKW} kW) - ₹{gen.dailyLeaseRate}/day
                    </MenuItem>
                  ))}
                </Select>
                {errors.generatorId && (
                  <Typography variant="caption" color="error">
                    {errors.generatorId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Lease Duration */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Lease Duration *</InputLabel>
                <Select
                  value={formData.duration}
                  label="Lease Duration *"
                  onChange={(e) => handleInputChange('duration', e.target.value as LeaseDuration)}
                >
                  {LEASE_DURATIONS.map((duration) => (
                    <MenuItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date *"
                value={formData.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                }}
                sx={{
                  '& input[type="date"]': {
                    colorScheme: (theme) => theme.palette.mode,
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: (theme) => (theme.palette.mode === 'dark' ? 'invert(1) brightness(1.2)' : 'none'),
                    cursor: 'pointer',
                  },
                }}
              />
            </Grid>

            {/* Quantity */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity *"
                value={formData.quantity || 1}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                inputProps={{ min: 1 }}
              />
            </Grid>

            {/* Delivery Address */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Delivery Address
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address *"
                value={formData.deliveryAddress?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                error={!!errors.street}
                helperText={errors.street}
              />
            </Grid>

            {/* City Selection (Covers all 4,200+ Indian Cities) */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={allIndianCities}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                value={selectedCityOption}
                onChange={(_, value) => handleCitySelect(value)}
                isOptionEqualToValue={(opt, val) => opt.name === val.name && opt.stateCode === val.stateCode}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City *"
                    placeholder="Search 4,200+ cities in India..."
                    error={!!errors.city}
                    helperText={errors.city || 'Selecting a city auto-selects state and loads available pincodes'}
                  />
                )}
              />
            </Grid>

            {/* State (Automatically Selected & Verified) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State *"
                value={formData.deliveryAddress?.state || ''}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                error={!!errors.state}
                helperText={errors.state || (formData.deliveryAddress?.state ? 'Auto-selected based on city' : '')}
                InputProps={{
                  readOnly: Boolean(selectedCityOption),
                }}
              />
            </Grid>

            {/* City-Associated Locations / Areas Dropdown (when loaded) */}
            {cityLocations.length > 0 && (
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={cityLocations}
                  getOptionLabel={(loc) => `${loc.name} (${loc.pincode})`}
                  onChange={(_, loc) => {
                    if (loc) {
                      handleAddressChange('pincode', loc.pincode);
                      if (!formData.deliveryAddress?.street) {
                        handleAddressChange('street', loc.name);
                      }
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Associated Location / Locality"
                      placeholder="Select area or locality..."
                      helperText="Selecting an area auto-fills the matching pincode"
                    />
                  )}
                />
              </Grid>
            )}

            {/* Pincode Dropdown / Autocomplete with Loading Spinner */}
            <Grid item xs={12} md={cityLocations.length > 0 ? 6 : 6}>
              <Autocomplete
                freeSolo
                options={cityPincodes}
                value={formData.deliveryAddress?.pincode || ''}
                loading={isLoadingPincodes}
                onChange={(_, val) => handleAddressChange('pincode', val || '')}
                onInputChange={(_, val) => handleAddressChange('pincode', val || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pincode *"
                    placeholder={isLoadingPincodes ? 'Loading pincodes...' : 'Select from city pincodes or enter 6 digits'}
                    error={!!errors.pincode}
                    helperText={errors.pincode || (isLoadingPincodes ? 'Loading city pincodes & locations...' : cityPincodes.length > 0 ? `${cityPincodes.length} pincodes available for ${formData.deliveryAddress?.city}` : '')}
                    inputProps={{ ...params.inputProps, maxLength: 6 }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingPincodes ? <CircularProgress color="primary" size={20} sx={{ mr: 1 }} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {cityPincodes.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', gap: 0.7, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Suggested:
                  </Typography>
                  {cityPincodes.slice(0, 8).map((pin) => (
                    <Chip
                      key={pin}
                      label={pin}
                      size="small"
                      clickable
                      color={formData.deliveryAddress?.pincode === pin ? 'primary' : 'default'}
                      variant={formData.deliveryAddress?.pincode === pin ? 'filled' : 'outlined'}
                      onClick={() => handleAddressChange('pincode', pin)}
                      sx={{ height: 22, fontSize: '0.72rem' }}
                    />
                  ))}
                  {cityPincodes.length > 8 && (
                    <Typography variant="caption" color="text.secondary">
                      +{cityPincodes.length - 8} more
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>

            {/* Country */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value="India"
                disabled
              />
            </Grid>

            {/* Special Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Special Requirements / Notes"
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                error={!!errors.notes}
                helperText={errors.notes || `${formData.notes?.length || 0}/${VALIDATION.MAX_NOTES_LENGTH} characters`}
              />
            </Grid>

            {/* Summary */}
            {selectedGenerator && formData.quantity && (
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.default' }}>
                  <Typography variant="h6" gutterBottom>
                    Lease Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Generator:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedGenerator.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Daily Rate:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        ₹{selectedGenerator.dailyLeaseRate.toLocaleString('en-IN')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Duration:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {LEASE_DURATIONS.find((d) => d.value === formData.duration)?.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Quantity:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formData.quantity}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Terms and Conditions Agreement Checkbox */}
            <Grid item xs={12}>
              <TermsAgreementCheckbox
                checked={termsAccepted}
                onChange={setTermsAccepted}
                error={errors.terms}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!isAuthenticated || !termsAccepted}
                >
                  Submit Lease Request
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};
