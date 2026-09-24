import { useState } from 'react';
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
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Build,
  Settings,
  CheckCircle,
  Schedule,
  Emergency,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../hooks';
import { VALIDATION, TIME_SLOTS } from '../../constants';
import { ServiceFormData, ServiceType } from '../../types/service.types';

const SERVICE_TYPES: Array<{ value: ServiceType; label: string; description: string; icon: React.ReactElement }> = [
  {
    value: 'maintenance',
    label: 'Regular Maintenance',
    description: 'Scheduled maintenance and inspection',
    icon: <Settings />,
  },
  {
    value: 'repair',
    label: 'Repair Service',
    description: 'Fix issues and faults',
    icon: <Build />,
  },
  {
    value: 'inspection',
    label: 'Safety Inspection',
    description: 'Complete safety check',
    icon: <CheckCircle />,
  },
  {
    value: 'installation',
    label: 'Installation',
    description: 'Professional setup service',
    icon: <Schedule />,
  },
  {
    value: 'emergency',
    label: 'Emergency Service',
    description: '24/7 urgent repairs',
    icon: <Emergency />,
  },
];

const URGENCY_LEVELS = [
  { value: 'low', label: 'Low - Schedule within a week', color: 'success' as const },
  { value: 'medium', label: 'Medium - Within 2-3 days', color: 'warning' as const },
  { value: 'high', label: 'High - Within 24 hours', color: 'error' as const },
  { value: 'emergency', label: 'Emergency - Immediate attention', color: 'error' as const },
];

