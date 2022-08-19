// jshint esversion:9
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteOrder, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { deleteShopOrder, updateShopOrder } from '../redux/features/orders/ordersSlice';
import { addToCart, addToEditCart, clearCart, decreaseItemAmount, increaseItemAmount, removeFromCart, setItemAmount } from '../redux/features/items/itemsSlice';
import { getItemsAmount, parseDateToEdit } from '../utils/app.utils';
import { ShopItem } from '../components/ShopItem/ShopItemCard';

import { Paper, ListItem, ListItemIcon, ListItemText, Typography, List, ListItemAvatar, Avatar, Box, Button, Grid } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

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
  const location = useLocation();

  const editOrderClasses = {
    container: {
      px: 3,
      pb: 3,
    },
    list: {
      //maxWidth: 300,
    },
    gridItem: {
      marginLeft: 'auto',
      marginRight: 'auto',
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
    navigate('/orders');
  };

  const handleDeleteOrder = async () => {
    // showDeleteModal() - on click apagar
    // delete order - on confirm delete
    try {
      await deleteOrder(orderId);

      dispatch(deleteShopOrder({ id: orderId }));
      setSuccessMessage('Encomenda apagada com sucesso.');
      setTimeout(() => navigate('/orders'), 5000);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contact || !user._id) {
      return;
    }
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

      setSuccessMessage('Encomenda actualizada com sucesso.');

      // this will update the state with the updated order
      console.log('Encomenda actualizada com sucesso.', data);
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
            EDITAR ENCOMENDA
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
                  <Button variant='contained' {...bindTrigger(popupState)} sx={{ mt: 2 }}>
                    Adicionar Item
                  </Button>
                  <Menu {...bindMenu(popupState)}>
                    {shopItems.map((item) => {
                      if (!cartItems.includes(item._id)) {
                        return (
                          <MenuItem onClick={() => dispatch(addToCart({ id: item._id }))}>
                            {item.name}
                            <AddOutlinedIcon />
                          </MenuItem>
                        );
                      }
                    })}
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </Box>

          {deliveryMethod === 'delivery' && (
            <div>
              {hasDeliveryDiscount || (cartTotal > amountForFreeDelivery && deliveryMethod === 'delivery') ? (
                <p>
                  Taxa de entrega: <span style={{ textDecoration: 'line-through' }}>{orderDeliveryFee}€</span>
                </p>
              ) : (
                <p>Taxa de entrega: {orderDeliveryFee}€</p>
              )}
            </div>
          )}

          <div>
            <p>Total: {addedDeliveryFee && cartTotal < amountForFreeDelivery ? (cartTotal + orderDeliveryFee).toFixed(2) : cartTotal.toFixed(2)}€</p>
            <Button variant='outlined' onClick={() => dispatch(clearCart())}>
              Limpar Carrinho
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <p>
              <b>Autor da encomenda:</b> {order.userId.username}
            </p>
            <div>
              <label htmlFor='contact'>Contacto</label>
              <div>
                <input name='contact' type='text' required value={contact} onChange={(e) => validateContact(e)} placeholder='912345678' />
              </div>
            </div>

            <div>
              <label htmlFor='deliveryDate'>Data & Hora de entrega</label>

              <div>
                <input name='deliveryDate' type='datetime-local' required value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} min={new Date().toISOString().slice(0, -8)} />
              </div>
            </div>

            <fieldset>
              <legend>Entrega ou Take Away?</legend>
              <div>
                <label htmlFor='delivery'>Com Entrega</label>
                <input type='radio' name='delivery' value='delivery' checked={deliveryMethod === 'delivery'} onChange={handleRadioClick} />
              </div>
              <div>
                <label htmlFor='takeAway'>Take Away</label>
                <input type='radio' name='takeAway' value='takeAway' checked={deliveryMethod === 'takeAway'} onChange={handleRadioClick} />
              </div>
            </fieldset>

            <div ref={addressRef} className={` ${isAddressNotVisible && 'order-form'}`}>
              <label htmlFor='fullAddress'>Morada</label>
              <div>
                <input name='fullAddress' type='text' required={requiredInput} value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder='Rua dos reis n 7' />
              </div>
            </div>

            <div>
              <label htmlFor='message'>Mensagem</label>
              <div>
                <textarea id='email-message' name='message' value={message} placeholder='Escreva aqui a sua mensagem...' onChange={(e) => setMessage(e.target.value)}></textarea>
              </div>
            </div>

            {errorMessage && <p>{errorMessage}</p>}

            <button type='submit' ref={submitForm} hidden>
              Actualizar
            </button>
          </form>
        </>
      )}

      {successMessage && <p>{successMessage}</p>}

      <div>
        <span onClick={clearInputsAndGoBack}>Voltar</span>

        {!successMessage && (
          <>
            <button type='button' onClick={handleDeleteOrder}>
              Apagar
            </button>
            <button type='button' onClick={() => submitForm.current.click()}>
              Actualizar
            </button>
          </>
        )}
      </div>
    </Box>
  );
};
