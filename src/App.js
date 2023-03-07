// jshint esversion:11

import React, { lazy, Suspense } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getShopItems } from './redux/features/items/itemsSlice';
import { getShopOrders } from './redux/features/orders/ordersSlice';
import { AuthContext } from './context/auth.context';
import { getShopUsers } from './redux/features/users/usersSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Layout } from './components/Layout';
import { Box, CircularProgress } from '@mui/material';
import { IsAdmin } from './components/IsAdmin';
import { IsUser } from './components/IsUser';

const SignupPage = lazy(() => import('./pages/SignupPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPage = lazy(() => import('./pages/ForgotPage'));
const ResetPage = lazy(() => import('./pages/ResetPage'));
const SendEmailPage = lazy(() => import('./pages/SendEmailPage'));
const HomePage = lazy(() => import('./pages//HomePage/HomePage'));
const DocesPage = lazy(() => import('./pages/DocesPage'));
const SalgadosPage = lazy(() => import('./pages/SalgadosPage'));
const ItemDetailsPage = lazy(() => import('./pages/ItemDetailsPage'));
const NewItemPage = lazy(() => import('./pages/NewItemPage'));
const EditItemPage = lazy(() => import('./pages/EditItemPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const EditOrderPage = lazy(() => import('./pages/EditOrderPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// to update mui default values
const theme = createTheme({
  palette: {
    primary: {
      main: '#816E94',
    },
    secondary: {
      main: '#251351',
    },
    neutral: {
      main: '#031D44',
      contrastText: '#fff',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Signika',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  // to prevent re re-calling of API
  const effectRan = useRef(false);
  const userEffectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      dispatch(getShopItems());
      return () => {
        effectRan.current = true;
      };
    }
  }, [dispatch]);

  useEffect(() => {
    if (userEffectRan.current === false && user) {
      dispatch(getShopOrders());
      dispatch(getShopUsers());
      return () => {
        userEffectRan.current = true;
      };
    }
  }, [dispatch, user]);

  return (
    <Box className='App'>
      <ThemeProvider theme={theme}>
        <Layout>
          <Suspense fallback={<CircularProgress sx={{ mt: 24 }} size='100px' />}>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/doces' element={<DocesPage />} />
              <Route path='/salgados' element={<SalgadosPage />} />
              <Route path='/items/:itemId' element={<ItemDetailsPage />} />

              <Route
                path='/users'
                element={
                  <IsAdmin>
                    <UsersPage />
                  </IsAdmin>
                }
              />
              <Route
                path='/orders'
                element={
                  <IsAdmin>
                    <OrdersPage />
                  </IsAdmin>
                }
              />
              <Route
                path='/orders/edit/:orderId'
                element={
                  <IsUser>
                    <EditOrderPage />
                  </IsUser>
                }
              />
              <Route
                path='/items/add'
                element={
                  <IsAdmin>
                    <NewItemPage />
                  </IsAdmin>
                }
              />
              <Route
                path='/items/edit/:itemId'
                element={
                  <IsAdmin>
                    <EditItemPage />
                  </IsAdmin>
                }
              />
              <Route
                path='/profile/:userId'
                element={
                  <IsUser>
                    <ProfilePage />
                  </IsUser>
                }
              />
              <Route
                path='/profile/edit/:userId'
                element={
                  <IsUser>
                    <EditProfilePage />
                  </IsUser>
                }
              />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/forgot' element={<ForgotPage />} />
              <Route path='/reset/:userId' element={<ResetPage />} />
              <Route
                path='/send-email/orders/:orderId'
                element={
                  <IsAdmin>
                    <SendEmailPage />
                  </IsAdmin>
                }
              />
            </Routes>
          </Suspense>
        </Layout>
      </ThemeProvider>
    </Box>
  );
}

export default App;
