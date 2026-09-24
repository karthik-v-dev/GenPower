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
  SparePart,
  PartCategory,
  PartStatus,
} from '../../types/spareParts.types';
import { SPARE_PART_PLACEHOLDER_IMAGES } from '../../constants';

interface SparePartModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (part: SparePart) => void;
  part?: SparePart | null;
}

export const SparePartModal: React.FC<SparePartModalProps> = ({
  open,
  onClose,
  onSave,
  part,
}) => {
  const isEditing = Boolean(part);

  const [formData, setFormData] = useState<Partial<SparePart>>({
    name: '',
    partNumber: '',
    category: PartCategory.FILTERS,
    manufacturer: 'Honda',
    compatibleModels: ['EP2500', 'EF3000iSEB', 'KG1-3AS'],
    price: 750,
    stock: 25,
    stockQuantity: 25,
    minimumOrderQuantity: 1,
    status: PartStatus.IN_STOCK,
    weight: 0.5,
    dimensions: '10 x 8 x 8 cm',
    warrantyMonths: 12,
    imageUrl: SPARE_PART_PLACEHOLDER_IMAGES[0],
    imageUrls: [SPARE_PART_PLACEHOLDER_IMAGES[0]],
    description: '',
    specifications: {
      'OEM Part': 'Yes',
      'Material': 'High-grade synthetic',
      'Country of Origin': 'India',
    },
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [compatibleModelsInput, setCompatibleModelsInput] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (part) {
      setFormData({
        ...part,
        specifications: part.specifications || {},
        compatibleModels: part.compatibleModels || [],
        imageUrl: part.imageUrl || SPARE_PART_PLACEHOLDER_IMAGES[0],
      });
      setImageUrlInput(part.imageUrl || part.imageUrls?.[0] || '');
      setCompatibleModelsInput((part.compatibleModels || []).join(', '));
    } else {
      const defaultData: Partial<SparePart> = {
        id: `part-${Date.now()}`,
        name: '',
        partNumber: `PN${Math.floor(100000 + Math.random() * 900000)}`,
        category: PartCategory.FILTERS,
        manufacturer: 'Honda',
        compatibleModels: ['EP2500', 'EF3000iSEB', 'KG1-3AS'],
        price: 750,
        stock: 25,
        stockQuantity: 25,
        minimumOrderQuantity: 1,
        status: PartStatus.IN_STOCK,
        weight: 0.5,
        dimensions: '10 x 8 x 8 cm',
        warrantyMonths: 12,
        imageUrl: SPARE_PART_PLACEHOLDER_IMAGES[0],
        imageUrls: [SPARE_PART_PLACEHOLDER_IMAGES[0]],
        description: '',
        specifications: {
          'OEM Part': 'Yes',
          'Material': 'High-grade synthetic',
          'Country of Origin': 'India',
        },
      };
      setFormData(defaultData);
      setImageUrlInput(SPARE_PART_PLACEHOLDER_IMAGES[0]);
      setCompatibleModelsInput('EP2500, EF3000iSEB, KG1-3AS');
    }
    setError(null);
  }, [part, open]);

  const handleInputChange = (field: keyof SparePart, value: any) => {
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
          imageUrl: base64Url,
          imageUrls: [base64Url],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: imageUrlInput.trim(),
        imageUrls: [imageUrlInput.trim()],
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
      setError('Part Name is required');
      return;
    }
    if (!formData.partNumber?.trim()) {
      setError('Part Number is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Valid Price is required');
      return;
    }

    const currentImage = imageUrlInput.trim() || formData.imageUrl || SPARE_PART_PLACEHOLDER_IMAGES[0];
    const compatibleList = compatibleModelsInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const partToSave: SparePart = {
      id: formData.id || `part-${Date.now()}`,
      name: formData.name.trim(),
      partNumber: formData.partNumber.trim(),
      category: formData.category || PartCategory.FILTERS,
      manufacturer: formData.manufacturer?.trim() || 'Honda',
      compatibleModels: compatibleList.length > 0 ? compatibleList : ['Universal'],
      price: Number(formData.price) || 500,
      stock: Number(formData.stockQuantity ?? formData.stock) || 10,
      stockQuantity: Number(formData.stockQuantity ?? formData.stock) || 10,
      minimumOrderQuantity: Number(formData.minimumOrderQuantity) || 1,
      status: formData.status || PartStatus.IN_STOCK,
      weight: Number(formData.weight) || 0.5,
      dimensions: formData.dimensions?.trim() || '10 x 8 x 8 cm',
      warrantyMonths: Number(formData.warrantyMonths) || 12,
      imageUrl: currentImage,
      imageUrls: [currentImage],
      specifications: formData.specifications || {},
      description:
        formData.description?.trim() ||
        `Genuine replacement ${formData.name} by ${formData.manufacturer}. Built to OEM standards.`,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(partToSave);
    onClose();
  };

  const previewImage = imageUrlInput || formData.imageUrl || SPARE_PART_PLACEHOLDER_IMAGES[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEditing ? `Edit Spare Part: ${part?.name}` : 'Create New Spare Part'}
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

        <Box component="form" id="spare-part-modal-form" onSubmit={handleSubmit}>
          {/* Section 1: Image & Basic Info */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            1. Image & Part Details
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={previewImage}
                  alt="Spare Part Preview"
                  sx={{
                    borderRadius: 2,
                    objectFit: 'cover',
                    border: '1px solid #e0e0e0',
                    mb: 1.5,
                    width: '100%',
                    backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f5f5f5',
                  }}
                  onError={(e: any) => {
                    e.target.src = SPARE_PART_PLACEHOLDER_IMAGES[0];
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
                    label="Part Number"
                    value={formData.partNumber || ''}
                    onChange={(e) => handleInputChange('partNumber', e.target.value)}
                    placeholder="e.g. OF-001 or PN10002"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    label="Part Name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Honda Oil Filter"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    size="small"
                    label="Category"
                    value={formData.category || PartCategory.FILTERS}
                    onChange={(e) => handleInputChange('category', e.target.value as PartCategory)}
                  >
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

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Manufacturer"
                    value={formData.manufacturer || ''}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    placeholder="e.g. Honda, Yamaha, Kirloskar"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Compatible Generator Models (comma separated)"
                    value={compatibleModelsInput}
                    onChange={(e) => setCompatibleModelsInput(e.target.value)}
                    placeholder="e.g. EP2500, EF3000, KG1-3AS"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section 2: Pricing & Stock */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            2. Price & Inventory Stock
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                type="number"
                size="small"
                label="Price (₹)"
                value={formData.price ?? 500}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                type="number"
                size="small"
                label="Stock Quantity"
                value={formData.stockQuantity ?? formData.stock ?? 20}
                onChange={(e) => {
                  const qty = parseInt(e.target.value) || 0;
                  handleInputChange('stockQuantity', qty);
                  handleInputChange('stock', qty);
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Min Order Qty"
                value={formData.minimumOrderQuantity ?? 1}
                onChange={(e) => handleInputChange('minimumOrderQuantity', parseInt(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Stock Status"
                value={formData.status || PartStatus.IN_STOCK}
                onChange={(e) => handleInputChange('status', e.target.value as PartStatus)}
              >
                <MenuItem value={PartStatus.IN_STOCK}>In Stock</MenuItem>
                <MenuItem value={PartStatus.LOW_STOCK}>Low Stock</MenuItem>
                <MenuItem value={PartStatus.OUT_OF_STOCK}>Out of Stock</MenuItem>
                <MenuItem value={PartStatus.DISCONTINUED}>Discontinued</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Warranty (Months)"
                value={formData.warrantyMonths ?? 12}
                onChange={(e) => handleInputChange('warrantyMonths', parseInt(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Weight (kg)"
                value={formData.weight ?? 0.5}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                inputProps={{ step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Dimensions (e.g. 10x8x8 cm)"
                value={formData.dimensions || ''}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Section 3: Dynamic Specifications */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            3. Specifications & Attributes
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>Attribute Name</TableCell>
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

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              size="small"
              placeholder="e.g. Material"
              label="Attribute Name"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              sx={{ width: '45%' }}
            />
            <TextField
              size="small"
              placeholder="e.g. Steel / Copper"
              label="Attribute Value"
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

          {/* Section 4: Description */}
          <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
            4. Description
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Part Description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Detailed description of the spare part, fitment guarantee, OEM quality, etc."
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
          form="spare-part-modal-form"
          variant="contained"
          size="medium"
          sx={{ px: 3 }}
        >
          {isEditing ? 'Save Changes' : 'Create Spare Part'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
