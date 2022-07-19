// jshint esversion:9

import './App.css';
import { Routes, Route } from 'react-router-dom';
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
import { AppHeader } from './components/AppHeader';
import { ForgotPage } from './pages/ForgotPage';
import { ResetPage } from './pages/ResetPage';
import { useEffect, useRef } from 'react';
import { getShopItems } from './redux/features/items/itemsSlice';
import { useDispatch } from 'react-redux';
import { AppFooter } from './components/AppFooter';

function App() {
  const dispatch = useDispatch();
  // to prevent re re-calling of API
  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false) {
      dispatch(getShopItems());

      return () => {
        effectRan.current = true;
      };
    }
  }, [dispatch]);
  return (
    <div className='App'>
      <AppHeader />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/doces' element={<DocesPage />} />
        <Route path='/salgados' element={<SalgadosPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/orders' element={<OrdersPage />} />
        <Route path='/orders/edit/:orderId' element={<OrdersPage />} />
        <Route path='/items/add' element={<NewItemPage />} />
        <Route path='/items/:itemId' element={<ItemDetailsPage />} />
        <Route path='/items/edit/:itemId' element={<EditItemPage />} />
        <Route path='/profile/:userId' element={<ProfilePage />} />
        <Route path='/profile/edit/:userId' element={<EditProfilePage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/forgot' element={<ForgotPage />} />
        <Route path='/reset' element={<ResetPage />} />
      </Routes>

      <AppFooter />
    </div>
  );
}

export default App;
