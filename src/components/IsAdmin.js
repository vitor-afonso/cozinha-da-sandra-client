// jshint esversion:9
import { useContext } from 'react';
import { AuthContext } from 'context/auth.context';
import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

export const IsAdmin = ({ children }) => {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  // If the authentication is still loading
  if (isLoading) return <CircularProgress sx={{ mt: 20 }} />;

  if ((isLoggedIn && user.userType !== 'admin') || !isLoggedIn) {
    // If the user is not logged in, navigate to home page
    return <Navigate to='/' />;
  } else {
    // If the user is logged in, allow to see the page
    return children;
  }
};
