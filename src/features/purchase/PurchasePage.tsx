import { useState, useMemo } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { VALIDATION, TAX_RATE, WARRANTY_OPTIONS } from '../../constants';
import { PurchaseFormData, PaymentMethod } from '../../types/purchase.types';
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

const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'cash', label: 'Cash on Delivery' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'emi', label: 'EMI (Easy Monthly Installments)' },
];

export const PurchasePage = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: generators } = useAppSelector((state) => state.generators);

  const allIndianCities = useMemo(() => getAllIndianCities(), []);
  const [selectedCityOption, setSelectedCityOption] = useState<CityOption | null>(null);
  const [isLoadingPincodes, setIsLoadingPincodes] = useState<boolean>(false);
  const [cityLocations, setCityLocations] = useState<LocationInfo[]>([]);
  const [cityPincodes, setCityPincodes] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<PurchaseFormData>>({
    quantity: 1,
    warranty: 1,
    paymentMethod: 'upi',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    includeInstallation: false,
  });

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

    handleAddressChange('city', cityOption.name);
    handleAddressChange('state', cityOption.state);

    setIsLoadingPincodes(true);
    try {
      const { locations, pincodes } = await getCityLocationsAndPincodes(cityOption.name);
      setCityLocations(locations);
      setCityPincodes(pincodes);
      if (pincodes.length === 1) {
        handleAddressChange('pincode', pincodes[0]);
      }
    } catch {
      // fallback
    } finally {
      setIsLoadingPincodes(false);
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string | number | boolean): void => {
    setFormData((prev: Partial<PurchaseFormData>) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressChange = (field: string, value: string): void => {
    setFormData((prev: Partial<PurchaseFormData>) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress!,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.generatorId) {
      newErrors.generatorId = 'Please select a generator';
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.shippingAddress?.street?.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.shippingAddress?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.shippingAddress?.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.shippingAddress?.pincode?.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.shippingAddress.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (formData.specialRequirements && formData.specialRequirements.length > VALIDATION.MAX_NOTES_LENGTH) {
      newErrors.specialRequirements = `Requirements cannot exceed ${VALIDATION.MAX_NOTES_LENGTH} characters`;
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must read and agree to the Terms & Conditions before placing your order';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setErrors({ form: 'Please login to complete your purchase' });
      return;
    }

    if (!termsAccepted) {
      setErrors((prev) => ({
        ...prev,
        terms: 'You must read and agree to the Terms & Conditions before placing your order',
      }));
      return;
    }

    if (validateForm()) {
      const orderTotals = calculateTotal();
      const newOrder: UnifiedOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `GP-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        orderType: 'generator_purchase',
        customerId: user?.id || 'guest',
        customerName: user ? `${user.firstName} ${user.lastName}` : 'Customer',
        customerEmail: user?.email || 'customer@example.com',
        customerPhone: user?.phone || '+91 9800000000',
        items: [
          {
            id: selectedGenerator!.id,
            name: selectedGenerator!.name,
            modelOrPartNumber: selectedGenerator!.model,
            category: 'Generators',
            imageUrl: selectedGenerator!.imageUrls?.[0],
            unitPrice: selectedGenerator!.salePrice,
            quantity: formData.quantity || 1,
            totalPrice: orderTotals.subtotal,
            specifications: {
              'Power': `${selectedGenerator!.powerCapacityKW} kW`,
              'Fuel': selectedGenerator!.fuelType,
              'Warranty': `${formData.warranty || 1} Year(s)`,
            },
          },
        ],
        subtotal: orderTotals.subtotal,
        taxAmount: orderTotals.gst,
        shippingOrInstallationAmount: orderTotals.installation,
        totalAmount: orderTotals.total,
        shippingAddress: {
          street: formData.shippingAddress?.street || '',
          city: formData.shippingAddress?.city || '',
          state: formData.shippingAddress?.state || '',
          pincode: formData.shippingAddress?.pincode || '',
          country: formData.shippingAddress?.country || 'India',
        },
        paymentMethod: (formData.paymentMethod || 'upi').toUpperCase(),
        paymentStatus: 'paid',
        status: 'pending',
        notes: formData.specialRequirements || '',
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: TERMS_AND_CONDITIONS.version,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(createOrder(newOrder));
      setSubmitSuccess(true);
      setTermsAccepted(false);
      
      // Immediately reset entry fields to empty except default required fields
      setFormData({
        generatorId: '',
        quantity: 1, // default required
        warranty: 1, // default required
        paymentMethod: 'upi', // default required
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India', // default required
        },
        includeInstallation: false,
        specialRequirements: '',
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
  
  const calculateTotal = (): { subtotal: number; gst: number; installation: number; total: number } => {
    if (!selectedGenerator || !formData.quantity) {
      return { subtotal: 0, gst: 0, installation: 0, total: 0 };
    }

    const subtotal = selectedGenerator.salePrice * formData.quantity;
    const gst = subtotal * TAX_RATE;
    const installation = formData.includeInstallation ? 5000 * formData.quantity : 0;
    const total = subtotal + gst + installation;

    return { subtotal, gst, installation, total };
  };

  const totals = calculateTotal();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
        Purchase a Generator
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Own your power solution with our high-quality portable generators. All units come with warranty and installation support.
      </Typography>

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please login or register to complete your purchase.
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Purchase order submitted successfully! We will contact you for payment and delivery details.
        </Alert>
      )}

      {errors.form && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.form}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Generator Selection */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.generatorId}>
                    <InputLabel>Select Generator *</InputLabel>
                    <Select
                      value={formData.generatorId || ''}
                      label="Select Generator *"
                      onChange={(e) => handleInputChange('generatorId', e.target.value)}
                    >
                      {generators.map((gen) => (
                        <MenuItem key={gen.id} value={gen.id}>
                          {gen.name} ({gen.powerCapacityKW} kW) - ₹{gen.salePrice.toLocaleString('en-IN')}
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

                {/* Quantity and Warranty */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity *"
                    value={formData.quantity || 1}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Warranty Period *</InputLabel>
                    <Select
                      value={formData.warranty}
                      label="Warranty Period *"
                      onChange={(e) => handleInputChange('warranty', e.target.value as number)}
                    >
                      {WARRANTY_OPTIONS.map((years) => (
                        <MenuItem key={years} value={years}>
                          {years} Year{years > 1 ? 's' : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Installation */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={formData.includeInstallation === true}
                        onChange={() => handleInputChange('includeInstallation', true)}
                      />
                    }
                    label={`Include Professional Installation (₹5,000 per unit)`}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={formData.includeInstallation === false}
                        onChange={() => handleInputChange('includeInstallation', false)}
                      />
                    }
                    label="Self Installation"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Shipping Address
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address *"
                    value={formData.shippingAddress?.street || ''}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    error={!!errors.street}
                    helperText={errors.street}
                  />
                </Grid>

                {/* City Selection */}
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
                        helperText={errors.city || 'Selecting a city auto-fills state & loads pincodes'}
                      />
                    )}
                  />
                </Grid>

                {/* State */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State *"
                    value={formData.shippingAddress?.state || ''}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    error={!!errors.state}
                    helperText={errors.state || (formData.shippingAddress?.state ? 'Auto-selected based on city' : '')}
                    InputProps={{
                      readOnly: Boolean(selectedCityOption),
                    }}
                  />
                </Grid>

                {/* Associated Locations */}
                {cityLocations.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={cityLocations}
                      getOptionLabel={(loc) => `${loc.name} (${loc.pincode})`}
                      onChange={(_, loc) => {
                        if (loc) {
                          handleAddressChange('pincode', loc.pincode);
                          if (!formData.shippingAddress?.street) {
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
                    value={formData.shippingAddress?.pincode || ''}
                    loading={isLoadingPincodes}
                    onChange={(_, val) => handleAddressChange('pincode', val || '')}
                    onInputChange={(_, val) => handleAddressChange('pincode', val || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pincode *"
                        placeholder={isLoadingPincodes ? 'Loading pincodes...' : 'Select from city pincodes or enter 6 digits'}
                        error={!!errors.pincode}
                        helperText={errors.pincode || (isLoadingPincodes ? 'Loading city pincodes & locations...' : cityPincodes.length > 0 ? `${cityPincodes.length} pincodes available for ${formData.shippingAddress?.city}` : '')}
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
                          color={formData.shippingAddress?.pincode === pin ? 'primary' : 'default'}
                          variant={formData.shippingAddress?.pincode === pin ? 'filled' : 'outlined'}
                          onClick={() => handleAddressChange('pincode', pin)}
                          sx={{ height: 22, fontSize: '0.72rem' }}
                        />
                      ))}
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

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={formData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value as PaymentMethod)}
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <FormControlLabel
                          key={method.value}
                          value={method.value}
                          control={<Radio />}
                          label={method.label}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Special Requirements */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Special Requirements / Notes"
                    value={formData.specialRequirements || ''}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    error={!!errors.specialRequirements}
                    helperText={errors.specialRequirements || `${formData.specialRequirements?.length || 0}/${VALIDATION.MAX_NOTES_LENGTH} characters`}
                  />
                </Grid>

                {/* Terms and Conditions Agreement Checkbox */}
                <Grid item xs={12}>
                  <TermsAgreementCheckbox
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    error={errors.terms}
                  />
                </Grid>

                {/* Submit Buttons */}
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
                      Place Order
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Order Summary Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Order Summary
            </Typography>
            
            {selectedGenerator ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Generator:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedGenerator.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedGenerator.powerCapacityKW} kW | {selectedGenerator.fuelType}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      Price × {formData.quantity}
                    </Typography>
                    <Typography variant="body2">
                      ₹{totals.subtotal.toLocaleString('en-IN')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      GST (18%)
                    </Typography>
                    <Typography variant="body2">
                      ₹{totals.gst.toLocaleString('en-IN')}
                    </Typography>
                  </Box>

                  {formData.includeInstallation && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        Installation
                      </Typography>
                      <Typography variant="body2">
                        ₹{totals.installation.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      Warranty
                    </Typography>
                    <Typography variant="body2">
                      {formData.warranty} Year{(formData.warranty || 0) > 1 ? 's' : ''}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={700}>
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      ₹{totals.total.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Box>

                <Alert severity="info" sx={{ mt: 3 }}>
                  Free delivery within 7-10 business days
                </Alert>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Select a generator to see pricing details
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
