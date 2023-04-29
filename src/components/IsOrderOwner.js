import { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from 'context/auth.context';
import { Box, CircularProgress } from '@mui/material';
import SuccessMessage from 'components/SuccessMessage';

export const IsOrderOwner = ({ children }) => {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);
  const { shopOrders } = useSelector((store) => store.orders);
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();

  let messageToDisplay = () => {
    if (user._id !== order?.userId._id) {
      return 'Utilizador inválido.';
    }
    return 'Review para este pedido já foi submetido. Obrigado.';
  };

  useEffect(() => {
    if (shopOrders.length > 0 && orderId) {
      let orderToReview = shopOrders.find((item) => item._id === orderId);
      setOrder(orderToReview);
    }
  }, [shopOrders, orderId]);

  // If the authentication is still loading
  if (isLoading) return <CircularProgress sx={{ mt: 20 }} size={80} />;

  if (isLoggedIn && user._id === order?.userId._id && !order?.reviewId) {
    // If the user is logged in, allow to see the page
    return children;
  }
  if (!isLoggedIn) {
    // If the user is not logged in, navigate to login page
    return <Navigate to={`/login/${orderId}`} />;
  }
  // If user is logged in but not owner of order or review already exists
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end', height: '100%' }}>
      <SuccessMessage message={messageToDisplay()} />
    </Box>
  );
};
