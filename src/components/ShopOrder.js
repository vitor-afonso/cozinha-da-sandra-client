// jshint esversion:9

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { confirmOrder, confirmPayment } from '../redux/features/orders/ordersSlice';
import { getItemsPrice, getItemsQuantity, parseDateToShow } from '../utils/app.utils';

import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

export function ShopOrder({ order }) {
  const { user } = useContext(AuthContext);
  const [createdAt, setCreatedAt] = useState('');
  const [deliveredAt, setDeliveredAt] = useState('');
  const [itemsQuantity, setItemsQuantity] = useState([]);
  const [itemsPrice, setItemsPrice] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const orderClasses = {
    container: {
      width: 300,
      backgroundColor: '#E3DDE3',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    infoField: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    addressField: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      borderTop: '1px solid #CCC',
    },
    editBtn: {
      color: grey[700],
      cursor: 'pointer',
    },
  };

  useEffect(() => {
    if (order) {
      const itemsQuantityArray = getItemsQuantity(order);
      const itemsPriceArray = getItemsPrice(order);

      setItemsQuantity(itemsQuantityArray);
      setItemsPrice(itemsPriceArray);
      setCreatedAt(parseDateToShow(order.createdAt));
      setDeliveredAt(parseDateToShow(order.deliveryDate));
    }
  }, [order]);

  //fn compares dates to know if we can render confirm button
  const checkDeliveryDate = () => {
    const orderDeliveryDate = new Date(order.deliveryDate);
    const todaysDate = new Date();

    return orderDeliveryDate > todaysDate ? true : false;
  };

  const translateStatus = (status) => {
    if (status === 'pending') {
      return 'Pendente ';
    } else if (status === 'confirmed') {
      return 'Confirmado ';
    } else {
      return 'Rejeitado ';
    }
  };

  const handleConfirmOrder = async () => {
    try {
      let requestBody = { orderStatus: 'confirmed' };

      let confirmationEmail = {
        from: 'cozinhadasandra22@gmail.com',
        to: order.userId.email,
        subject: 'Pedido confirmado',
        message: `
        A sua pedido com o ID: ${order._id} foi confirmada para o dia ${deliveredAt}. Por favor indique o ID da sua pedido ao efectuar pagamento via MB WAY para o numero de telefone 9********.
        Pode ver todos os detalhes da sua pedido na sua pagina de perfil.
    
        Com os melhores cumprimentos,
    
        A Cozinha da Sandra
        `,
      };

      await Promise.all([updateOrder(requestBody, order._id), sendEmail(confirmationEmail)]);
      dispatch(confirmOrder({ id: order._id }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTotal = () => {
    if (order.deliveryDiscount) {
      return order.total;
    }

    if (order.total < order.amountForFreeDelivery && order.deliveryMethod === 'delivery') {
      return order.total + order.deliveryFee;
    }
    return order.total;
  };

  const checkUserType = () => {
    if (order.orderStatus === 'pending' || user.userType === 'admin') {
      return true;
    }
  };
  const handleConfirmPayment = async () => {
    try {
      let requestBody = { paid: true };

      await updateOrder(requestBody, order._id);

      dispatch(confirmPayment({ id: order._id }));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Card sx={orderClasses.container}>
      <CardContent>
        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>ID:</b>
          </Typography>
          <Typography variant='body1' gutterBottom>
            {order._id}
          </Typography>
        </Box>

        {user.userType === 'admin' && (
          <Box sx={orderClasses.infoField}>
            <Typography variant='body1' color='#031D44' onClick={() => navigate(`/profile/edit/${order.userId._id}`)}>
              <b>Utilizador:</b>
            </Typography>
            <Typography variant='body1' gutterBottom>
              {order.userId.username}
            </Typography>
          </Box>
        )}

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Telefone:</b>
          </Typography>
          <Typography variant='body1' gutterBottom>
            {order.contact}
          </Typography>
        </Box>

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Data de criação:</b>
          </Typography>
          <Typography variant='body1' gutterBottom>
            {createdAt}
          </Typography>
        </Box>

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Data de entrega:</b>
          </Typography>
          <Typography variant='body1' gutterBottom>
            {deliveredAt}
          </Typography>
        </Box>

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Metodo de entrega:</b>
          </Typography>
          <Typography variant='body1' gutterBottom>
            {order.deliveryMethod === 'delivery' ? 'Entrega' : 'Take Away'}
          </Typography>
        </Box>

        {order.address && (
          <Box>
            <Typography variant='body1' color='#031D44' align='left'>
              <b>Morada: </b>
            </Typography>

            <Typography variant='body1' gutterBottom>
              {order.address}
            </Typography>
          </Box>
        )}

        {order.message && (
          <Box sx={orderClasses.infoField}>
            <Typography variant='body1' color='#031D44'>
              <b>Mensagem:</b>
            </Typography>
            <Typography variant='body1' gutterBottom>
              {order.message}
            </Typography>
          </Box>
        )}

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Quantidade: </b>
          </Typography>
          <Box>
            {itemsQuantity.length > 0 &&
              itemsQuantity.map((item, index) => {
                return (
                  <Typography variant='body1' gutterBottom key={index}>
                    {item}
                  </Typography>
                );
              })}
          </Box>
        </Box>

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Preço: </b>
          </Typography>
          <Box>
            {itemsPrice.length > 0 &&
              itemsPrice.map((item, index) => {
                return (
                  <Typography variant='body1' gutterBottom key={index}>
                    {item}€
                  </Typography>
                );
              })}
          </Box>
        </Box>

        {order.deliveryMethod === 'delivery' && (
          <>
            {order.deliveryDiscount ? (
              <Box sx={orderClasses.infoField}>
                <Typography variant='body1' color='#031D44'>
                  <b>Taxa de entrega:</b>
                </Typography>
                <Box variant='body1'>
                  <Typography sx={{ textDecoration: 'line-through' }} gutterBottom>
                    {order.deliveryFee}€
                  </Typography>{' '}
                  0€
                </Box>
              </Box>
            ) : (
              <Box sx={orderClasses.infoField}>
                <Typography variant='body1' color='#031D44'>
                  <b>Taxa de entrega:</b>
                </Typography>
                <Typography variant='body1' gutterBottom>
                  {order.deliveryFee}€
                </Typography>
              </Box>
            )}
          </>
        )}
        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Status: </b>
          </Typography>
          <Typography>
            {translateStatus(order.orderStatus)}
            {order.orderStatus === 'pending' && checkDeliveryDate() && user.userType === 'admin' && (
              <Button size='small' onClick={handleConfirmOrder}>
                Confirmar
              </Button>
            )}
          </Typography>
        </Box>

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Pago: </b>
          </Typography>
          <Typography>
            {order.paid ? 'Sim' : 'Não'}
            {!order.paid && user.userType === 'admin' && (
              <Button size='small' onClick={() => handleConfirmPayment(order._id)}>
                Confirmar
              </Button>
            )}
          </Typography>
        </Box>
        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Total:</b>
          </Typography>
          <Typography variant='body1'>{getTotal()}€</Typography>
        </Box>
      </CardContent>

      {checkUserType() && (
        <CardActions sx={orderClasses.actions}>
          {user.userType === 'admin' && location.pathname === '/orders' && (
            <Button size='small' onClick={() => navigate(`/send-email/orders/${order._id}`)}>
              Contactar
            </Button>
          )}

          <Button size='small' sx={orderClasses.editBtn} onClick={() => navigate(`/orders/edit/${order._id}`)}>
            Editar
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
