// jshint esversion:9

import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteOrder, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { deleteShopOrder } from '../redux/features/orders/ordersSlice';
import { addToCart, clearCart, setItemAmount, handlefreeDelivery } from '../redux/features/items/itemsSlice';
import { ShopItem } from '../components/ShopItemCard';
import { EditOrderForm } from './../components/EditOrderForm';
import { APP, getItemsAmount, getMissingAmountForFreeDelivery, isElegibleForGlobalDiscount, isValidDeliveryDate, parseDateToEdit } from '../utils/app.utils';
import TooltipDeliveryFee from '../components/TooltipDeliveryFee';
import { editOrderPageClasses } from '../utils/app.styleClasses';
import { CustomModal } from '../components/CustomModal';

import { Typography, Box, Button, Grid, CircularProgress, useTheme } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const EditOrderPage = () => {
  const { shopOrders } = useSelector((store) => store.orders);
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, globalDeliveryDiscount, amountForFreeDelivery } = useSelector((store) => store.items);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [order, setOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [contact, setContact] = useState('');
  const [customDeliveryFee, setCustomDeliveryFee] = useState('');
  const [contactError, setContactError] = useState(false);
  const [customDeliveryFeeError, setCustomDeliveryFeeError] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryDateError, setDeliveryDateError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [isAddressNotVisible, setIsAddressNotVisible] = useState(true);
  const [requiredInput, setRequiredInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [haveExtraFee, setHaveExtraFee] = useState(false);
  const adminEffectRan = useRef(false);
  const addressRef = useRef();
  const submitForm = useRef();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (adminEffectRan.current === false && orderId) {
      dispatch(clearCart());
      window.scrollTo(0, 0);

      let orderToEdit = shopOrders.find((item) => item._id === orderId);
      setOrder(orderToEdit);

      return () => {
        adminEffectRan.current = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, shopOrders]);

  useEffect(() => {
    if (order) {
      setOrderDetails(order);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (order) {
      // to set the items in to the cart
      let itemsArr = getItemsAmount(order.items);

      order.items.forEach((item) => {
        dispatch(addToCart({ id: item._id }));
        dispatch(setItemAmount({ id: item._id, amount: itemsArr[item.name] }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    // only runs on unmount
    return () => {
      clearInputs();
      dispatch(clearCart());
    };
  }, [dispatch]);

  const setOrderDetails = (order) => {
    setContact(order.contact);
    setDeliveryDate(parseDateToEdit(order.deliveryDate));
    setDeliveryMethod(order.deliveryMethod);
    setCustomDeliveryFee(order.deliveryFee > 0 ? order.deliveryFee : orderDeliveryFee);

    // converts the a value to a boolean if not already a boolean,
    // sets that boolean to HaveExtraFee
    setHaveExtraFee(!!order.haveExtraDeliveryFee);

    if (!wasTakeAwayOrder()) {
      setIsAddressNotVisible(false);
      setFullAddress(order.address);
    }
    if (order.message !== '') {
      setMessage(order.message);
    }
  };

  const validateContact = (e) => {
    //regEx to prevent from typing letters and adding limit of 9 digits
    const re = /^[0-9]{0,14}$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setContact(e.target.value);
    }
  };

  const handleRadioClick = (e) => {
    setDeliveryMethod(e.target.value);
    if (e.target.value === 'delivery') {
      setIsAddressNotVisible(false);
      setRequiredInput(true);
      dispatch(handlefreeDelivery({ deliveryMethod: e.target.value }));
    } else {
      setIsAddressNotVisible(true);
      setRequiredInput(false);
      dispatch(handlefreeDelivery({ deliveryMethod: e.target.value }));
      setHaveExtraFee(false);
    }
  };

  const clearInputs = () => {
    setContact('');
    setDeliveryDate('');
    setDeliveryMethod('');
    setFullAddress('');
    setMessage('');
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderId);

      dispatch(deleteShopOrder({ id: orderId }));
      setSuccessMessage('Pedido apagado com sucesso.');
    } catch (error) {
      console.log(error.message);
    }
  };

  function wasTakeAwayOrder() {
    return order.deliveryMethod === 'takeAway';
  }

  const calculateCartTotalToShow = () => {
    if (haveExtraFee) {
      return (cartTotal + Number(customDeliveryFee)).toFixed(2);
    }
    if (deliveryMethod === 'delivery') {
      if (!wasTakeAwayOrder()) {
        return cartTotal < order.amountForFreeDelivery && !order.deliveryDiscount ? (cartTotal + order.deliveryFee).toFixed(2) : cartTotal.toFixed(2);
      }

      return cartTotal < amountForFreeDelivery ? (cartTotal + orderDeliveryFee).toFixed(2) : cartTotal.toFixed(2);
    }
    return cartTotal.toFixed(2);
  };

  const isElegibleForFreeDelivery = () => {
    return (globalDeliveryDiscount || (cartTotal > order.amountForFreeDelivery && deliveryMethod === 'delivery') || (order.deliveryDiscount && !wasTakeAwayOrder())) && !haveExtraFee;
  };

  const getDeliveryFee = () => {
    if (haveExtraFee) {
      return customDeliveryFee;
    }

    if (wasTakeAwayOrder() && user.userType === 'user') {
      return deliveryMethod === 'delivery' ? customDeliveryFee : 0;
    }

    if (order.deliveryMethod === 'delivery' && order.total >= order.amountForFreeDelivery) {
      return order.deliveryFee;
    }

    return deliveryMethod === 'delivery' ? order.deliveryFee : 0;
  };

  const shouldShowDeliveryMessage = () => {
    return !isElegibleForFreeDelivery() && getMissingAmountForFreeDelivery(order.amountForFreeDelivery, cartTotal, order.deliveryMethod) > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(undefined);

    if (!user._id) {
      return;
    }

    if (!contact) {
      setContactError(true);
      setErrorMessage('Por favor adicione contacto.');
      return;
    }
    setContactError(false);

    if (!deliveryDate) {
      setDeliveryDateError(true);
      setErrorMessage('Por favor escolha data de entrega.');
      return;
    }
    setDeliveryDateError(false);

    if (!isValidDeliveryDate(deliveryDate) && user.userType === 'user') {
      setDeliveryDateError(true);
      setErrorMessage('Data de entrega invalida, escolha data com um minimo de 48h.');
      return;
    }
    setDeliveryDateError(false);

    if (deliveryMethod === 'delivery' && !fullAddress) {
      setAddressError(true);
      setErrorMessage('Por favor adicione morada para entrega.');
      return;
    }

    setAddressError(false);

    if (!customDeliveryFee) {
      setCustomDeliveryFeeError(true);
      setErrorMessage('Por favor adicione taxa de entrega.');
      return;
    }

    setCustomDeliveryFeeError(false);

    setIsLoading(true);

    try {
      let requestBody = {
        deliveryDate: new Date(deliveryDate),
        contact,
        address: deliveryMethod === 'delivery' ? fullAddress : '',
        deliveryFee: Number(getDeliveryFee()),
        haveExtraDeliveryFee: haveExtraFee,
        deliveryDiscount: isElegibleForGlobalDiscount(globalDeliveryDiscount, deliveryMethod, haveExtraFee, order.deliveryMethod, order.deliveryDiscount),
        message,
        deliveryMethod,
        amountForFreeDelivery: wasTakeAwayOrder() ? amountForFreeDelivery : order.amountForFreeDelivery,
        items: cartItems,
        total: cartTotal.toFixed(2), // only items price
      };

      await updateOrder(requestBody, orderId);

      setSuccessMessage('Pedido actualizado com sucesso.');
      clearInputs();
      dispatch(clearCart());
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={editOrderPageClasses.container}>
      <Typography variant='h2' color='primary' sx={{ my: 4 }}>
        EDITAR
      </Typography>
      {order && !successMessage && (
        <>
          <Grid container spacing={2}>
            {shopItems.map((element) => {
              if (cartItems.includes(element._id)) {
                return (
                  <Grid item key={element._id} xs={12} sm={6} md={4} lg={3} sx={editOrderPageClasses.gridItem}>
                    <ShopItem {...element} deliveryMethod={deliveryMethod} />
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>

          <Box sx={editOrderPageClasses.list}>
            <PopupState variant='popover' popupId='demo-popup-menu'>
              {(popupState) => (
                <React.Fragment>
                  <Button variant='contained' {...bindTrigger(popupState)} sx={{ my: 2 }}>
                    Adicionar Item
                  </Button>
                  <Menu {...bindMenu(popupState)}>
                    {shopItems.map((item, index) => {
                      if (!cartItems.includes(item._id)) {
                        return (
                          <MenuItem key={index} onClick={() => dispatch(addToCart({ id: item._id }))}>
                            <Box sx={editOrderPageClasses.listItem}>
                              <Typography color='primary' sx={{ fontWeight: 'bold' }}>
                                {item.name}
                              </Typography>
                              <AddOutlinedIcon />
                            </Box>
                          </MenuItem>
                        );
                      }
                      return null;
                    })}
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </Box>

          <EditOrderForm
            handleSubmit={handleSubmit}
            validateContact={validateContact}
            contactError={contactError}
            contact={contact}
            setDeliveryDate={setDeliveryDate}
            deliveryDate={deliveryDate}
            handleRadioClick={handleRadioClick}
            deliveryMethod={deliveryMethod}
            isAddressNotVisible={isAddressNotVisible}
            requiredInput={requiredInput}
            setFullAddress={setFullAddress}
            fullAddress={fullAddress}
            addressRef={addressRef}
            message={message}
            setMessage={setMessage}
            errorMessage={errorMessage}
            submitForm={submitForm}
            customDeliveryFee={customDeliveryFee}
            deliveryDateError={deliveryDateError}
            customDeliveryFeeError={customDeliveryFeeError}
            setCustomDeliveryFee={setCustomDeliveryFee}
            addressError={addressError}
            haveExtraFee={haveExtraFee}
            setHaveExtraFee={setHaveExtraFee}
          />

          <Box sx={editOrderPageClasses.infoContainer}>
            {user._id !== order.userId._id && (
              <Box sx={editOrderPageClasses.infoField}>
                <Typography variant='body1' color={theme.palette.neutral.main} onClick={() => navigate(`/profile/edit/${order.userId._id}`)}>
                  <b>Autor de pedido:</b>
                </Typography>
                <Typography variant='body1' color={theme.palette.neutral.main} gutterBottom>
                  {order.userId.username}
                </Typography>
              </Box>
            )}

            {deliveryMethod === 'delivery' && (
              <>
                {shouldShowDeliveryMessage() && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1, mt: 4 }}>
                    <Typography variant='body2' color={theme.palette.neutral.main} sx={{ mr: 1, maxWidth: '350px' }}>
                      Entrega grátis a partir de {wasTakeAwayOrder() ? amountForFreeDelivery + APP.currency : order.amountForFreeDelivery + APP.currency}. Valor em falta:
                      {getMissingAmountForFreeDelivery(order.amountForFreeDelivery, cartTotal, order.deliveryMethod) + APP.currency}.
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: shouldShowDeliveryMessage() ? 0 : 4 }}>
                  <Typography variant='h6' color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1 }}>
                    Items no carrinho:
                  </Typography>
                  <Typography variant='body1' color={theme.palette.neutral.main}>
                    {cartTotal.toFixed(2) + APP.currency}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='h6' color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1 }}>
                    Taxa de entrega:
                  </Typography>

                  <Typography variant='body1' color={theme.palette.neutral.main} sx={{ textDecoration: isElegibleForFreeDelivery() && 'line-through', mr: 1 }}>
                    {getDeliveryFee() + APP.currency}
                  </Typography>

                  {isElegibleForFreeDelivery() && (
                    <Typography variant='body1' color={theme.palette.neutral.main} sx={{ mr: 1 }}>
                      0{APP.currency}
                    </Typography>
                  )}
                  {user.userType === 'user' && <TooltipDeliveryFee />}
                </Box>
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant='h4' color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2, fontWeight: 'bold', mr: 1 }}>
                Total:
              </Typography>
              <Typography variant='h4' color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2 }}>
                {calculateCartTotalToShow() + APP.currency}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {successMessage && (
        <Typography paragraph sx={{ my: 4, maxWidth: '600px', mx: 'auto' }} color={theme.palette.neutral.main}>
          {successMessage}
        </Typography>
      )}

      <div>
        {!isLoading && (
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}

        {!successMessage && !isLoading && (
          <>
            <Button sx={{ mr: 1 }} type='button' color='error' variant='outlined' onClick={handleOpen}>
              Apagar
            </Button>

            <CustomModal isModalOpen={open} handleCloseModal={handleClose} mainFunction={handleDeleteOrder} question='Apagar Pedido?' buttonText='Apagar' />

            <Button type='button' variant='contained' onClick={() => submitForm.current.click()}>
              Actualizar
            </Button>
          </>
        )}
        {isLoading && !successMessage && <CircularProgress size='80px' sx={{ mt: 2, mb: 2 }} />}
      </div>
    </Box>
  );
};

export default EditOrderPage;
