// jshint esversion:9
import * as React from 'react';
import { AuthContext } from '../context/auth.context';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { ShopItem } from '../components/ShopItem/ShopItemCard';
import { CartOrderForm } from '../components/CartOrderForm';
import { ExitModal } from '../components/ExitModal';
import { clearCart, handleAddedDeliveryFee } from '../redux/features/items/itemsSlice';
import { updateShopUser } from '../redux/features/users/usersSlice';
import emptyCartImage from '../images/emptyCart.svg';
import { APP } from '../utils/app.utils';

import ms from 'ms';

import { Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getShopOrders } from '../redux/features/orders/ordersSlice';

const cartClasses = {
  container: {
    px: 3,
    pb: 8,
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
    width: { xs: '200px', md: '300px' },
    marginBottom: 4,
  },
};

// ms converts days to milliseconds
// then i can use it to define the date that the user can book
const minDay = ms('2d');
const maxDay = ms('60d');

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef();
  const submitBtnRef = useRef();
  const orderAddressRef = useRef(null);
  const effectRan = useRef(false);

  const shouldPayForDeliveryFee = addedDeliveryFee && cartTotal < amountForFreeDelivery;
  const orderPriceWithFee = (cartTotal + orderDeliveryFee).toFixed(2) + APP.currency;
  const orderPrice = cartTotal.toFixed(2) + APP.currency;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAddressNotVisible(true);
  }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      dispatch(getShopOrders());

      return () => {
        effectRan.current = true;
      };
    }
  }, [dispatch]);

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

  const calculateCartTotalToShow = () => {
    if (deliveryMethod === 'delivery') {
      return shouldPayForDeliveryFee ? orderPriceWithFee : orderPrice;
    }
    return orderPrice;
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    setErrorMessage(undefined);

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
      setErrorMessage('Por favor escolha método de entrega.');
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

    setIsLoading(true);

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

      setSuccessMessage('Pedido criado com sucesso. Será contactado/a em breve para confirmar o seu pedido. Consulte os detalhes do seu pedido no seu perfil.');

      dispatch(clearCart());
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
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
                        <ShopItem {...item} />
                      </Box>
                    );
                  }
                  return null;
                })}
              </Box>

              {deliveryMethod !== 'delivery' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography variant='h4' color='#031D44' sx={{ fontWeight: 'bold', mr: 1 }}>
                    Total:
                  </Typography>
                  <Typography variant='h4' color='#031D44'>
                    {calculateCartTotalToShow()}
                  </Typography>
                </Box>
              )}
              <Button sx={{ mt: 2 }} variant='outlined' endIcon={<DeleteIcon />} onClick={handleOpenModal}>
                Limpar
              </Button>

              {isNotVisible && (
                <Button variant='contained' sx={{ mt: 2, ml: 2 }} onClick={() => toggleForm()}>
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
                isLoading={isLoading}
                minDay={minDay}
                maxDay={maxDay}
                user={user}
                calculateCartTotalToShow={calculateCartTotalToShow}
              />
            </>
          ) : (
            <Box>
              <Box sx={cartClasses.image}>
                <img src={emptyCartImage} alt='Empty cart' style={{ maxWidth: '100%', height: 'auto' }} />
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
          <Typography paragraph sx={{ my: 4, maxWidth: '600px', mx: 'auto' }} color='#031D44'>
            {successMessage}
          </Typography>

          <Button variant='outlined' onClick={() => navigate(`/profile/${user._id}`)}>
            Perfil
          </Button>
        </>
      )}
      <ExitModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} dispatch={dispatch} mainFunction={clearCart} question={'Limpar carrinho?'} buttonText={'Limpar'} />
    </Box>
  );
};

export default CartPage;
