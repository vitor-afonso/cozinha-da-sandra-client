// jshint esversion:9
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteOrder, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { deleteShopOrder, updateShopOrder } from '../redux/features/orders/ordersSlice';
import { addToCart, clearCart, setItemAmount } from '../redux/features/items/itemsSlice';
import { getItemsAmount, parseDateToEdit } from '../utils/app.utils';
import { ShopItem } from '../components/ShopItem/ShopItemCard';

import { Typography, Box, Button, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Radio from '@mui/material/Radio';

export const EditOrderPage = () => {
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
  const [isAddressNotVisible, setIsAddressNotVisible] = useState(true);
  const [requiredInput, setRequiredInput] = useState(false);
  const adminEffectRan = useRef(false);
  const addressRef = useRef();
  const submitForm = useRef();

  const { orderId } = useParams();
  const navigate = useNavigate();

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
  }, [orderId, shopOrders]);

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
  }, [order]);

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

  const handleRadioClick = (e) => {
    setDeliveryMethod(e.target.value);
    if (e.target.value === 'delivery') {
      setIsAddressNotVisible(false);
      setRequiredInput(true);
    } else {
      setIsAddressNotVisible(true);
      setRequiredInput(false);
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
    // showDeleteModal() - on click apagar
    // delete order - on confirm delete
    try {
      await deleteOrder(orderId);

      dispatch(deleteShopOrder({ id: orderId }));
      setSuccessMessage('Pedido apagado com sucesso.');
      setTimeout(() => navigate('/orders'), 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user._id || user.userType !== 'admin') {
      return;
    }
    if (!contact) {
      setContactError(true);
      setErrorMessage('Por favor adicione contacto.');
      return;
    }
    setContactError(false);

    if (deliveryMethod === 'delivery' && !fullAddress) {
      setErrorMessage('Por favor adicione morada para entrega.');
      return;
    }

    try {
      let requestBody = {
        deliveryDate: new Date(deliveryDate),
        contact,
        address: deliveryMethod === 'delivery' ? fullAddress : '',
        deliveryFee: deliveryMethod === 'delivery' ? orderDeliveryFee : 0,
        deliveryDiscount: deliveryMethod === 'delivery' && order.total > order.amountForFreeDelivery ? true : false,
        message,
        deliveryMethod,
        items: cartItems,
        total: cartTotal.toFixed(2),
      };

      let { data } = await updateOrder(requestBody, orderId);

      setSuccessMessage('Pedido actualizado com sucesso.');

      // this will update the state with the updated order
      console.log('Pedido actualizado com sucesso.', data);
      dispatch(updateShopOrder(data));

      clearInputs();
      dispatch(clearCart());
      setTimeout(() => navigate('/orders'), 5000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Box sx={editOrderClasses.container}>
      {order && !successMessage && (
        <>
          <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
            EDITAR PEDIDO
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
                    })}
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </Box>

          <Box sx={editOrderClasses.formContainer}>
            <Box sx={editOrderClasses.form}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label='Contacto'
                  type='text'
                  variant='outlined'
                  fullWidth
                  required
                  sx={editOrderClasses.formField}
                  onChange={(e) => validateContact(e)}
                  error={contactError}
                  value={contact}
                />

                <TextField
                  label='Data & Hora de entrega'
                  type='datetime-local'
                  variant='outlined'
                  fullWidth
                  required
                  sx={editOrderClasses.formField}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  error={contactError}
                  value={deliveryDate}
                  min={new Date().toISOString().slice(0, -8)}
                />

                <FormControl sx={{ mb: 5 }} align='left' fullWidth={true}>
                  <FormLabel id='demo-row-radio-buttons-group-label'>Metodo de entrega</FormLabel>
                  <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group' onChange={handleRadioClick}>
                    <FormControlLabel value='delivery' control={<Radio />} label='Entrega' checked={deliveryMethod === 'delivery'} />
                    <FormControlLabel value='takeAway' control={<Radio />} label='Take Away' checked={deliveryMethod === 'takeAway'} />
                  </RadioGroup>
                </FormControl>

                {!isAddressNotVisible && (
                  <TextField
                    label='Morada'
                    type='text'
                    variant='outlined'
                    fullWidth
                    required={requiredInput}
                    sx={editOrderClasses.formField}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder='Rua dos bolos n 7'
                    error={contactError}
                    value={fullAddress}
                    ref={addressRef}
                  />
                )}

                {user._id !== order.userId._id && (
                  <TextField
                    id='outlined-read-only-input'
                    label='Mensagem'
                    defaultValue={message}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={editOrderClasses.formTextArea}
                    multiline
                    maxRows={4}
                  />
                )}

                {user._id === order.userId._id && (
                  <TextField
                    id='outlined-multiline-flexible'
                    label='Mensagem'
                    multiline
                    maxRows={4}
                    sx={editOrderClasses.formTextArea}
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    placeholder='Escreva aqui a sua mensagem...'
                  />
                )}

                {errorMessage && (
                  <Typography paragraph sx={{ my: '25px' }} color='error'>
                    {errorMessage}
                  </Typography>
                )}

                <button type='submit' ref={submitForm} hidden>
                  Actualizar
                </button>
              </form>
            </Box>
          </Box>

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
                {addedDeliveryFee && cartTotal < amountForFreeDelivery ? (cartTotal + orderDeliveryFee).toFixed(2) : cartTotal.toFixed(2)}€
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
        <Button sx={{ mr: 1 }} onClick={clearInputsAndGoBack}>
          Voltar
        </Button>

        {!successMessage && (
          <>
            <Button sx={{ mr: 1 }} type='button' color='error' variant='outlined' onClick={handleDeleteOrder}>
              Apagar
            </Button>
            <Button type='button' variant='contained' onClick={() => submitForm.current.click()}>
              Actualizar
            </Button>
          </>
        )}
      </div>
    </Box>
  );
};
