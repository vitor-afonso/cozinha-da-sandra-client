// jshint esversion:9

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { confirmOrder, confirmPayment } from '../redux/features/orders/ordersSlice';
import { getItemsPrice, getItemsQuantity, parseDateAndTimeToShow, capitalizeAppName, APP } from '../utils/app.utils';
import ConfirmOrderModal from './ConfirmOrderModal';

import { Box, Button, Card, CardActions, CardContent, Typography, useTheme } from '@mui/material';
import PaidOrderModal from './PaidOrderModal';
import { componentProps, shopOrderClasses } from '../utils/app.styleClasses';

const APP_NAME = capitalizeAppName();

export function ShopOrder({ order }) {
  const { user } = useContext(AuthContext);
  const [createdAt, setCreatedAt] = useState('');
  const [deliveredAt, setDeliveredAt] = useState('');
  const [itemsQuantity, setItemsQuantity] = useState([]);
  const [itemsPrice, setItemsPrice] = useState([]);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isPaidLoading, setIsPaidLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentUserAdmin = user.userType === 'admin';
  const shouldShowCardActions = isCurrentUserAdmin || isPending();
  const shouldShowEditButton = (isPending() && user.userType === 'user') || isCurrentUserAdmin;
  const shouldShowConfirmButton = order.orderStatus === 'pending' && shouldDisplayConfirmButton() && isCurrentUserAdmin;
  const isOrderForDelivery = order.deliveryMethod === 'delivery';
  const isOrderPending = order.orderStatus === 'pending' ? true : false;

  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openPaid, setOpenPaid] = React.useState(false);

  useEffect(() => {
    if (order) {
      const itemsQuantityArray = getItemsQuantity(order);
      const itemsPriceArray = getItemsPrice(order);

      setItemsQuantity(itemsQuantityArray);
      setItemsPrice(itemsPriceArray);
      setCreatedAt(parseDateAndTimeToShow(order.createdAt));
      setDeliveredAt(parseDateAndTimeToShow(order.deliveryDate));
    }
  }, [order]);

  //fn compares dates to know if we can render confirm button
  function shouldDisplayConfirmButton() {
    const orderDeliveryDate = new Date(order.deliveryDate);
    const todaysDate = new Date();

    return orderDeliveryDate > todaysDate ? true : false;
  }

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
    setIsConfirmLoading(true);
    try {
      let requestBody = { orderStatus: 'confirmed' };

      let confirmationEmail = {
        from: APP.email,
        to: order.userId.email,
        subject: 'Pedido confirmado',
        message: `<p>O seu pedido com o Nº: ${
          order.orderNumber
        } foi confirmado para o dia ${deliveredAt}, com o valor total de ${getTotal()}. Por favor indique o número do seu pedido ao efectuar pagamento via MB WAY (+351 9** *** ***).</p><p>Encontre todos os detalhes do seu pedido na sua pagina de perfil -> Historico de pedidos.</p> <br/><br/><p>Com os melhores cumprimentos,</p><p>${APP_NAME} 👩🏾‍🍳</p>`,
      };

      await Promise.all([updateOrder(requestBody, order._id), sendEmail(confirmationEmail)]);
      dispatch(confirmOrder({ id: order._id }));
      setIsModalOpen(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsPaidLoading(true);

    try {
      let requestBody = { paid: true };

      await updateOrder(requestBody, order._id);

      dispatch(confirmPayment({ id: order._id }));
      setOpenPaid(false);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsPaidLoading(false);
    }
  };

  const isElegibleForFreeDelivery = () => {
    return (order.deliveryDiscount || (order.total > order.amountForFreeDelivery && order.deliveryMethod === 'delivery')) && !order.haveExtraDeliveryFee;
  };

  const getTotal = () => {
    if (order.haveExtraDeliveryFee) {
      return (order.total + order.deliveryFee).toFixed(2) + APP.currency;
    }

    if (isOrderForDelivery) {
      return order.total < order.amountForFreeDelivery ? (order.total + order.deliveryFee).toFixed(2) + APP.currency : order.total.toFixed(2) + APP.currency;
    }
    return order.total.toFixed(2) + APP.currency;
  };

  function isPending() {
    if (order.orderStatus === 'pending' && shouldDisplayConfirmButton()) {
      return true;
    }
  }

  return (
    <Card sx={shopOrderClasses.container}>
      <CardContent>
        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Nº:</b>
          </Typography>
          <Typography variant={componentProps.variant.body1} gutterBottom>
            {order.orderNumber}
          </Typography>
        </Box>

        {isCurrentUserAdmin && (
          <Box sx={shopOrderClasses.infoField}>
            <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
              <b>Utilizador:</b>
            </Typography>
            <Typography variant={componentProps.variant.body1} gutterBottom>
              {order.userId.username}
            </Typography>
          </Box>
        )}

        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Telefone:</b>
          </Typography>
          <Typography variant={componentProps.variant.body1} gutterBottom>
            {order.contact}
          </Typography>
        </Box>

        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Data de criação:</b>
          </Typography>
          <Typography variant={componentProps.variant.body1} gutterBottom>
            {createdAt}
          </Typography>
        </Box>

        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Data de entrega:</b>
          </Typography>
          <Typography variant={componentProps.variant.body1} gutterBottom>
            {deliveredAt}
          </Typography>
        </Box>

        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Método de entrega:</b>
          </Typography>
          <Typography variant={componentProps.variant.body1} gutterBottom>
            {isOrderForDelivery ? 'Entrega' : 'Take Away'}
          </Typography>
        </Box>

        {order.address && (
          <Box>
            <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main} align='left'>
              <b>Morada: </b>
            </Typography>

            <Typography variant={componentProps.variant.body1} gutterBottom>
              {order.address}
            </Typography>
          </Box>
        )}

        {order.message && (
          <Box sx={shopOrderClasses.infoField}>
            <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
              <b>Mensagem:</b>
            </Typography>
            <Typography variant={componentProps.variant.body1} gutterBottom>
              {order.message}
            </Typography>
          </Box>
        )}

        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Quantidade: </b>
          </Typography>
          <Box>
            {itemsQuantity.length > 0 &&
              itemsQuantity.map((item, index) => {
                return (
                  <Typography variant={componentProps.variant.body1} gutterBottom key={index}>
                    {item}
                  </Typography>
                );
              })}
          </Box>
        </Box>

        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Preço: </b>
          </Typography>
          <Box>
            {itemsPrice.length > 0 &&
              itemsPrice.map((item, index) => {
                return (
                  <Typography variant={componentProps.variant.body1} gutterBottom key={index}>
                    {item + APP.currency}
                  </Typography>
                );
              })}
          </Box>
        </Box>

        {isOrderForDelivery && (
          <Box sx={shopOrderClasses.infoField}>
            <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
              <b>Taxa de entrega:</b>
            </Typography>
            <Box variant={componentProps.variant.body1}>
              <Typography sx={{ textDecoration: isElegibleForFreeDelivery() ? 'line-through' : '' }} gutterBottom>
                {order.deliveryFee + APP.currency}
              </Typography>
              {order.deliveryDiscount && `0${APP.currency}`}
            </Box>
          </Box>
        )}
        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Status: </b>
          </Typography>
          <Typography>
            {translateStatus(order.orderStatus)}

            {shouldShowConfirmButton && (
              <Button size={componentProps.size.small} onClick={() => setIsModalOpen(true)}>
                Confirmar
              </Button>
            )}
          </Typography>

          <ConfirmOrderModal isModalOpen={isModalOpen} handleConfirmOrder={handleConfirmOrder} setIsModalOpen={setIsModalOpen} isConfirmLoading={isConfirmLoading} />
        </Box>

        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Pago: </b>
          </Typography>
          <Typography>
            {order.paid ? 'Sim' : 'Não'}
            {!order.paid && isCurrentUserAdmin && (
              <Button size={componentProps.size.small} onClick={() => setOpenPaid(true)}>
                Confirmar
              </Button>
            )}
          </Typography>

          <PaidOrderModal openPaid={openPaid} handleConfirmPayment={handleConfirmPayment} setOpenPaid={setOpenPaid} isPaidLoading={isPaidLoading} isOrderPending={isOrderPending} />
        </Box>
        <Box sx={shopOrderClasses.infoField}>
          <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
            <b>Total:</b>
          </Typography>
          <Typography variant={componentProps.variant.body1}>{getTotal()}</Typography>
        </Box>
      </CardContent>

      {shouldShowCardActions && (
        <CardActions sx={shopOrderClasses.actions}>
          {!location.pathname.includes('send-email') && isCurrentUserAdmin && (
            <Button size={componentProps.size.small} onClick={() => navigate(`/send-email/orders/${order._id}`)}>
              Contactar
            </Button>
          )}
          {shouldShowEditButton && (
            <Button size={componentProps.size.small} sx={shopOrderClasses.editBtn} onClick={() => navigate(`/orders/edit/${order._id}`)}>
              Editar
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
