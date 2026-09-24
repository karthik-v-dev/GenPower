import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Divider,
  Alert,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  Generator,
  GeneratorStatus,
  GeneratorType,
  FuelType,
} from '../../types/generator.types';
import { GENERATOR_PLACEHOLDER_IMAGES } from '../../constants';

interface GeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (generator: Generator) => void;
  generator?: Generator | null;
}

export const GeneratorModal: React.FC<GeneratorModalProps> = ({
  open,
  onClose,
  onSave,
  generator,
}) => {
  const isEditing = Boolean(generator);

  const [formData, setFormData] = useState<Partial<Generator>>({
    name: '',
    model: '',
    manufacturer: '',
    serialNumber: '',
    powerCapacityKW: 5,
    voltage: 230,
    phase: 1,
    fuelType: FuelType.PETROL,
    type: GeneratorType.PORTABLE,
    status: GeneratorStatus.AVAILABLE,
    year: new Date().getFullYear(),
    hours: 0,
    description: '',
    specifications: {
      'Engine Type': '4-Stroke OHV',
      'Cooling System': 'Air Cooled',
      'Starting System': 'Electric + Recoil',
      'Fuel Tank Capacity': '15 Liters',
      'Noise Level': '65 dB',
      'Runtime': '8 Hours at 50% load',
      'Weight': '45 kg',
      'Dimensions': '65 x 50 x 55 cm',
    },
    imageUrls: [GENERATOR_PLACEHOLDER_IMAGES[0]],
    purchasePrice: 45000,
    salePrice: 55000,
    dailyLeaseRate: 800,
    weeklyLeaseRate: 4500,
    monthlyLeaseRate: 16000,
    location: 'Warangal',
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (generator) {
      setFormData({
        ...generator,
        specifications: generator.specifications || {},
        imageUrls: generator.imageUrls?.length
          ? generator.imageUrls
          : [GENERATOR_PLACEHOLDER_IMAGES[0]],
      });
      setImageUrlInput(generator.imageUrls?.[0] || '');
    } else {
      const defaultData: Partial<Generator> = {
        id: `gen-${Date.now()}`,
        name: '',
        model: '',
        manufacturer: 'Honda',
        serialNumber: `SN${Math.floor(100000 + Math.random() * 900000)}`,
        powerCapacityKW: 5,
        voltage: 230,
        phase: 1,
        fuelType: FuelType.PETROL,
        type: GeneratorType.PORTABLE,
        status: GeneratorStatus.AVAILABLE,
        year: new Date().getFullYear(),
        hours: 0,
        description: '',
        specifications: {
          'Engine Type': '4-Stroke OHV',
          'Cooling System': 'Air Cooled',
          'Starting System': 'Electric + Recoil',
          'Fuel Tank Capacity': '15 Liters',
          'Noise Level': '65 dB',
          'Runtime': '8 Hours at 50% load',
          'Weight': '45 kg',
          'Dimensions': '65 x 50 x 55 cm',
        },
        imageUrls: [GENERATOR_PLACEHOLDER_IMAGES[0]],
        purchasePrice: 45000,
        salePrice: 55000,
        dailyLeaseRate: 800,
        weeklyLeaseRate: 4500,
        monthlyLeaseRate: 16000,
        location: 'Warangal',
      };
      setFormData(defaultData);
      setImageUrlInput(GENERATOR_PLACEHOLDER_IMAGES[0]);
    }
    setError(null);
  }, [generator, open]);

  const handleInputChange = (field: keyof Generator, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setImageUrlInput(base64Url);
        setFormData((prev) => ({
          ...prev,
          imageUrls: [base64Url, ...(prev.imageUrls || []).slice(1)],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [imageUrlInput.trim(), ...(prev.imageUrls || []).slice(1)],
      }));
    }
  };

  const handleAddSpecification = () => {
    if (!newSpecKey.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [newSpecKey.trim()]: newSpecVal.trim(),
      },
    }));
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpecification = (key: string) => {
    setFormData((prev) => {
      const nextSpecs = { ...(prev.specifications || {}) };
      delete nextSpecs[key];
      return {
        ...prev,
        specifications: nextSpecs,
      };
    });
  };

  const handleSpecValueChange = (key: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [key]: val,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setError('Generator Name is required');
      return;
    }
    if (!formData.model?.trim()) {
      setError('Model is required');
      return;
    }
    if (!formData.manufacturer?.trim()) {
      setError('Manufacturer is required');
      return;
    }
    if (!formData.salePrice || formData.salePrice <= 0) {
      setError('Valid Sale Price is required');
      return;
    }

    const currentImage = imageUrlInput.trim() || formData.imageUrls?.[0] || GENERATOR_PLACEHOLDER_IMAGES[0];

    const generatorToSave: Generator = {
      id: formData.id || `gen-${Date.now()}`,
      name: formData.name.trim(),
      model: formData.model.trim(),
      manufacturer: formData.manufacturer.trim(),
      serialNumber: formData.serialNumber?.trim() || `SN${Date.now()}`,
      powerCapacityKW: Number(formData.powerCapacityKW) || 1,
      voltage: Number(formData.voltage) || 230,
      phase: Number(formData.phase) || 1,
      fuelType: formData.fuelType || FuelType.PETROL,
      type: formData.type || GeneratorType.PORTABLE,
      status: formData.status || GeneratorStatus.AVAILABLE,
      year: Number(formData.year) || new Date().getFullYear(),
      hours: Number(formData.hours) || 0,
      description:
        formData.description?.trim() ||
        `${formData.manufacturer} ${formData.model} ${formData.powerCapacityKW}kW generator. Reliable power source for commercial and residential requirements.`,
      specifications: formData.specifications || {},
      imageUrls: [currentImage],
      purchasePrice: Number(formData.purchasePrice) || Number(formData.salePrice) * 0.8,
      salePrice: Number(formData.salePrice) || 50000,
      dailyLeaseRate: Number(formData.dailyLeaseRate) || 800,
      weeklyLeaseRate: Number(formData.weeklyLeaseRate) || 4500,
      monthlyLeaseRate: Number(formData.monthlyLeaseRate) || 16000,
      location: formData.location?.trim() || 'Warangal',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(generatorToSave);
    onClose();
  };

  const previewImage = imageUrlInput || formData.imageUrls?.[0] || GENERATOR_PLACEHOLDER_IMAGES[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEditing ? `Edit Generator: ${generator?.name}` : 'Create New Generator Model'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" id="generator-modal-form" onSubmit={handleSubmit}>
          {/* Top Section: Photo & Basic Details */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            1. Image & Basic Details
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={previewImage}
                  alt="Generator Preview"
                  sx={{
                    borderRadius: 2,
                    objectFit: 'cover',
                    border: '1px solid #e0e0e0',
                    mb: 1.5,
                    width: '100%',
                    backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f5f5f5',
                  }}
                  onError={(e: any) => {
                    e.target.src = GENERATOR_PLACEHOLDER_IMAGES[0];
                  }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 1 }}
                >
                  Upload Photo
                  <input type="file" accept="image/*" hidden onChange={handleImageFileUpload} />
                </Button>
                <Typography variant="caption" color="text.secondary" align="center">
                  PNG, JPG up to 5MB, or paste image URL below
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Image URL"
                      placeholder="https://..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                    />
                    <Button variant="contained" size="small" onClick={handleApplyImageUrl}>
                      Apply
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Generator Name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Honda EP2500 2kW"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Model"
                    value={formData.model || ''}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g. EP2500"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Manufacturer"
                    value={formData.manufacturer || ''}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    placeholder="e.g. Honda, Yamaha, Kirloskar"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Serial Number"
                    value={formData.serialNumber || ''}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    label="Status"
                    value={formData.status || GeneratorStatus.AVAILABLE}
                    onChange={(e) => handleInputChange('status', e.target.value as GeneratorStatus)}
                  >
                    <MenuItem value={GeneratorStatus.AVAILABLE}>Available</MenuItem>
                    <MenuItem value={GeneratorStatus.LEASED}>Leased</MenuItem>
                    <MenuItem value={GeneratorStatus.SOLD}>Sold</MenuItem>
                    <MenuItem value={GeneratorStatus.IN_SERVICE}>In Service</MenuItem>
                    <MenuItem value={GeneratorStatus.OUT_OF_ORDER}>Out of Order</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Location / City"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Technical Specifications */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            2. Technical Parameters & Power
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                type="number"
                size="small"
                label="Power Capacity (kW)"
                value={formData.powerCapacityKW ?? 5}
                onChange={(e) => handleInputChange('powerCapacityKW', parseFloat(e.target.value))}
                inputProps={{ min: 0.5, step: 0.5 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Fuel Type"
                value={formData.fuelType || FuelType.PETROL}
                onChange={(e) => handleInputChange('fuelType', e.target.value as FuelType)}
              >
                <MenuItem value={FuelType.PETROL}>Petrol</MenuItem>
                <MenuItem value={FuelType.DIESEL}>Diesel</MenuItem>
                <MenuItem value={FuelType.DUAL_FUEL}>Dual Fuel</MenuItem>
                <MenuItem value={FuelType.LPG}>LPG</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Voltage (V)"
                value={formData.voltage ?? 230}
                onChange={(e) => handleInputChange('voltage', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Phase"
                value={formData.phase ?? 1}
                onChange={(e) => handleInputChange('phase', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Year of Manufacture"
                value={formData.year ?? new Date().getFullYear()}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Operating Hours"
                value={formData.hours ?? 0}
                onChange={(e) => handleInputChange('hours', parseInt(e.target.value))}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Pricing & Lease Rates */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            3. Pricing & Rates (₹ INR)
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                type="number"
                size="small"
                label="Sale Price (₹)"
                value={formData.salePrice ?? 55000}
                onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Purchase Cost (₹)"
                value={formData.purchasePrice ?? 45000}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Daily Lease Rate (₹)"
                value={formData.dailyLeaseRate ?? 800}
                onChange={(e) => handleInputChange('dailyLeaseRate', parseFloat(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Weekly Lease Rate (₹)"
                value={formData.weeklyLeaseRate ?? 4500}
                onChange={(e) => handleInputChange('weeklyLeaseRate', parseFloat(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Monthly Lease Rate (₹)"
                value={formData.monthlyLeaseRate ?? 16000}
                onChange={(e) => handleInputChange('monthlyLeaseRate', parseFloat(e.target.value))}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Dynamic Specifications */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            4. Detailed Specifications
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Feature / Spec Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '50%' }}>Value</TableCell>
                  <TableCell sx={{ width: '10%' }} align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(formData.specifications || {}).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 500 }}>{key}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="standard"
                        value={val}
                        onChange={(e) => handleSpecValueChange(key, e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveSpecification(key)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add custom spec row */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              size="small"
              placeholder="e.g. Fuel Tank Capacity"
              label="New Spec Name"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              sx={{ width: '45%' }}
            />
            <TextField
              size="small"
              placeholder="e.g. 15 Liters"
              label="Spec Value"
              value={newSpecVal}
              onChange={(e) => setNewSpecVal(e.target.value)}
              sx={{ width: '45%' }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddSpecification}
              sx={{ width: '10%', minWidth: 80 }}
            >
              Add
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            5. Description & Overview
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Product Description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Detailed description of performance, ideal applications, reliability, etc."
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="generator-modal-form"
          variant="contained"
          size="medium"
          sx={{ px: 3 }}
        >
          {isEditing ? 'Save Changes' : 'Create Generator'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
