import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import { store } from './store';
import { MainLayout, OwnerRoute } from './components/Layout';
import { HomePage } from './features/generators/HomePage';
import { GeneratorsPage } from './features/generators/GeneratorsPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { LeasePage } from './features/lease/LeasePage';
import { PurchasePage } from './features/purchase/PurchasePage';
import { ServicePage } from './features/service/ServicePage';
import { SparePartsPage } from './features/spareParts/SparePartsPage';
import { CartPage } from './features/cart/CartPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { ROUTES } from './constants';
import { useMemo } from 'react';

function AppContent(): React.ReactElement {
  const { isDark } = useTheme();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
          },
          secondary: {
            main: '#dc004e',
            light: '#ff4081',
            dark: '#9a0036',
          },
          background: {
            default: isDark ? '#0b1120' : '#f8fafc',
            paper: isDark ? '#1e293b' : '#ffffff',
          },
          text: {
            primary: isDark ? '#f8fafc' : '#0f172a',
            secondary: isDark ? '#94a3b8' : '#64748b',
          },
          divider: isDark ? '#334155' : '#e2e8f0',
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            '@media (max-width:600px)': {
              fontSize: '1.75rem',
              lineHeight: 1.25,
            },
          },
          h2: {
            '@media (max-width:600px)': {
              fontSize: '1.5rem',
              lineHeight: 1.3,
            },
          },
          h3: {
            '@media (max-width:600px)': {
              fontSize: '1.35rem',
              lineHeight: 1.3,
            },
          },
          h4: {
            '@media (max-width:600px)': {
              fontSize: '1.25rem',
              lineHeight: 1.35,
            },
          },
          h5: {
            '@media (max-width:600px)': {
              fontSize: '1.1rem',
              lineHeight: 1.4,
            },
          },
          h6: {
            '@media (max-width:600px)': {
              fontSize: '1rem',
              lineHeight: 1.4,
            },
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '6px',
                '@media (max-width:600px)': {
                  minHeight: '36px',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                },
              },
              sizeLarge: {
                padding: '10px 22px',
                fontSize: '0.95rem',
                '@media (max-width:600px)': {
                  minHeight: '38px',
                  padding: '7px 16px',
                  fontSize: '0.85rem',
                },
              },
              sizeSmall: {
                padding: '4px 10px',
                fontSize: '0.78rem',
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              html: {
                colorScheme: isDark ? 'dark' : 'light',
              },
              body: {
                colorScheme: isDark ? 'dark' : 'light',
                backgroundColor: isDark ? '#0b1120' : '#ffffff',
                backgroundImage: isDark
                  ? 'none'
                  : 'linear-gradient(135deg, rgba(254, 226, 226, 0.45) 0%, rgba(255, 255, 255, 0.96) 48%, rgba(219, 234, 254, 0.5) 100%)',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
              },
              'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active': {
                WebkitBoxShadow: isDark
                  ? '0 0 0 1000px #1e293b inset !important'
                  : '0 0 0 1000px #ffffff inset !important',
                boxShadow: isDark
                  ? '0 0 0 1000px #1e293b inset !important'
                  : '0 0 0 1000px #ffffff inset !important',
                WebkitTextFillColor: isDark ? '#ffffff !important' : '#1e293b !important',
                transition: 'background-color 50000s ease-in-out 0s !important',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                '& input[type="date"], & input[type="time"], & input[type="datetime-local"]': {
                  colorScheme: isDark ? 'dark' : 'light',
                },
                '& input[type="date"]::-webkit-calendar-picker-indicator, & input[type="time"]::-webkit-calendar-picker-indicator': {
                  filter: isDark ? 'invert(1) brightness(1.2)' : 'none',
                  cursor: 'pointer',
                  opacity: 0.85,
                  '&:hover': {
                    opacity: 1,
                  },
                },
              },
              input: {
                '&:-webkit-autofill': {
                  WebkitBoxShadow: isDark
                    ? '0 0 0 1000px #1e293b inset !important'
                    : '0 0 0 1000px #ffffff inset !important',
                  boxShadow: isDark
                    ? '0 0 0 1000px #1e293b inset !important'
                    : '0 0 0 1000px #ffffff inset !important',
                  WebkitTextFillColor: isDark ? '#ffffff !important' : '#1e293b !important',
                  transition: 'background-color 50000s ease-in-out 0s !important',
                },
              },
            },
          },
        },
      }),
    [isDark]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? 'dark' : 'light'}
      />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.GENERATORS} element={<GeneratorsPage />} />
            <Route path={ROUTES.LEASE} element={<LeasePage />} />
            <Route path={ROUTES.PURCHASE} element={<PurchasePage />} />
            <Route path={ROUTES.SERVICE} element={<ServicePage />} />
            <Route path={ROUTES.SPARE_PARTS} element={<SparePartsPage />} />
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            
            <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
            
            {/* Owner Only Protected Routes */}
            <Route element={<OwnerRoute />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </Provider>
  );
}

export default App;
