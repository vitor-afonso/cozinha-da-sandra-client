// jshint esversion:9
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { capitalizeAppName, APP } from 'utils/app.utils.js';
import { NavItems } from './NavItems';
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
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Avatar, Badge, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { componentProps, layoutStyle } from 'utils/app.styleClasses.js';
import instagramImage from 'images/instagram.svg';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';
import TermsModal from 'components/TermsModal';

const drawerWidth = 220;

const APP_NAME = APP.name.toUpperCase();
const MAIL_TO = `mailto:${APP.email}`;

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
  const { isLoading, cartAmount, cartTotal } = useSelector((store) => store.items);
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartButtonLocations = ['/', '/doces', '/salgados'];

  const container = window !== undefined ? () => window().document.body : undefined;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    //sets the index.html title tag to the name of the app
    document.title = capitalizeAppName();
  }, []);

  const getTotal = () => {
    return cartTotal.toFixed(2).replace('-', '').toString() + APP.currency;
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <ElevationScroll {...props}>
          <AppBar component='nav' sx={{ height: '64px', display: 'flex', justifyContent: 'center' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <IconButton color={componentProps.color.inherit} aria-label='open drawer' edge='start' onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
                  <MenuIcon fontSize={componentProps.fontSize.large} />
                </IconButton>
                <Typography variant={componentProps.variant.h6} component='div' sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
                  {APP_NAME}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <NavItems />
                </Box>

                <Box sx={{ position: 'relative' }} onClick={() => navigate('/cart')}>
                  <Badge color={componentProps.color.secondary} overlap='circular' badgeContent={`${cartAmount}`}>
                    <Avatar sx={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                      <ShoppingCartIcon color={componentProps.color.primary} />
                    </Avatar>
                  </Badge>
                </Box>
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
              <Typography variant={componentProps.variant.h6} sx={{ my: 2 }} color={componentProps.color.primary}>
                {APP_NAME}
              </Typography>
              <Divider />
              <NavItems />
            </Box>
          </Drawer>
        </Box>

        <Box component='main' sx={layoutStyle.page}>
          <Toolbar />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box sx={{ mb: 3 }}>{children}</Box>
            <Box sx={layoutStyle.footer}>
              <Box>
                <Box sx={layoutStyle.footerSocial}>
                  <Link href='#'>
                    <FacebookOutlinedIcon fontSize={componentProps.fontSize.large} sx={{ mr: 2 }} color={componentProps.color.secondary} />
                  </Link>
                  <Link href='#'>
                    <img src={instagramImage} alt='Instagram' width='28px' height='auto' />
                  </Link>
                  <Link href={MAIL_TO}>
                    <EmailIcon fontSize={componentProps.fontSize.large} sx={{ mt: '2px', ml: 2 }} />
                  </Link>
                </Box>
              </Box>
              <Button type={componentProps.type.text} sx={layoutStyle.footerTerms} onClick={() => setIsModalOpen(true)}>
                Termos e condições
              </Button>
            </Box>
          </Box>

          {cartButtonLocations.includes(location.pathname) && !isLoading && cartAmount > 0 && (
            <Button
              variant={componentProps.variant.contained}
              startIcon={<ShoppingCartOutlinedIcon fontSize={componentProps.fontSize.large} />}
              sx={layoutStyle.cartTotalButton}
              onClick={() => navigate('/cart')}
              color={componentProps.color.neutral}
            >
              Carrinho: {getTotal()}
            </Button>
          )}
          <TermsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Box>
      </Box>
    </React.Fragment>
  );
};
