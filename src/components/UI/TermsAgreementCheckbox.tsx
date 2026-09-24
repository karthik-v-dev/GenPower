import React, { useState } from 'react';
import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import {
  Gavel as LegalIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { TermsModal } from './TermsModal';

interface TermsAgreementCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const TermsAgreementCheckbox: React.FC<TermsAgreementCheckboxProps> = ({
  checked,
  onChange,
  error,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: 2,
          borderWidth: checked ? 1.5 : error ? 2 : 1,
          borderColor: error ? 'error.main' : checked ? 'primary.main' : 'divider',
          backgroundColor: (t) =>
            checked
              ? t.palette.mode === 'dark'
                ? 'rgba(25, 118, 210, 0.08)'
                : 'rgba(25, 118, 210, 0.04)'
              : t.palette.mode === 'dark'
              ? 'rgba(30, 41, 59, 0.4)'
              : '#fafafa',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Policy Badges */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
          <Chip
            icon={<WarningIcon sx={{ fontSize: '14px !important' }} />}
            label="Non-Returnable & Non-Refundable (Repair Only)"
            size="small"
            color="error"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
          <Chip
            label="2 Free Routine Services (Equipment/Parts Billed)"
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
          <Chip
            label="Discounts: 20% off next 3, 10% off next 3, then 0%"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
        </Box>

        {/* Checkbox with legal acknowledgment */}
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              color="primary"
              sx={{ alignSelf: 'flex-start', mt: -0.3 }}
            />
          }
          label={
            <Typography variant="body2" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
              <strong>I agree to the GenPower Terms &amp; Conditions:</strong> I understand that once ordered, products and payments are <strong>strictly non-returnable and non-refundable</strong>, and only authorized repair service will be performed. I also acknowledge the <strong>two free routine maintenance services (with equipment/parts costs borne by customer)</strong> and the <strong>tiered service discounts</strong> (20% off next 3 paid services, 10% off subsequent 3, and 0% thereafter).
            </Typography>
          }
        />

        {/* Action Link to open Modal / PDF */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5, pl: 4, flexWrap: 'wrap', gap: 1 }}>
          <Button
            size="small"
            variant="text"
            startIcon={<LegalIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ fontWeight: 700, textTransform: 'none', px: 0 }}
          >
            Read Full Terms &amp; Conditions &amp; Service Schedule
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<PdfIcon color="error" />}
            onClick={() => setModalOpen(true)}
            sx={{ fontWeight: 600, textTransform: 'none', fontSize: '0.78rem' }}
          >
            Official PDF Document
          </Button>
        </Box>

        {/* Error message */}
        {error && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1.5, pl: 4, fontWeight: 600 }}>
            ⚠️ {error}
          </Typography>
        )}
      </Paper>

      {/* Terms Modal */}
      <TermsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        showAcceptButton={!checked}
        onAccept={() => onChange(true)}
      />
    </>
  );
};
