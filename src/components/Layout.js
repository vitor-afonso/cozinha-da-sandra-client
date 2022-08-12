// jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import LocalPizzaOutlinedIcon from '@mui/icons-material/LocalPizzaOutlined';
import { ListItemIcon } from '@mui/material';

const drawerWidth = 260;
const navItems = ['Home', 'About', 'Contact'];

export const Layout = (props) => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);

  const offMenuItems = [
    { text: 'Home', icon: <HomeOutlinedIcon color='inherit' />, path: '/' },
    { text: 'Doces', icon: <CakeOutlinedIcon color='inherit' />, path: '/doces' },
    { text: 'Salgados', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/salgados' },
    { text: 'Registrar', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/signup' },
    { text: 'Entrar', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/login' },
    /* { text: 'Sobre nós', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/about' }, */
  ];

  const userMenuItems = [
    { text: 'Home', icon: <HomeOutlinedIcon color='inherit' />, path: '/' },
    { text: 'Doces', icon: <CakeOutlinedIcon color='inherit' />, path: '/doces' },
    { text: 'Salgados', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/salgados' },
    { text: 'Perfil', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: `/profile/${userId}` },
    /* { text: 'Sobre nós', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/about' }, */
    /* { text: 'Sair', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/Logout' }, */
  ];
  const adminMenuItems = [
    { text: 'Home', icon: <HomeOutlinedIcon color='inherit' />, path: '/' },
    { text: 'Doces', icon: <CakeOutlinedIcon color='inherit' />, path: '/doces' },
    { text: 'Salgados', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/salgados' },
    { text: 'Utilizadores', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/users' },
    { text: 'Encomendas', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/orders' },
    { text: 'Novo item', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/items/add' },
    { text: 'Perfil', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: `/profile/${userId}` },
    /* { text: 'Sair', icon: <LocalPizzaOutlinedIcon color='inherit' />, path: '/Logout' }, */
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    if (user) {
      logOutUser();
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant='h6' sx={{ my: 2 }}>
        A COZINHA DA SANDRA
      </Typography>
      <Divider />
      <List>
        {!isLoggedIn &&
          offMenuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        {isLoggedIn &&
          user.userType === 'user' &&
          userMenuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

        {isLoggedIn &&
          user.userType === 'admin' &&
          adminMenuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        {isLoggedIn && (
          <ListItem disablePadding onClick={() => logOutUser()}>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemIcon>
                <LocalPizzaOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='Sair' />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <AppBar component='nav'>
          <Toolbar>
            <IconButton color='inherit' aria-label='open drawer' edge='start' onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
              MUI
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (
                <Button key={item} sx={{ color: '#fff' }}>
                  {item}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <Box component='nav'>
          <Drawer
            container={container}
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component='main' sx={{ p: 3 }}>
          <Toolbar />
          {props.children}
        </Box>
      </Box>
    </div>
  );
};
