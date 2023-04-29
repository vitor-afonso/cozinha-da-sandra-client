// jshint esversion:9
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'index.css';
import App from 'App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProviderWrapper } from 'context/auth.context';
import { store } from 'redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <AuthProviderWrapper>
          <App />
        </AuthProviderWrapper>
      </Provider>
    </Router>
  </React.StrictMode>
);
