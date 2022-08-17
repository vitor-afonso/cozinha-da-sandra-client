// jshint esversion:9

import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AppFooter } from './components/AppFooter';
import { HomePage } from './pages/HomePage/HomePage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { DocesPage } from './pages/DocesPage';
import { SalgadosPage } from './pages/SalgadosPage';
import { UsersPage } from './pages/UsersPage';
import { OrdersPage } from './pages/OrdersPage';
import { NewItemPage } from './pages/NewItemPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditItemPage } from './pages/EditItemPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { ForgotPage } from './pages/ForgotPage';
import { ResetPage } from './pages/ResetPage';
import { useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getShopItems } from './redux/features/items/itemsSlice';
import { getShopOrders } from './redux/features/orders/ordersSlice';
import { AuthContext } from './context/auth.context';
import { SendEmailPage } from './pages/SendEmailPage';
import { EditOrderPage } from './pages/EditOrderPage';
import { getShopUsers } from './redux/features/users/usersSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Layout } from './components/Layout';
import { Box } from '@mui/material';

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
    fontSize: 12,
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
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/doces' element={<DocesPage />} />
            <Route path='/salgados' element={<SalgadosPage />} />
            <Route path='/users' element={<UsersPage />} />
            <Route path='/orders' element={<OrdersPage />} />
            <Route path='/orders/edit/:orderId' element={<EditOrderPage />} />
            <Route path='/items/add' element={<NewItemPage />} />
            <Route path='/items/:itemId' element={<ItemDetailsPage />} />
            <Route path='/items/edit/:itemId' element={<EditItemPage />} />
            <Route path='/profile/:userId' element={<ProfilePage />} />
            <Route path='/profile/edit/:userId' element={<EditProfilePage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/forgot' element={<ForgotPage />} />
            <Route path='/reset/:userId' element={<ResetPage />} />
            <Route path='/send-email/orders/:orderId' element={<SendEmailPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Box>
  );
}

export default App;
