// jshint esversion:11

import React, { Suspense } from 'react';
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
import useAppRoutes from './hooks/useAppRoutes';

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
  const { routes } = useAppRoutes();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  // to prevent re re-calling of API
  const effectRan = useRef(false);
  const userEffectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      dispatch(getShopItems());
      dispatch(getShopOrders());
      return () => {
        effectRan.current = true;
      };
    }
  }, [dispatch]);

  useEffect(() => {
    if (userEffectRan.current === false && user) {
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
