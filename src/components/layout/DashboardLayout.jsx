import React, { useState } from 'react';
import './DashboardLayout.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  People as PeopleIcon,
  BarChart as ChartIcon,
  ExitToApp as ExitToAppIcon,
  School as SchoolIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const _theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Asegurarse de redirigir incluso si hay un error
      navigate('/', { replace: true });
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Exámenes', icon: <QuizIcon />, path: '/exams' },
    { text: 'Estudiantes', icon: <PeopleIcon />, path: '/students' },
    { text: 'Resultados', icon: <ChartIcon />, path: '/results' },
    { text: 'Cursos', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/configuration' },
  ];

  // Filtrar menú según el rol del usuario
  const filteredMenuItems = user?.role === 'TEACHER' 
    ? menuItems.filter(item => !['Cursos', 'Configuración'].includes(item.text))
    : user?.role === 'STUDENT' 
    ? menuItems.filter(item => item.text === 'Dashboard' || item.text === 'Exámenes')
    : menuItems;

  const drawer = (
    <div className="drawer-container">
      <Toolbar className="drawer-toolbar">
        <Typography variant="h6" noWrap component="div" className="app-title">
          EvaluApp
        </Typography>
      </Toolbar>
      <Divider className="divider" />
      <List className="menu-list">
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding className="menu-item">
            <ListItemButton 
              onClick={() => navigate(item.path)}
              className="menu-button"
            >
              <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} className="menu-text" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider className="divider" />
      <List className="logout-list">
        <ListItem disablePadding className="logout-item">
          <ListItemButton onClick={handleLogout} className="logout-button">
            <ListItemIcon className="logout-icon">
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" className="logout-text" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }} className="dashboard-layout">
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        className="app-bar"
      >
        <Toolbar className="toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
            className="menu-toggle"
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            className="page-title"
          >
            {user?.role === 'TEACHER' ? 'Panel del Profesor' : 
             user?.role === 'STUDENT' ? 'Panel del Estudiante' : 'Panel de Administración'}
          </Typography>
          <Typography variant="body1" className="user-name">
            {user?.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
        className="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
          className="mobile-drawer"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
          open
          className="desktop-drawer"
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px'
        }}
        className="main-content"
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;