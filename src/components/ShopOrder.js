// jshint esversion:9

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { confirmOrder, confirmPayment } from '../redux/features/orders/ordersSlice';
import { getItemsPrice, getItemsQuantity, parseDateToShow, capitalizeAppName, APP } from '../utils/app.utils';

import { Box, Button, Card, CardActions, CardContent, CircularProgress, Modal, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #816E94',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const APP_NAME = capitalizeAppName();
export function ShopOrder({ order }) {
  const { user } = useContext(AuthContext);
  const [createdAt, setCreatedAt] = useState('');
  const [deliveredAt, setDeliveredAt] = useState('');
  const [itemsQuantity, setItemsQuantity] = useState([]);
  const [itemsPrice, setItemsPrice] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [paidBtnLoading, setPaidBtnLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openPaid, setOpenPaid] = React.useState(false);
  const handleOpenPaid = () => setOpenPaid(true);
  const handleClosePaid = () => setOpenPaid(false);

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
    setBtnLoading(true);
    try {
      let requestBody = { orderStatus: 'confirmed' };

      let confirmationEmail = {
        from: APP.email,
        to: order.userId.email,
        subject: 'Pedido confirmado',
        message: `O seu pedido com o Nº: ${order.orderNumber} foi confirmado para o dia ${deliveredAt}. Por favor indique o Nº do seu pedido ao efectuar pagamento via MB WAY (+351 9** *** ***).

        Encontre os detalhes do seu pedido na sua pagina de perfil.
        
        Com os melhores cumprimentos,
        ${APP_NAME} 👩🏾‍🍳
        `,
      };

      await Promise.all([updateOrder(requestBody, order._id), sendEmail(confirmationEmail)]);
      dispatch(confirmOrder({ id: order._id }));
      handleClose();
    } catch (error) {
      console.log(error.message);
      setBtnLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setPaidBtnLoading(true);

    try {
      let requestBody = { paid: true };

      await updateOrder(requestBody, order._id);

      dispatch(confirmPayment({ id: order._id }));
      handleClosePaid();
    } catch (error) {
      console.log(error.message);
      setPaidBtnLoading(false);
    }
  };

  const getTotal = () => {
    if (order.deliveryDiscount) {
      return order.total.toFixed(2) + APP.currency;
    }

    if (order.total < order.amountForFreeDelivery && order.deliveryMethod === 'delivery') {
      return (order.total + order.deliveryFee).toFixed(2) + APP.currency;
    }

    return order.total.toFixed(2) + APP.currency;
  };

  const isPending = () => {
    if (order.orderStatus === 'pending' && checkDeliveryDate()) {
      return true;
    }
  };

  return (
    <Card sx={orderClasses.container}>
      <CardContent>
        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Nº:</b>
          </Typography>
          <Typography variant='body1' gutterBottom>
            {order.orderNumber}
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
                    {item + APP.currency}
                  </Typography>
                );
              })}
          </Box>
        </Box>

        {order.deliveryMethod === 'delivery' && (
          <Box sx={orderClasses.infoField}>
            <Typography variant='body1' color='#031D44'>
              <b>Taxa de entrega:</b>
            </Typography>
            <Box variant='body1'>
              <Typography sx={{ textDecoration: order.deliveryDiscount ? 'line-through' : '' }} gutterBottom>
                {order.deliveryFee + APP.currency}
              </Typography>
              {order.deliveryDiscount && `0${APP.currency}`}
            </Box>
          </Box>
        )}
        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Status: </b>
          </Typography>
          <Typography>
            {translateStatus(order.orderStatus)}
            {order.orderStatus === 'pending' && checkDeliveryDate() && user.userType === 'admin' && (
              <Button size='small' onClick={handleOpen}>
                Confirmar
              </Button>
            )}
          </Typography>

          <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
            <Box sx={modalStyle}>
              <Typography id='modal-modal-title' variant='body1' sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                Enviar email de confirmação?
              </Typography>
              <Box sx={{ mt: 2 }}>
                {!btnLoading && (
                  <>
                    <Button sx={{ mr: 1 }} variant='outlined' onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type='button' variant='contained' onClick={handleConfirmOrder}>
                      Confirmar
                    </Button>
                  </>
                )}
                {btnLoading && <CircularProgress size='20px' />}
              </Box>
            </Box>
          </Modal>
        </Box>

        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Pago: </b>
          </Typography>
          <Typography>
            {order.paid ? 'Sim' : 'Não'}
            {!order.paid && user.userType === 'admin' && (
              <Button size='small' onClick={handleOpenPaid}>
                Confirmar
              </Button>
            )}
          </Typography>
          <Modal open={openPaid} onClose={handleClosePaid} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
            <Box sx={modalStyle}>
              {order.orderStatus === 'pending' ? (
                <>
                  <Typography id='modal-modal-title' variant='body1' sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                    Confirme status do pedido antes.
                  </Typography>
                  <Button variant='outlined' onClick={handleClosePaid}>
                    Voltar
                  </Button>
                </>
              ) : (
                <>
                  <Typography id='modal-modal-title' variant='h6' component='h2'>
                    Confirmar pago?
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {!paidBtnLoading && (
                      <>
                        <Button sx={{ mr: 1 }} variant='outlined' onClick={handleClosePaid}>
                          Cancelar
                        </Button>
                        <Button type='button' variant='contained' onClick={handleConfirmPayment}>
                          Confirmar
                        </Button>
                      </>
                    )}
                    {paidBtnLoading && <CircularProgress size='20px' />}
                  </Box>
                </>
              )}
            </Box>
          </Modal>
        </Box>
        <Box sx={orderClasses.infoField}>
          <Typography variant='body1' color='#031D44'>
            <b>Total:</b>
          </Typography>
          <Typography variant='body1'>{getTotal()}</Typography>
        </Box>
      </CardContent>

      {isPending() && user.userType === 'user' && (
        <CardActions sx={orderClasses.actions}>
          <Button size='small' sx={orderClasses.editBtn} onClick={() => navigate(`/orders/edit/${order._id}`)}>
            Editar
          </Button>
        </CardActions>
      )}
      {user.userType === 'admin' && (
        <CardActions sx={orderClasses.actions}>
          {!location.pathname.includes('send-email') && (
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
