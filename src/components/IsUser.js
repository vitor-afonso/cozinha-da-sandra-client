// jshint esversion:11

import { useContext } from 'react';
import { AuthContext } from 'context/auth.context';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

export const IsUser = ({ children }) => {
  const { shopUsers } = useSelector((store) => store.users);
  const { isLoading, user } = useContext(AuthContext);
  const location = useLocation();
  const { orderId } = useParams();

  const userOwnsOrder = () => {
    const userInSession = shopUsers.find((oneUser) => oneUser._id === user._id);
    if (userInSession.orders.includes(orderId)) {
      return true;
    }
  };

  // If the authentication is still loading
  if (isLoading) return <CircularProgress sx={{ mt: 20 }} size={80} />;

  if ((user && location.pathname.includes(user._id)) || (user && userOwnsOrder()) || (user && user.userType === 'admin')) {
    // If the user is logged in, allow to see the page
    return children;
  } else {
    // If the user is not logged in, navigate to home page
    return <Navigate to='/' />;
  }
};
