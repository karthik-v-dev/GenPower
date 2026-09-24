import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Gavel as LegalIcon,
  Percent as PercentIcon,
  CloudDone as CloudDoneIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { TERMS_AND_CONDITIONS, SERVICE_DISCOUNT_TIERS } from '../../constants/terms';
import { termsPdfService, StoredTermsDocument } from '../../services/termsPdfService';
import { productStorageService } from '../../services/productStorage.service';

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  open,
  onClose,
  onAccept,
  showAcceptButton = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [storedDoc, setStoredDoc] = useState<StoredTermsDocument | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  useEffect(() => {
    if (open) {
      loadDocument();
    }
  }, [open]);

  const loadDocument = async () => {
    setLoadingDoc(true);
    try {
      const doc = await productStorageService.getTermsDocument();
      setStoredDoc(doc);
    } catch (e) {
      console.warn('Error loading terms document:', e);
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleDownload = () => {
    termsPdfService.downloadPdf('GenPower_Official_Terms_And_Conditions.pdf');
  };

  const handleAcceptAndClose = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Title Header */}
      <DialogTitle
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          backgroundColor: (t) =>
            t.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : '#f8fafc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              color: '#ffffff',
              display: 'flex',
            }}
          >
            <LegalIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
              Terms & Conditions & Service Policy
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Official Agreement • Version {TERMS_AND_CONDITIONS.version} • Effective {TERMS_AND_CONDITIONS.effectiveDate}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2.5 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Key Policy Summary" sx={{ fontWeight: 600 }} />
          <Tab label="Full Agreement Clauses" sx={{ fontWeight: 600 }} />
          <Tab label="Service Discount Matrix" icon={<PercentIcon sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ fontWeight: 600 }} />
          <Tab label="Official PDF Document" icon={<PdfIcon sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
        {/* Tab 0: Key Policy Summary */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Non-Refundable / Repair Only Callout */}
            <Alert
              severity="error"
              icon={<WarningIcon fontSize="inherit" />}
              sx={{
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                STRICT POLICY: ONCE ORDERED, PRODUCT OR MONEY IS NOT RETURNABLE
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                All generator purchases, lease bookings, and spare parts orders are final. Products and payments cannot be returned or refunded once an order is placed. <strong>Only authorized repair and maintenance services will be performed</strong> by GenPower certified technicians in the event of equipment issues.
              </Typography>
            </Alert>

            {/* Free Services & Equipment Cost Notice */}
            <Alert
              severity="warning"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                TWO (2) FREE MAINTENANCE SERVICES — EQUIPMENT COSTS ARE BILLED
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                Every generator purchase includes <strong>two (2) free routine maintenance visits</strong> (technician inspection and labor are 100% free). However, <strong>all equipment costs, replacement parts, lubricants, filters, and consumables must be imposed on / borne by the customer</strong>.
              </Typography>
            </Alert>

            {/* Discount Tiers Notice */}
            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                '& .MuiAlert-message': { width: '100%' },
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                TIERED PAID SERVICE DISCOUNTS
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                Once the 2 free services are completed, customer transitions to paid routine services:
                <br />
                • <strong>First 3 Paid Services (Services 3, 4, 5)</strong>: <strong>20% DISCOUNT</strong> on service charges.
                <br />
                • <strong>Next 3 Paid Services (Services 6, 7, 8)</strong>: <strong>10% DISCOUNT</strong> on service charges.
                <br />
                • <strong>Beyond Service 8 (Service 9+)</strong>: <strong>0% DISCOUNT</strong> (Standard commercial service rates).
              </Typography>
            </Alert>

            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Summary of Core Conditions:
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { mb: 1.2, color: 'text.secondary' } }}>
                {TERMS_AND_CONDITIONS.summaryPoints.map((pt, idx) => (
                  <li key={idx}>
                    <Typography variant="body2" color="text.primary">
                      {pt}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Tab 1: Full Agreement Clauses */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Please carefully review the full terms governing all transactions, warranties, service calls, and orders with GenPower Solutions.
            </Typography>

            {TERMS_AND_CONDITIONS.clauses.map((clause) => (
              <Paper
                key={clause.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: (t) =>
                    t.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : '#ffffff',
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} color="primary" gutterBottom>
                  {clause.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}
                >
                  {clause.content}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}

        {/* Tab 2: Service Discount Matrix */}
        {activeTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                Schedule A: Routine Maintenance & Service Fee Discount Matrix
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Below is the clear discount tier structure applicable to all customer generators after delivery:
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: (t) => t.palette.mode === 'dark' ? '#141e33' : '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Service Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tier Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Labor / Service Charge</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Equipment / Consumable Cost</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Discount Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SERVICE_DISCOUNT_TIERS.map((tier) => (
                    <TableRow key={tier.tierNumber} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{tier.serviceRange}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {tier.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tier.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tier.laborCharge}
                          size="small"
                          color={tier.discountPercentage === 100 ? 'success' : tier.discountPercentage > 0 ? 'primary' : 'default'}
                          variant={tier.discountPercentage > 0 ? 'filled' : 'outlined'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tier.equipmentCost}
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          color={tier.discountPercentage > 0 ? 'primary.main' : 'text.secondary'}
                        >
                          {tier.discountPercentage > 0 ? `${tier.discountPercentage}% OFF` : '0% (Standard)'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <strong>Important Principle:</strong> Even during the two 100% free labor maintenance visits, any required replacement equipment, oils, spark plugs, filters, or parts must be paid for by the customer.
            </Alert>
          </Box>
        )}

        {/* Tab 3: Official PDF Document */}
        {activeTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: (t) =>
                  t.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PdfIcon color="error" sx={{ fontSize: 36 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight={800}>
                    {storedDoc?.title || 'GenPower Official Terms Document (PDF)'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Version: {storedDoc?.version || TERMS_AND_CONDITIONS.version} • Size: ~{storedDoc?.fileSizeKb || 45} KB • Cloud Synced
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  size="small"
                >
                  Download PDF
                </Button>
              </Box>
            </Box>

            {loadingDoc ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : storedDoc?.pdfDataUri ? (
              <Box
                sx={{
                  border: (t) => `1px solid ${t.palette.divider}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: 480,
                  bgcolor: '#525659',
                }}
              >
                <iframe
                  src={storedDoc.pdfDataUri}
                  title="Official Terms & Conditions PDF Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              </Box>
            ) : (
              <Alert severity="info">
                PDF document ready. Click &quot;Download PDF&quot; to save the official copy to your device.
              </Alert>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CloudDoneIcon color="success" fontSize="small" />
              <Typography variant="caption">
                Pushed and verified with Realtime Database (terms_conditions/latest).
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <Divider />

      {/* Footer Actions */}
      <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between' }}>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          variant="outlined"
          color="inherit"
          size="small"
        >
          Download PDF Document
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Close
          </Button>

          {showAcceptButton && (
            <Button
              onClick={handleAcceptAndClose}
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
            >
              I Understand & Accept
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
