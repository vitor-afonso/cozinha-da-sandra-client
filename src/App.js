// jshint esversion:9

import './App.css';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
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

function App() {
  return (
    <div className='App'>
      <AppHeader />
      <h1>Cozinha da Sandra</h1>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/doces' element={<DocesPage />} />
        <Route path='/salgados' element={<SalgadosPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/orders' element={<OrdersPage />} />
        <Route path='/items/add' element={<NewItemPage />} />
        <Route path='/items/:itemId' element={<ItemDetailsPage />} />
        <Route path='/items/edit/:itemId' element={<EditItemPage />} />
        <Route path='/profile/:userId' element={<ProfilePage />} />
        <Route path='/profile/edit/:userId' element={<EditProfilePage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/about' element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;
