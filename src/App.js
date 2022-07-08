// jshint esversion:9

import './App.css';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { DocesPage } from './pages/DocesPage';

function App() {
  return (
    <div className='App'>
      <h1>Cozinha da Sandra</h1>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/doces' element={<DocesPage />} />
      </Routes>
    </div>
  );
}

export default App;
