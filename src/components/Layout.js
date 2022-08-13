// jshint esversion:9
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { NavItems } from './NavItems';

const drawerWidth = 260;

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export const Layout = (props) => {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartAmount } = useSelector((store) => store.items);
  const navigate = useNavigate();

  const container = window !== undefined ? () => window().document.body : undefined;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <ElevationScroll {...props}>
          <AppBar component='nav'>
            <Toolbar>
              <IconButton color='inherit' aria-label='open drawer' edge='start' onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
                <MenuIcon />
              </IconButton>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1, visibility: { xs: 'hidden', md: 'visible', textAlign: 'left' } }}>
                A COZINHA DA SANDRA
              </Typography>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <NavItems />
              </Box>

              <Box sx={{ position: 'relative' }} onClick={() => navigate('/cart')}>
                <Avatar>
                  <ShoppingCartIcon />
                </Avatar>
                <Box sx={{ position: 'absolute', top: 0, right: 0, fontWeight: 'bolder', borderRadius: '50%', padding: '2px' }}>{cartAmount}</Box>
              </Box>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
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
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
              <Typography variant='h6' sx={{ my: 2 }}>
                A COZINHA DA SANDRA
              </Typography>
              <Divider />
              <NavItems />
            </Box>
          </Drawer>
        </Box>

        <Box component='main' sx={{ width: '100%' }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </React.Fragment>
  );
};
