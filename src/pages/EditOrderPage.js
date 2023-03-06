// jshint esversion:9

import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteOrder, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { deleteShopOrder } from '../redux/features/orders/ordersSlice';
import { addToCart, clearCart, setItemAmount, handleAddedDeliveryFee } from '../redux/features/items/itemsSlice';
import { getItemsAmount, parseDateToEdit } from '../utils/app.utils';
import { ShopItem } from '../components/ShopItem/ShopItemCard';
import { EditOrderForm } from './../components/EditOrderForm';

import ms from 'ms';

import { Typography, Box, Button, Grid, CircularProgress } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Modal from '@mui/material/Modal';

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

const EditOrderPage = () => {
  const { shopOrders } = useSelector((store) => store.orders);
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, hasDeliveryDiscount, amountForFreeDelivery, addedDeliveryFee } = useSelector((store) => store.items);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [order, setOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryDateError, setDeliveryDateError] = useState(false);
  const [isAddressNotVisible, setIsAddressNotVisible] = useState(true);
  const [requiredInput, setRequiredInput] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const adminEffectRan = useRef(false);
  const addressRef = useRef();
  const submitForm = useRef();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ms converts days to milliseconds
  // then i can use it to define the date that the user can book
  const MIN_DAYS = ms('2d');
  const MAX_DAYS = ms('60d');

  const editOrderClasses = {
    container: {
      px: 3,
      pb: 3,
    },
    list: {
      //minWidth: 300,
    },
    listItem: {
      width: '100%',
      minWidth: 200,
      display: 'flex',
      justifyContent: 'space-between',
    },
    gridItem: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    infoContainer: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 600,
      my: 2,
    },
    infoField: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    deliveryField: {
      display: 'flex',
    },
    addressField: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    formContainer: {
      marginTop: 0,
      marginBottom: 5,
    },
    form: {
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: 300,
      maxWidth: 600,
    },
    formField: {
      marginTop: 0,
      marginBottom: 5,
      display: 'block',
    },
    formTextArea: {
      minWidth: '100%',
    },
  };

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
  }, [orderId, shopOrders, dispatch]);

  useEffect(() => {
    if (order) {
      setOrderDetails(order);
    }
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
  }, [order, dispatch]);

  const setOrderDetails = (order) => {
    setContact(order.contact);
    setDeliveryDate(parseDateToEdit(order.deliveryDate));
    setDeliveryMethod(order.deliveryMethod);

    if (order.deliveryMethod === 'delivery') {
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

  const isValidDeliveryDate = () => {
    //delivery date must be min 2 days from actual date
    const minDate = new Date(+new Date() + MIN_DAYS).toISOString().slice(0, -8);

    return new Date(deliveryDate) > new Date(minDate) ? true : false;
  };

  const handleRadioClick = (e) => {
    setDeliveryMethod(e.target.value);
    if (e.target.value === 'delivery') {
      setIsAddressNotVisible(false);
      setRequiredInput(true);
      dispatch(handleAddedDeliveryFee({ deliveryMethod: e.target.value }));
    } else {
      setIsAddressNotVisible(true);
      setRequiredInput(false);
      dispatch(handleAddedDeliveryFee({ deliveryMethod: e.target.value }));
    }
  };

  const clearInputs = () => {
    setContact('');
    setDeliveryDate('');
    setDeliveryMethod('');
    setFullAddress('');
    setMessage('');
  };

  const clearInputsAndGoBack = () => {
    clearInputs();
    dispatch(clearCart());
    navigate(-1);
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

  const calculateCartTotalToShow = () => {
    return addedDeliveryFee && cartTotal < amountForFreeDelivery ? (cartTotal + orderDeliveryFee).toFixed(2) : cartTotal.toFixed(2);
  };

  const getDeliveryFee = () => {
    if (order.deliveryFee > 0) {
      return deliveryMethod === 'delivery' ? order.deliveryFee : 0;
    }

    return deliveryMethod === 'delivery' ? orderDeliveryFee : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (!isValidDeliveryDate() && user.userType === 'user') {
      setDeliveryDateError(true);
      setErrorMessage('Data de entrega invalida, escolha data com um minimo de 48h.');
      return;
    }
    setDeliveryDateError(false);

    if (deliveryMethod === 'delivery' && !fullAddress) {
      setErrorMessage('Por favor adicione morada para entrega.');
      return;
    }

    setBtnLoading(true);

    try {
      let requestBody = {
        deliveryDate: new Date(deliveryDate),
        contact,
        address: deliveryMethod === 'delivery' ? fullAddress : '',
        deliveryFee: getDeliveryFee(),
        deliveryDiscount: deliveryMethod === 'delivery' && calculateCartTotalToShow() > order.amountForFreeDelivery ? true : false,
        message,
        deliveryMethod,
        items: cartItems,
        total: cartTotal.toFixed(2), // only items price
      };

      await updateOrder(requestBody, orderId);

      setSuccessMessage('Pedido actualizado com sucesso.');

      setBtnLoading(false);

      clearInputs();
      dispatch(clearCart());
    } catch (error) {
      setErrorMessage(error.message);
      setBtnLoading(false);
    }
  };

  return (
    <Box sx={editOrderClasses.container}>
      {order && !successMessage && (
        <>
          <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
            EDITAR
          </Typography>

          <Grid container spacing={2}>
            {shopItems.map((element) => {
              if (cartItems.includes(element._id)) {
                return (
                  <Grid item key={element._id} xs={12} sm={6} md={4} lg={3} sx={editOrderClasses.gridItem}>
                    <ShopItem {...element} deliveryMethod={deliveryMethod} />
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>

          <Box sx={editOrderClasses.list}>
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
                            <Box sx={editOrderClasses.listItem}>
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
            order={order}
            deliveryDateError={deliveryDateError}
            minDays={MIN_DAYS}
            maxDays={MAX_DAYS}
          />

          <Box sx={editOrderClasses.infoContainer}>
            {user._id !== order.userId._id && (
              <Box sx={editOrderClasses.infoField}>
                <Typography variant='body1' color='#031D44' onClick={() => navigate(`/profile/edit/${order.userId._id}`)}>
                  <b>Autor de pedido:</b>
                </Typography>
                <Typography variant='body1' gutterBottom>
                  {order.userId.username}
                </Typography>
              </Box>
            )}

            {deliveryMethod === 'delivery' && (
              <Box>
                {hasDeliveryDiscount || (cartTotal > amountForFreeDelivery && deliveryMethod === 'delivery') ? (
                  <Box sx={editOrderClasses.infoField}>
                    <Typography variant='body1' color='#031D44'>
                      <b>Taxa de entrega:</b>
                    </Typography>
                    <Box sx={editOrderClasses.deliveryField}>
                      <Typography variant='body1' gutterBottom sx={{ textDecoration: 'line-through', mr: 1 }}>
                        {orderDeliveryFee}€
                      </Typography>
                      <Typography variant='body1' gutterBottom>
                        0€
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={editOrderClasses.infoField}>
                    <Typography variant='body1' color='#031D44'>
                      <b>Taxa de entrega:</b>
                    </Typography>
                    <Typography variant='body1' gutterBottom>
                      {orderDeliveryFee}€
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={editOrderClasses.infoField}>
              <Typography variant='body1' color='#031D44'>
                <b>Total:</b>
              </Typography>

              <Typography variant='body1' gutterBottom>
                {calculateCartTotalToShow()}€
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {successMessage && (
        <Typography paragraph sx={{ my: '25px' }}>
          {successMessage}
        </Typography>
      )}

      <div>
        {!btnLoading && (
          <Button sx={{ mr: 1 }} onClick={clearInputsAndGoBack}>
            Voltar
          </Button>
        )}

        {!successMessage && !btnLoading && (
          <>
            <Button sx={{ mr: 1 }} type='button' color='error' variant='outlined' onClick={handleOpen}>
              Apagar
            </Button>

            <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
              <Box sx={modalStyle}>
                <Typography id='modal-modal-title' variant='h6' component='h2'>
                  Apagar Pedido?
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button sx={{ mr: 1 }} variant='outlined' onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type='button' color='error' variant='contained' onClick={handleDeleteOrder}>
                    Apagar
                  </Button>
                </Box>
              </Box>
            </Modal>

            <Button type='button' variant='contained' onClick={() => submitForm.current.click()}>
              Actualizar
            </Button>
          </>
        )}
        {btnLoading && !successMessage && <CircularProgress size='20px' />}
      </div>
    </Box>
  );
};

export default EditOrderPage;
