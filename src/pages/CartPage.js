// jshint esversion:9
import * as React from 'react';
import { AuthContext } from '../context/auth.context';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { ShopItem } from '../components/ShopItemCard';
import { CartOrderForm } from '../components/CartOrderForm';
import { CustomModal } from '../components/CustomModal';
import { clearCart, handleFreeDelivery } from '../redux/features/items/itemsSlice';
import { updateShopUser } from '../redux/features/users/usersSlice';
import emptyCartImage from '../images/emptyCart.svg';
import { APP, isElegibleForGlobalDiscount } from '../utils/app.utils';
import { Box, Button, Typography, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getShopOrders } from '../redux/features/orders/ordersSlice';
import { cartClasses, componentProps } from '../utils/app.styleClasses';
import SuccessMessage from '../components/SuccessMessage';
import { useForm } from 'react-hook-form';

const CartPage = () => {
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, globalDeliveryDiscount, amountForFreeDelivery, canHaveFreeDelivery } = useSelector((store) => store.items);
  const { shopOrders } = useSelector((store) => store.orders);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const [requiredInput, setRequiredInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef();
  const submitBtnRef = useRef();
  const orderAddressRef = useRef(null);
  const effectRan = useRef(false);
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contact: '',
      deliveryDate: '',
      deliveryMethod: '',
      haveExtraFee: false,
      customDeliveryFee: orderDeliveryFee,
      addressStreet: '',
      addressCode: '',
      addressCity: '',
      message: '',
    },
  });

  let deliveryMethod = watch('deliveryMethod');
  let haveExtraFee = watch('haveExtraFee');
  let customDeliveryFee = watch('customDeliveryFee');

  const shouldPayForDeliveryFee = canHaveFreeDelivery && cartTotal < amountForFreeDelivery && !globalDeliveryDiscount && !haveExtraFee;
  const orderPriceWithFee = (cartTotal + orderDeliveryFee).toFixed(2) + APP.currency;
  const orderPrice = cartTotal.toFixed(2) + APP.currency;

  useEffect(() => {
    window.scrollTo(0, 0);
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
    setIsFormVisible(!isFormVisible);
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

  const handleDeliveryRadio = (value, field) => {
    field.onChange(value);
    if (value === 'delivery') {
      setIsAddressVisible(true);
      setRequiredInput(true);
      dispatch(handleFreeDelivery({ deliveryMethod: deliveryMethod }));
      setTimeout(() => scrollToOrderAddress(formRef), 300);
    }
    if (value === 'takeAway') {
      setIsAddressVisible(false);
      setRequiredInput(false);
      dispatch(handleFreeDelivery({ deliveryMethod: deliveryMethod }));
      setValue('haveExtraFee', false);
    }
  };

  const getDeliveryFee = () => {
    if (haveExtraFee) {
      return Number(customDeliveryFee);
    }

    return deliveryMethod === 'delivery' ? orderDeliveryFee : 0;
  };

  const calculateCartTotalToShow = () => {
    if (haveExtraFee) {
      return (cartTotal + Number(customDeliveryFee)).toFixed(2);
    }
    if (deliveryMethod === 'delivery') {
      return shouldPayForDeliveryFee ? orderPriceWithFee : orderPrice;
    }
    return orderPrice;
  };

  const getOrderNumber = () => {
    dispatch(getShopOrders());
    let orderNumber = String(shopOrders.length + 1).padStart(5, '0');
    return orderNumber;
  };

  function handleClearCart() {
    dispatch(clearCart());
  }

  const handleOrderSubmit = async ({ contact, deliveryDate, deliveryMethod, addressStreet, addressCode, addressCity, message }) => {
    setErrorMessage(undefined);

    if (!user._id) {
      return;
    }

    setIsLoading(true);

    try {
      let fullAddress;

      if (deliveryMethod === 'delivery') {
        fullAddress = [addressStreet, addressCode, addressCity];
      }

      let requestBody = {
        orderNumber: getOrderNumber(),
        deliveryDate: new Date(deliveryDate),
        contact,
        address: fullAddress ? fullAddress.join(' ') : '',
        message,
        deliveryMethod,
        deliveryFee: getDeliveryFee(),
        haveExtraDeliveryFee: haveExtraFee,
        amountForFreeDelivery: amountForFreeDelivery,
        deliveryDiscount: isElegibleForGlobalDiscount(globalDeliveryDiscount, deliveryMethod, haveExtraFee),
        items: cartItems,
        userId: user._id,
        total: cartTotal.toFixed(2),
      };

      let { data } = await createOrder(requestBody);

      dispatch(updateShopUser(data.updatedUser));

      setSuccessMessage('Pedido criado com sucesso. Será contactado/a em breve para confirmar o seu pedido. Consulte os detalhes do seu pedido no seu perfil.');

      handleClearCart();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={cartClasses.container}>
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
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
                  <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1 }}>
                    Total:
                  </Typography>
                  <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main}>
                    {calculateCartTotalToShow()}
                  </Typography>
                </Box>
              )}
              <Button sx={{ mt: 2 }} variant={componentProps.variant.outlined} endIcon={<DeleteIcon />} onClick={() => setIsModalOpen(true)}>
                Limpar
              </Button>

              {!isFormVisible && (
                <Button variant={componentProps.variant.contained} sx={{ mt: 2, ml: 2 }} onClick={() => toggleForm()}>
                  Continuar
                </Button>
              )}

              <CartOrderForm
                formRef={formRef}
                orderAddressRef={orderAddressRef}
                isFormVisible={isFormVisible}
                handleSubmit={handleSubmit}
                handleOrderSubmit={handleOrderSubmit}
                control={control}
                errors={errors}
                deliveryMethod={deliveryMethod}
                handleDeliveryRadio={handleDeliveryRadio}
                isAddressVisible={isAddressVisible}
                requiredInput={requiredInput}
                errorMessage={errorMessage}
                navigate={navigate}
                submitBtnRef={submitBtnRef}
                successMessage={successMessage}
                isLoading={isLoading}
                user={user}
                calculateCartTotalToShow={calculateCartTotalToShow}
                haveExtraFee={haveExtraFee}
                customDeliveryFee={customDeliveryFee}
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
          <SuccessMessage message={successMessage} />

          <Button variant={componentProps.variant.outlined} onClick={() => navigate(`/profile/${user._id}`)}>
            Perfil
          </Button>
        </>
      )}
      <CustomModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} mainFunction={handleClearCart} question='Limpar carrinho?' buttonText='Limpar' />
    </Box>
  );
};

export default CartPage;
