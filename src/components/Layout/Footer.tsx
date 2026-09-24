import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, useTheme, Button } from '@mui/material';
import { Email, Phone, LocationOn, Facebook, Twitter, LinkedIn, PictureAsPdf as PdfIcon, Gavel as LegalIcon } from '@mui/icons-material';
import { CONTACT_INFO } from '../../constants';
import { TermsModal } from '../UI/TermsModal';

export const Footer = (): React.ReactElement => {
  const theme = useTheme();
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  
  return (
    <>
      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#0b1120' : 'primary.main',
          color: 'white',
          mt: 'auto',
          py: 6,
          borderTop: theme.palette.mode === 'dark' ? '1px solid #1e293b' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                GenPower
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Your trusted partner for generator sales, leasing, service, and spare parts. Industrial power solutions across India.
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<LegalIcon />}
                onClick={() => setTermsModalOpen(true)}
                sx={{
                  textTransform: 'none',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Terms &amp; Service Policy (PDF)
              </Button>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">{CONTACT_INFO.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">{CONTACT_INFO.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">{CONTACT_INFO.address}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                Follow Us
              </Typography>
              <Box>
                <IconButton color="inherit" aria-label="Facebook">
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" aria-label="Twitter">
                  <Twitter />
                </IconButton>
                <IconButton color="inherit" aria-label="LinkedIn">
                  <LinkedIn />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  © {new Date().getFullYear()} GenPower Solutions Pvt Ltd.
                </Typography>
                <Link
                  component="button"
                  variant="caption"
                  onClick={() => setTermsModalOpen(true)}
                  sx={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'underline', mt: 0.5, display: 'inline-block' }}
                >
                  Strict Non-Refundable Policy &amp; Service Discount Tiers
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Terms Modal */}
      <TermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>
  );
};