export const ServicePage = (): React.ReactElement => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: generators } = useAppSelector((state) => state.generators);

  const [formData, setFormData] = useState<Partial<ServiceFormData>>({
    serviceType: 'maintenance',
    urgency: 'medium',
    preferredDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string): void => {
    setFormData((prev: Partial<ServiceFormData>) => ({
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.generatorId) {
      newErrors.generatorId = 'Please select a generator';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Preferred time slot is required';
    }

    if (!formData.issueDescription?.trim()) {
      newErrors.issueDescription = 'Please describe the issue or service needed';
    } else if (formData.issueDescription.length < 10) {
      newErrors.issueDescription = 'Description must be at least 10 characters';
    } else if (formData.issueDescription.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
      newErrors.issueDescription = `Description cannot exceed ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (!formData.contactPhone?.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Invalid Indian mobile number';
    }

    if (!formData.serviceAddress?.trim()) {
      newErrors.serviceAddress = 'Service address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setErrors({ form: 'Please login to request a service' });
      return;
    }

    if (validateForm()) {
      console.log('Service Request:', formData);
      toast.success('Service request submitted successfully! Our team will contact you shortly.');
      setSubmitSuccess(true);
      
      // Immediately reset all entry fields to empty except default required fields
      setFormData({
        generatorId: '',
        serviceType: 'maintenance', // default required
        urgency: 'medium', // default required
        preferredDate: new Date().toISOString().split('T')[0], // default required
        preferredTime: '10:00 AM - 12:00 PM', // default required
        issueDescription: '',
        contactPhone: '',
        serviceAddress: '',
      });
      setErrors({});

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
  };

  const selectedGenerator = generators.find((g) => g.id === formData.generatorId);
  const selectedServiceType = SERVICE_TYPES.find((s) => s.value === formData.serviceType);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4 } }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        fontWeight={700}
        sx={{ fontSize: { xs: '1.45rem', sm: '2rem', md: '2.5rem' } }}
      >
        Generator Service Request
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Expert service and maintenance for your generator. Our certified technicians ensure your power supply is always reliable.
      </Typography>

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please login or register to submit a service request.
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Service request submitted successfully! Our team will contact you shortly to confirm the appointment.
        </Alert>
      )}

      {errors.form && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.form}
        </Alert>
      )}

      {/* Service Type Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }} alignItems="stretch">
        {SERVICE_TYPES.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.value} sx={{ display: 'flex' }}>
            <Card
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                borderRadius: 2.5,
                border: formData.serviceType === service.value ? 2 : 1,
                borderColor: formData.serviceType === service.value ? 'primary.main' : 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 2,
                },
              }}
              onClick={() => handleInputChange('serviceType', service.value)}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 1, color: 'primary.main', display: 'flex' }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {service.label}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 4 }}>
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
                  <MenuItem value="">
                    <em>Select a generator</em>
                  </MenuItem>
                  {generators.map((gen) => (
                    <MenuItem key={gen.id} value={gen.id}>
                      {gen.name} ({gen.powerCapacityKW} kW)
                    </MenuItem>
                  ))}
                  <MenuItem value="other">
                    <em>Other (Non-GenPower unit)</em>
                  </MenuItem>
                </Select>
                {errors.generatorId && (
                  <Typography variant="caption" color="error">
                    {errors.generatorId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Urgency Level */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Urgency Level *</InputLabel>
                <Select
                  value={formData.urgency}
                  label="Urgency Level *"
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                >
                  {URGENCY_LEVELS.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={level.value.toUpperCase()} size="small" color={level.color} />
                        <Typography variant="body2">{level.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Preferred Date and Time */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Preferred Date *"
                value={formData.preferredDate || ''}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                error={!!errors.preferredDate}
                helperText={errors.preferredDate}
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

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.preferredTime}>
                <InputLabel>Preferred Time Slot *</InputLabel>
                <Select
                  value={formData.preferredTime || ''}
                  label="Preferred Time Slot *"
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                >
                  {TIME_SLOTS.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
                {errors.preferredTime && (
                  <Typography variant="caption" color="error">
                    {errors.preferredTime}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Phone *"
                value={formData.contactPhone || ''}
                onChange={(e) => handleInputChange('contactPhone', e.target.value.replace(/\D/g, ''))}
                error={!!errors.contactPhone}
                helperText={errors.contactPhone || 'Enter 10-digit mobile number'}
                placeholder="9876543210"
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Alternate Phone"
                value={formData.alternatePhone || ''}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            {/* Service Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Service Address *"
                value={formData.serviceAddress || ''}
                onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
                error={!!errors.serviceAddress}
                helperText={errors.serviceAddress || 'Full address where service is needed'}
                placeholder="Building/House No., Street, Area, City, State, Pincode"
              />
            </Grid>

            {/* Issue Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Issue Description / Service Details *"
                value={formData.issueDescription || ''}
                onChange={(e) => handleInputChange('issueDescription', e.target.value)}
                error={!!errors.issueDescription}
                helperText={
                  errors.issueDescription ||
                  `Describe the issue, symptoms, or service requirements in detail. ${formData.issueDescription?.length || 0}/${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`
                }
                placeholder="Please describe what's happening with your generator, any error messages, unusual sounds, or what service you need..."
              />
            </Grid>

            {/* Summary Box */}
            {selectedGenerator && selectedServiceType && (
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, bgcolor: 'background.default' }}>
                  <Typography variant="h6" gutterBottom>
                    Service Request Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Service Type:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedServiceType.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Generator:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedGenerator.id === 'other' ? 'Non-GenPower Unit' : selectedGenerator.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Preferred Date:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString('en-IN') : 'Not selected'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Urgency:
                      </Typography>
                      <Chip
                        label={formData.urgency?.toUpperCase()}
                        size="small"
                        color={URGENCY_LEVELS.find((l) => l.value === formData.urgency)?.color || 'default'}
                      />
                    </Grid>
                  </Grid>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    {formData.urgency === 'emergency'
                      ? '🚨 Emergency services available 24/7. We will contact you immediately.'
                      : formData.urgency === 'high'
                      ? '⚡ High priority request. We aim to respond within 24 hours.'
                      : '✓ Service request will be scheduled at your preferred date and time.'}
                  </Alert>
                </Paper>
              </Grid>
            )}

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  justifyContent: 'flex-end',
                  flexDirection: { xs: 'column-reverse', sm: 'row' },
                  width: '100%',
                }}
              >
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => window.history.back()}
                  sx={{ width: { xs: '100%', sm: 'auto' }, py: { xs: 0.9, sm: 1.25 } }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={!isAuthenticated}
                  sx={{ width: { xs: '100%', sm: 'auto' }, py: { xs: 0.9, sm: 1.25 } }}
                >
                  Submit Service Request
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Service Information */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Paper
              elevation={1}
              sx={{
                p: 3.5,
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                minHeight: 180,
              }}
            >
              <Schedule sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={700}>
                Quick Response
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Same-day service available for emergency requests
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Paper
              elevation={1}
              sx={{
                p: 3.5,
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                minHeight: 180,
              }}
            >
              <Build sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={700}>
                Certified Technicians
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All our technicians are trained and certified
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
            <Paper
              elevation={1}
              sx={{
                p: 3.5,
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                minHeight: 180,
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={700}>
                Quality Guarantee
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All service work comes with a 90-day warranty
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
