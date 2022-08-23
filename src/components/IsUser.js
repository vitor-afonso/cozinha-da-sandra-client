// jshint esversion:11

import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

export const IsUser = ({ children }) => {
  const { isLoading, user } = useContext(AuthContext);
  const location = useLocation();

  // If the authentication is still loading
  if (isLoading) return <CircularProgress sx={{ mt: 20 }} />;

  if ((user && location.pathname.includes(user._id)) || (user && user.userType === 'admin')) {
    // If the user is logged in, allow to see the page
    return children;
  } else {
    // If the user is not logged in, navigate to home page
    return <Navigate to='/' />;
  }
};
