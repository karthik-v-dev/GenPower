import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout = (): React.ReactElement => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: isDark
          ? '#0b1120'
          : 'linear-gradient(135deg, rgba(254, 226, 226, 0.45) 0%, rgba(255, 255, 255, 0.96) 48%, rgba(219, 234, 254, 0.5) 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};
