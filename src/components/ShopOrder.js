// jshint esversion:9

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { confirmDelivered, confirmOrder, confirmPayment } from '../redux/features/orders/ordersSlice';
import { getItemsPrice, getItemsQuantity, parseDateAndTimeToShow, capitalizeAppName, APP } from '../utils/app.utils';
import { Box, Button, Card, CardActions, CardContent, Typography, useTheme } from '@mui/material';
import { componentProps, shopOrderClasses } from '../utils/app.styleClasses';
import ConfirmAndEmailModal from './ConfirmAndEmailModal';

const APP_NAME = capitalizeAppName();

export function ShopOrder({ order }) {
  const { user } = useContext(AuthContext);
  const [createdAt, setCreatedAt] = useState('');
  const [deliveredAt, setDeliveredAt] = useState('');
  const [itemsQuantity, setItemsQuantity] = useState([]);
  const [itemsPrice, setItemsPrice] = useState([]);
  const [isConfirmedLoading, setIsConfirmedLoading] = useState(false);
  const [isDeliveredLoading, setIsDeliveredLoading] = useState(false);
  const [isPaidLoading, setIsPaidLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState(false);
  const [isDeliveredModalOpen, setIsDeliveredModalOpen] = useState(false);
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const theme = useTheme();

  const isCurrentUserAdmin = user.userType === 'admin';
  const shouldShowCardActions = isCurrentUserAdmin || isPending();
  const shouldShowEditButton = (isPending() && user.userType === 'user') || isCurrentUserAdmin;
  const isOrderPending = order.orderStatus === 'pending' ? true : false;
  const shouldShowConfirmButton = isOrderPending && shouldDisplayConfirmButton() && isCurrentUserAdmin;
  const isOrderForDelivery = order.deliveryMethod === 'delivery';
  const isOrderConfirmed = order.orderStatus === 'confirmed' ? true : false;

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
    setIsConfirmedLoading(true);
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
      return { message: 'Operação concluida com sucesso.' };
    } catch (error) {
      console.log(error.message);
      return { message: `Impossivel realizar operação. ${error.message}` };
    } finally {
      setIsConfirmedLoading(false);
    }
  };

  const handleDeliveredOrder = async (sendEmailChoice) => {
    setIsDeliveredLoading(true);
    try {
      let requestBody = { delivered: true };

      let reviewEmail = {
        from: APP.email,
        to: order.userId.email,
        subject: 'Deixe a sua avaliação',
        message: `<p>Caro cliente, esperamos que esteja tudo bem consigo. Gostaríamos de lhe pedir um rápido favor: poderia nos fornecer uma avaliação sobre a sua experiência relativamente ao seu ultimo pedido? Para tal basta clicar <a href="${APP.url}/reviews/create/${order._id}"><b>aqui</b></a>.</br> Agradecemos a sua ajuda e feedback.</p> <br/><br/><p>Com os melhores cumprimentos,</p><p>${APP_NAME} 👩🏾‍🍳</p>`,
      };

      if (sendEmailChoice) {
        await updateOrder(requestBody, order._id);
        dispatch(confirmDelivered({ id: order._id }));
        return { message: 'Operação concluida com sucesso.' };
      }
      await Promise.all([updateOrder(requestBody, order._id), sendEmail(reviewEmail)]);
      dispatch(confirmDelivered({ id: order._id }));
      return { message: 'Operação concluida com sucesso.' };
    } catch (error) {
      console.log(error.message);
      return { message: `Impossivel realizar operação. ${error.message}` };
    } finally {
      setIsDeliveredLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsPaidLoading(true);

    try {
      let requestBody = { paid: true };

      await updateOrder(requestBody, order._id);
      dispatch(confirmPayment({ id: order._id }));
      return { message: 'Operação concluida com sucesso.' };
    } catch (error) {
      console.log(error.message);
      return { message: `Impossivel realizar operação. ${error.message}` };
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
              <Button size={componentProps.size.small} onClick={() => setIsConfirmedModalOpen(true)}>
                Confirmar
              </Button>
            )}
          </Typography>

          <ConfirmAndEmailModal
            isLoading={isConfirmedLoading}
            isModalOpen={isConfirmedModalOpen}
            setIsModalOpen={setIsConfirmedModalOpen}
            mainFunction={handleConfirmOrder}
            question='Enviar email de confirmação?'
            buttonText='Confirmar'
          />
        </Box>

        {isOrderConfirmed && (
          <Box sx={shopOrderClasses.infoField}>
            <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
              <b>Pago: </b>
            </Typography>
            <Typography>
              {order.paid ? 'Sim' : 'Não'}
              {!order.paid && isCurrentUserAdmin && (
                <Button size={componentProps.size.small} onClick={() => setIsPaidModalOpen(true)}>
                  Confirmar
                </Button>
              )}
            </Typography>

            <ConfirmAndEmailModal
              isLoading={isPaidLoading}
              isModalOpen={isPaidModalOpen}
              setIsModalOpen={setIsPaidModalOpen}
              mainFunction={handleConfirmPayment}
              question='Confirmar pago?'
              buttonText='Confirmar'
            />
          </Box>
        )}

        {order.paid && (
          <Box sx={shopOrderClasses.infoField}>
            <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
              <b>Entregue: </b>
            </Typography>
            <Typography>
              {order.delivered ? 'Sim' : 'Não'}
              {!order.delivered && isCurrentUserAdmin && (
                <Button size={componentProps.size.small} onClick={() => setIsDeliveredModalOpen(true)}>
                  Confirmar
                </Button>
              )}
            </Typography>

            <ConfirmAndEmailModal
              isLoading={isDeliveredLoading}
              isModalOpen={isDeliveredModalOpen}
              setIsModalOpen={setIsDeliveredModalOpen}
              mainFunction={handleDeliveredOrder}
              question='Confirmar entrega e enviar email de review?'
              buttonText='Com email'
              buttonSecondaryText='Sem email'
            />
          </Box>
        )}

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
