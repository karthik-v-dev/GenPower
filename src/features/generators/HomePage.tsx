import {
  Box,
  Container,
  Typography,
  Grid,
  CardContent,
  CardMedia,
  CardActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PowerSettingsNew, Build, ShoppingCart, Handshake } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/UI';
import { ROUTES, HERO_IMAGES } from '../../constants';

export const HomePage = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const services = [
    {
      title: 'Generator Leasing',
      description: 'Flexible short-term and long-term leasing options for all your power needs.',
      icon: <Handshake sx={{ fontSize: 60 }} />,
      path: ROUTES.LEASE,
    },
    {
      title: 'Buy Generators',
      description: 'Wide selection of new and certified pre-owned generators for purchase.',
      icon: <ShoppingCart sx={{ fontSize: 60 }} />,
      path: ROUTES.PURCHASE,
    },
    {
      title: 'Service & Maintenance',
      description: 'Professional maintenance and repair services by certified technicians.',
      icon: <Build sx={{ fontSize: 60 }} />,
      path: ROUTES.SERVICE,
    },
    {
      title: 'Spare Parts',
      description: 'Genuine OEM spare parts and accessories for all generator brands.',
      icon: <PowerSettingsNew sx={{ fontSize: 60 }} />,
      path: ROUTES.SPARE_PARTS,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${HERO_IMAGES[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 8, md: 16 },
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Power Your Business Forward
          </Typography>
          <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ mb: 4 }}>
            Leading provider of generator sales, leasing, service, and spare parts
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => navigate(ROUTES.GENERATORS)}
            >
              Browse Generators
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white' }}
              onClick={() => navigate(ROUTES.SERVICE)}
            >
              Request Service
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Our Services
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Comprehensive power solutions for your business
        </Typography>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{service.icon}</Box>
                  <Typography variant="h5" component="div" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button size="small" onClick={() => navigate(service.path)}>
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#111c30' : 'grey.100',
          py: 8,
          borderTop: theme.palette.mode === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
          borderBottom: theme.palette.mode === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
        }}
      >
        <Container>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
            sx={{ color: 'text.primary' }}
          >
            Why Choose GenPower?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  20+
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 0.5 }}>
                  Years of Experience
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  500+
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 0.5 }}>
                  Generators Available
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  24/7
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 0.5 }}>
                  Emergency Service
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Ready to Get Started?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Contact us today for a free consultation
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => navigate(ROUTES.REGISTER)}
        >
          Get Started Now
        </Button>
      </Container>
    </Box>
  );
};
