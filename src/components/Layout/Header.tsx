import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
  useMediaQuery,
  useTheme as useMuiTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ShoppingCart,
  Logout,
  ReceiptLong,
  Brightness4,
  Brightness7,
  SettingsBrightness,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { logoutUser } from '../../store/slices/authSlice';
import { Button } from '../UI';
import { ROUTES } from '../../constants';
import { UserRole } from '../../types';

export const Header = (): React.ReactElement => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useCustomTheme();
  
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.spareParts);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOwner =
    user?.role === UserRole.OWNER ||
    user?.email?.toLowerCase() === 'voorugondakarthik@gmail.com';

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    dispatch(logoutUser());
    handleClose();
    navigate(ROUTES.HOME);
  };

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const toggleTheme = (): void => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(theme);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setTheme(nextMode);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Brightness7 />;
      case 'dark':
        return <Brightness4 />;
      case 'system':
        return <SettingsBrightness />;
    }
  };

  const getThemeTooltip = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System mode';
    }
  };

  // Customer has Order History. Owner has Dashboard and Orders (All Customers).
  const menuItems = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Generators', path: ROUTES.GENERATORS },
    { label: 'Lease', path: ROUTES.LEASE },
    { label: 'Purchase', path: ROUTES.PURCHASE },
    { label: 'Service', path: ROUTES.SERVICE },
    { label: 'Spare Parts', path: ROUTES.SPARE_PARTS },
    ...(isOwner
      ? [
          { label: 'Dashboard', path: ROUTES.DASHBOARD },
          { label: 'Orders', path: ROUTES.ORDERS },
        ]
      : [
          { label: 'Order History', path: ROUTES.ORDERS },
        ]),
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        GenPower
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  textAlign: 'center',
                  backgroundColor: isActive ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.main' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              cursor: 'pointer',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              mr: 2,
            }}
            onClick={() => navigate(ROUTES.HOME)}
          >
            GenPower
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, ml: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                      px: 1.5,
                      py: 0.6,
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                      borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={getThemeTooltip()}>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
              {getThemeIcon()}
            </IconButton>
          </Tooltip>

          <IconButton color="inherit" onClick={() => navigate(ROUTES.CART)} sx={{ mr: 1 }}>
            <Badge badgeContent={cart.length} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                  <Box sx={{ py: 0.5 }}>
                    <Typography variant="body2" fontWeight={700} color="text.primary">
                      {user?.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isOwner ? 'Role: Store Owner' : 'Role: Customer'}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate(ROUTES.ORDERS);
                  }}
                >
                  <ReceiptLong sx={{ mr: 1 }} />
                  {isOwner ? 'Manage All Orders' : 'My Order History'}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate(ROUTES.LOGIN)}>
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
