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
import { IsOrderOwner } from './components/IsOrderOwner';

const SignupPage = lazy(() => import('./pages/SignupPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPage = lazy(() => import('./pages/ForgotPage'));
const ResetPage = lazy(() => import('./pages/ResetPage'));
const SendEmailPage = lazy(() => import('./pages/SendEmailPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
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
const CreateReviewPage = lazy(() => import('./pages/CreateReviewPage'));

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

  const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/login/:orderId?', element: <LoginPage /> },
    { path: '/doces', element: <DocesPage /> },
    { path: '/salgados', element: <SalgadosPage /> },
    { path: '/items/:itemId', element: <ItemDetailsPage /> },
    { path: '/cart', element: <CartPage /> },
    { path: '/about', element: <AboutPage /> },
    { path: '/forgot', element: <ForgotPage /> },
    { path: '/reset/:userId', element: <ResetPage /> },
    {
      path: '/profile/:userId',
      element: (
        <IsUser>
          <ProfilePage />
        </IsUser>
      ),
    },
    {
      path: '/profile/edit/:userId',
      element: (
        <IsUser>
          <EditProfilePage />
        </IsUser>
      ),
    },
    {
      path: '/orders/edit/:orderId',
      element: (
        <IsUser>
          <EditOrderPage />
        </IsUser>
      ),
    },
    {
      path: '/users',
      element: (
        <IsAdmin>
          <UsersPage />
        </IsAdmin>
      ),
    },
    {
      path: '/orders',
      element: (
        <IsAdmin>
          <OrdersPage />
        </IsAdmin>
      ),
    },
    {
      path: '/items/add',
      element: (
        <IsAdmin>
          <NewItemPage />
        </IsAdmin>
      ),
    },
    {
      path: '/items/edit/:itemId',
      element: (
        <IsAdmin>
          <EditItemPage />
        </IsAdmin>
      ),
    },
    {
      path: '/send-email/orders/:orderId',
      element: (
        <IsAdmin>
          <SendEmailPage />
        </IsAdmin>
      ),
    },
    {
      path: '/reviews/create/:orderId',
      element: (
        <IsOrderOwner>
          <CreateReviewPage />
        </IsOrderOwner>
      ),
    },
  ];

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
              {routes.map((route, i) => (
                <Route path={route.path} element={route.element} key={i} />
              ))}
            </Routes>
          </Suspense>
        </Layout>
      </ThemeProvider>
    </Box>
  );
}

export default App;
