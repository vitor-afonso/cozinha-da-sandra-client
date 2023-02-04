// jshint esversion:9
import * as React from 'react';
import { AuthContext } from '../context/auth.context';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { ShopItem } from '../components/ShopItem/ShopItemCard';
import { CartOrderForm } from '../components/CartOrderForm';
import { clearCart, handleAddedDeliveryFee } from '../redux/features/items/itemsSlice';
import { updateShopUser } from '../redux/features/users/usersSlice';
import emptyCartImage from '../images/emptyCart.svg';

import ms from 'ms';

import { Box, Button, Modal, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

const CartPage = () => {
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, hasDeliveryDiscount, amountForFreeDelivery, addedDeliveryFee } = useSelector((store) => store.items);
  const { shopOrders } = useSelector((store) => store.orders);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryDateError, setDeliveryDateError] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryMethodError, setDeliveryMethodError] = useState(false);
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState(false);
  const [addressStreet, setAddressStreet] = useState('');
  const [addressStreetError, setAddressStreetError] = useState(false);
  const [addressCity, setAddressCity] = useState('');
  const [addressCityError, setAddressCityError] = useState(false);
  const [addressCode, setAddressCode] = useState('');
  const [addressCodeError, setAddressCodeError] = useState(false);
  const [message, setMessage] = useState('');
  const [isNotVisible, setIsNotVisible] = useState(true);
  const [isAddressNotVisible, setIsAddressNotVisible] = useState(true);
  const [requiredInput, setRequiredInput] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef();
  const submitBtnRef = useRef();
  const orderAddressRef = useRef(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ms converts days to milliseconds
  // then i can use it to define the date that the user can book
  const minDay = ms('2d');
  const maxDay = ms('60d');

  const cartClasses = {
    container: {
      px: 3,
      pb: 3,
    },
    itemsContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
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

    image: {
      mx: 'auto',
      minWidth: '200px',
      maxWidth: '400px',
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAddressNotVisible(true);
  }, []);

  const toggleForm = () => {
    setIsNotVisible(!isNotVisible);
    setTimeout(() => scrollToOrderInfo(formRef), 300);
  };

  const scrollToOrderInfo = (elemRef) => {
    window.scrollTo({
      top: elemRef.current.offsetTop - 80,
      behavior: 'smooth',
    });
  };

  const scrollToOrderAddress = (elemRef) => {
    window.scrollTo({
      top: elemRef.current.offsetTop - 80,
      behavior: 'smooth',
    });
  };

  const validateContact = (e) => {
    //regEx to prevent from typing letters and adding limit of 9 digits
    const re = /^[0-9]{0,14}$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setContact(e.target.value);
    }
  };

  const checkDeliveryDate = () => {
    //delivery date must be min 2 days from actual date
    const minDate = new Date(+new Date() + minDay).toISOString().slice(0, -8);

    return new Date(deliveryDate) > new Date(minDate) ? true : false;
  };

  const validateAddressCode = (e) => {
    const re = /^[0-9]{0,4}(?:-[0-9]{0,3})?$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setAddressCode(e.target.value);
    }
  };

  const handleRadioClick = (e) => {
    setDeliveryMethod(e.target.value);
    if (e.target.value === 'delivery') {
      setIsAddressNotVisible(false);
      setRequiredInput(true);
      dispatch(handleAddedDeliveryFee({ deliveryMethod: e.target.value }));
      setTimeout(() => scrollToOrderAddress(formRef), 300);
    }
    if (e.target.value === 'takeAway') {
      setIsAddressNotVisible(true);
      setRequiredInput(false);
      dispatch(handleAddedDeliveryFee({ deliveryMethod: e.target.value }));
    }

    //console.log(e.target.value);
  };

  const checkIfHaveDiscount = () => {
    if ((deliveryMethod === 'delivery' && cartTotal > amountForFreeDelivery) || hasDeliveryDiscount) {
      return true;
    }
    return false;
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!user._id) {
      return;
    }
    if (!contact) {
      setContactError(true);
      setErrorMessage('Por favor adicione telefone.');
      return;
    }
    setContactError(false);

    if (!deliveryDate) {
      setDeliveryDateError(true);
      setErrorMessage('Por favor escolha data de entrega.');
      return;
    }
    setDeliveryDateError(false);

    if (!checkDeliveryDate() && user.userType === 'user') {
      setDeliveryDateError(true);
      setErrorMessage('Data de entrega invalida, escolha data com um minimo de 48h.');
      return;
    }
    setDeliveryDateError(false);

    if (!deliveryMethod) {
      setDeliveryMethodError(true);
      setErrorMessage('Por favor escolha metodo de entrega.');
      return;
    }
    setDeliveryMethodError(false);

    if (deliveryMethod === 'delivery' && !addressStreet) {
      setAddressStreetError(true);
      setErrorMessage('Morada incompleta.');
      return;
    }
    setAddressStreetError(false);

    if (deliveryMethod === 'delivery' && !addressCode) {
      setAddressCodeError(true);
      setErrorMessage('Morada incompleta.');
      return;
    }
    setAddressCodeError(false);

    if (deliveryMethod === 'delivery' && !addressCity) {
      setAddressCityError(true);
      setErrorMessage('Morada incompleta.');
      return;
    }
    setAddressCityError(false);

    setBtnLoading(true);

    try {
      let fullAddress;

      if (deliveryMethod === 'delivery') {
        fullAddress = [addressStreet, addressCode, addressCity];
      }

      let requestBody = {
        orderNumber: shopOrders.length + 1,
        deliveryDate: new Date(deliveryDate),
        contact,
        address: fullAddress ? fullAddress.join(' ') : '',
        message,
        deliveryMethod,
        deliveryFee: addedDeliveryFee ? orderDeliveryFee : 0,
        amountForFreeDelivery: amountForFreeDelivery,
        deliveryDiscount: checkIfHaveDiscount(),
        items: cartItems,
        userId: user._id,
        total: cartTotal.toFixed(2),
      };

      //console.log('requestBody to create order: ', requestBody);

      let { data } = await createOrder(requestBody);

      //console.log('created order data', data);

      dispatch(updateShopUser(data.updatedUser));

      setSuccessMessage('Pedido criado com sucesso. Será contactado o mais brevemente possivel para confirmar o seu pedido. Consulte os detalhes do seu pedido no seu perfil.');

      dispatch(clearCart());
    } catch (error) {
      setErrorMessage(error.message);
      setBtnLoading(false);
    }
  };

  return (
    <Box sx={cartClasses.container}>
      <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
        CARRINHO
      </Typography>
      {!successMessage && (
        <>
          {cartItems.length > 0 ? (
            <>
              <Box sx={cartClasses.itemsContainer}>
                {shopItems.map((item) => {
                  if (cartItems.includes(item._id)) {
                    return (
                      <Box key={item._id} sx={{ mb: 1, mr: 1, minWidth: 300 }}>
                        <ShopItem {...item} deliveryMethod={deliveryMethod} />
                      </Box>
                    );
                  }
                })}
              </Box>

              {deliveryMethod === 'delivery' && (
                <Box sx={{ mt: 4 }}>
                  {hasDeliveryDiscount || (cartTotal > amountForFreeDelivery && deliveryMethod === 'delivery') ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant='h6' color='#031D44' sx={{ fontWeight: 'bold', mr: 1 }}>
                        Taxa de entrega:
                      </Typography>
                      <Typography variant='body1' color='#031D44' sx={{ textDecoration: 'line-through', mr: 1 }}>
                        {orderDeliveryFee}€
                      </Typography>
                      <Typography variant='body1' color='#031D44'>
                        0€
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant='h6' color='#031D44' sx={{ fontWeight: 'bold', mr: 1 }}>
                        Taxa de entrega:
                      </Typography>
                      <Typography variant='body1' color='#031D44'>
                        {orderDeliveryFee}€
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h4' color='#031D44' sx={{ mt: '10px', mb: 2, fontWeight: 'bold', mr: 1 }}>
                  Total:
                </Typography>
                <Typography variant='h4' color='#031D44' sx={{ mt: '10px', mb: 2 }}>
                  {addedDeliveryFee && cartTotal < amountForFreeDelivery ? (cartTotal + orderDeliveryFee).toFixed(2) : cartTotal.toFixed(2)}€
                </Typography>
              </Box>

              <Button sx={{ mr: 1 }} variant='outlined' endIcon={<DeleteIcon />} onClick={handleOpen}>
                Limpar
              </Button>

              <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={modalStyle}>
                  <Typography id='modal-modal-title' variant='h6' component='h2'>
                    Limpar carrinho?
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button sx={{ mr: 1 }} variant='outlined' onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button type='button' color='error' variant='contained' onClick={() => dispatch(clearCart())}>
                      Limpar
                    </Button>
                  </Box>
                </Box>
              </Modal>

              {isNotVisible && (
                <Button variant='contained' onClick={() => toggleForm()}>
                  Continuar
                </Button>
              )}

              <CartOrderForm
                formRef={formRef}
                orderAddressRef={orderAddressRef}
                isNotVisible={isNotVisible}
                submitOrder={submitOrder}
                contact={contact}
                validateContact={validateContact}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                deliveryMethod={deliveryMethod}
                handleRadioClick={handleRadioClick}
                isAddressNotVisible={isAddressNotVisible}
                requiredInput={requiredInput}
                addressStreet={addressStreet}
                setAddressStreet={setAddressStreet}
                addressCode={addressCode}
                validateAddressCode={validateAddressCode}
                addressCity={addressCity}
                setAddressCity={setAddressCity}
                message={message}
                setMessage={setMessage}
                errorMessage={errorMessage}
                navigate={navigate}
                contactError={contactError}
                deliveryDateError={deliveryDateError}
                deliveryMethodError={deliveryMethodError}
                addressStreetError={addressStreetError}
                addressCityError={addressCityError}
                addressCodeError={addressCodeError}
                submitBtnRef={submitBtnRef}
                successMessage={successMessage}
                btnLoading={btnLoading}
                minDay={minDay}
                maxDay={maxDay}
                user={user}
              />
            </>
          ) : (
            <Box>
              <Box sx={cartClasses.image}>
                <img src={emptyCartImage} alt='Empty cart' style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />
              </Box>

              <Typography paragraph sx={{ fontSize: 16 }}>
                Carrinho vazio.
              </Typography>
            </Box>
          )}
        </>
      )}

      {successMessage && (
        <>
          <Typography paragraph sx={{ my: '25px', maxWidth: '600px', mx: 'auto' }} color='#031D44'>
            {successMessage}
          </Typography>

          <Button variant='outlined' onClick={() => navigate(`/profile/${user._id}`)}>
            Perfil
          </Button>
        </>
      )}
    </Box>
  );
};

export default CartPage;
