// jshint esversion:9
import * as React from 'react';
import { AuthContext } from 'context/auth.context';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, sendEmail } from 'api';
import { ShopItem } from 'components/ShopItemCard';
import { CartOrderForm } from 'components/CartOrderForm';
import { CustomModal } from 'components/CustomModal';
import { clearCart } from 'redux/features/items/itemsSlice';
import { updateShopUser } from 'redux/features/users/usersSlice';
import emptyCartImage from 'images/emptyCart.svg';
import { APP, isElegibleForGlobalDiscount } from 'utils/app.utils';
import { Box, Button, Typography, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getShopOrders, updateShopOrder } from 'redux/features/orders/ordersSlice';
import { cartClasses, componentProps } from 'utils/app.styleClasses';
import SuccessMessage from 'components/SuccessMessage';
import { useForm } from 'react-hook-form';
import { pagesRoutes } from 'utils/app.pagesRoutes';
import { Helmet } from 'react-helmet-async';
import { getTotalWithDiscount, getDiscountAmount } from 'utils/app.utils';

const CartPage = () => {
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, isFreeDeliveryForAll, amountForFreeDelivery, percentageDiscount } = useSelector((store) => store.items);
  const { shopOrders, isLoadingOrders } = useSelector((store) => store.orders);
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

  const shouldPayForDeliveryFee = deliveryMethod === 'delivery' && cartTotal < amountForFreeDelivery && !isFreeDeliveryForAll && !haveExtraFee;
  const orderPriceWithFee = (getTotalWithDiscount(cartTotal, percentageDiscount) + orderDeliveryFee).toFixed(2) + APP.currency;
  const orderPrice = getTotalWithDiscount(cartTotal, percentageDiscount).toFixed(2) + APP.currency;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isLoadingOrders) {
    }
  }, [isLoadingOrders]);

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
      setTimeout(() => scrollToOrderAddress(formRef), 300);
    }
    if (value === 'takeAway') {
      setIsAddressVisible(false);
      setRequiredInput(false);
      setValue('haveExtraFee', false);
    }
    dispatch(getShopOrders());
  };

  const getDeliveryFee = () => {
    if (haveExtraFee) {
      return Number(customDeliveryFee);
    }
    return deliveryMethod === 'delivery' ? orderDeliveryFee : 0;
  };

  const calculateCartTotalToShow = () => {
    if (haveExtraFee) {
      return (getTotalWithDiscount(cartTotal, percentageDiscount) + Number(customDeliveryFee)).toFixed(2);
    }
    if (deliveryMethod === 'delivery') {
      return shouldPayForDeliveryFee ? orderPriceWithFee : orderPrice;
    }
    return orderPrice;
  };

  const getOrderNumber = () => {
    return String(shopOrders.length + 1);
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

      let orderReceivedEmail = {
        from: APP.email,
        to: APP.email,
        subject: 'Novo pedido recebido',
        message: `<p> 💰Ca-ching!💰 Novo pedido recebido.</p>`,
      };

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
        haveDeliveryDiscount: isElegibleForGlobalDiscount(isFreeDeliveryForAll, deliveryMethod, haveExtraFee),
        percentageDiscount: percentageDiscount,
        items: cartItems,
        userId: user._id,
        total: cartTotal.toFixed(2),
      };

      let { data } = await Promise.race([createOrder(requestBody), sendEmail(orderReceivedEmail)]);

      dispatch(updateShopOrder(data.createdOrder));
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
    <>
      <Helmet>
        <title>Carrinho</title>
        <meta name='description' content='Snacks para todos os gostos e ocasiões com opção de entrega e take-away.' />
        <link rel='canonical' href={pagesRoutes.cart} />
      </Helmet>
      <Box sx={cartClasses.container}>
        <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }} component={componentProps.variant.h1}>
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

                {percentageDiscount > 0 && deliveryMethod !== 'delivery' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant={componentProps.variant.h6} color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1 }}>
                      Desconto:
                    </Typography>
                    <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
                      {getDiscountAmount(cartTotal, percentageDiscount) + APP.currency}
                    </Typography>
                  </Box>
                )}
                {deliveryMethod !== 'delivery' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                  isLoadingOrders={isLoadingOrders}
                  percentageDiscount={percentageDiscount}
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
    </>
  );
};

export default CartPage;
