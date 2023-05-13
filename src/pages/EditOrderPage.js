// jshint esversion:9

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteOrder, updateOrder } from 'api';
import { AuthContext } from 'context/auth.context';
import { deleteShopOrder } from 'redux/features/orders/ordersSlice';
import { addToCart, clearCart, setItemAmount, handleFreeDelivery } from 'redux/features/items/itemsSlice';
import { ShopItem } from 'components/ShopItemCard';
import { EditOrderForm } from 'components/EditOrderForm';
import { APP, getItemsAmount, getMissingAmountForFreeDelivery, isElegibleForGlobalDiscount, parseDateToEdit } from 'utils/app.utils';
import TooltipDeliveryFee from 'components/TooltipDeliveryFee';
import { componentProps, editOrderPageClasses } from 'utils/app.styleClasses';
import { CustomModal } from 'components/CustomModal';
import { useForm } from 'react-hook-form';
import SuccessMessage from 'components/SuccessMessage';
import { Typography, Box, Button, Grid, CircularProgress, useTheme } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const EditOrderPage = () => {
  const { shopOrders } = useSelector((store) => store.orders);
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, isFreeDeliveryForAll, amountForFreeDelivery } = useSelector((store) => store.items);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [order, setOrder] = useState(null);
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const adminEffectRan = useRef(false);
  const submitBtnRef = useRef(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  let deliveryMethod = watch('deliveryMethod');
  let haveExtraFee = watch('haveExtraFee');
  let customDeliveryFee = watch('customDeliveryFee');
  let isDelivery = deliveryMethod === 'delivery';
  const isAdmin = user.userType === 'admin';

  useEffect(() => {
    if (adminEffectRan.current === false && orderId && control) {
      window.scrollTo(0, 0);

      let orderToEdit = shopOrders.find((item) => item._id === orderId);
      setOrder(orderToEdit);

      let initialFormValues = {
        contact: orderToEdit.contact,
        deliveryDate: parseDateToEdit(orderToEdit.deliveryDate),
        deliveryMethod: orderToEdit.deliveryMethod,
        haveExtraFee: orderToEdit.haveExtraDeliveryFee,
        customDeliveryFee: orderToEdit.deliveryFee > 0 ? orderToEdit.deliveryFee : orderDeliveryFee,
        fullAddress: orderToEdit.address,
        message: orderToEdit.message,
      };

      // Sets the initial values to the form fields
      reset(initialFormValues);

      setIsAddressVisible(orderToEdit.deliveryMethod === 'delivery' ? true : false);

      return () => {
        adminEffectRan.current = true;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, shopOrders, control, reset]);

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
      dispatch(clearCart());
    };
  }, [dispatch]);

  const handleDeliveryRadio = (value, field) => {
    field.onChange(value);
    if (value === 'delivery') {
      setIsAddressVisible(true);
      dispatch(handleFreeDelivery({ deliveryMethod: deliveryMethod }));
    }
    if (value === 'takeAway') {
      setIsAddressVisible(false);
      dispatch(handleFreeDelivery({ deliveryMethod: deliveryMethod }));
      setValue('haveExtraFee', false);
    }
  };

  const clearInputs = () => {
    setValue('contact', '');
    setValue('deliveryDate', '');
    setValue('deliveryMethod', '');
    setValue('fullAddress', '');
    setValue('message', '');
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
    if (haveExtraFee) {
      return (cartTotal + Number(customDeliveryFee)).toFixed(2);
    }
    if (isDelivery) {
      if (order.deliveryMethod === 'delivery') {
        return cartTotal < order.amountForFreeDelivery && !order.haveDeliveryDiscount ? (cartTotal + order.deliveryFee).toFixed(2) : cartTotal.toFixed(2);
      }

      return cartTotal < amountForFreeDelivery ? (cartTotal + orderDeliveryFee).toFixed(2) : cartTotal.toFixed(2);
    }
    return cartTotal.toFixed(2);
  };

  const isElegibleForFreeDelivery = () => {
    return (isFreeDeliveryForAll || (cartTotal > order.amountForFreeDelivery && isDelivery) || (order.haveDeliveryDiscount && order.deliveryMethod === 'delivery')) && !haveExtraFee;
  };

  const getDeliveryFee = () => {
    if (haveExtraFee) {
      return customDeliveryFee;
    }

    if (!order.deliveryMethod === 'delivery' && !isAdmin) {
      return isDelivery ? customDeliveryFee : 0;
    }

    if (order.deliveryMethod === 'delivery' && order.total >= order.amountForFreeDelivery) {
      return order.deliveryFee;
    }

    return isDelivery ? order.deliveryFee : 0;
  };

  const shouldShowDeliveryMessage = () => {
    return !isElegibleForFreeDelivery() && getMissingAmountForFreeDelivery(order.amountForFreeDelivery, cartTotal, order.deliveryMethod) > 0;
  };

  const handleEditOrderSubmit = async ({ contact, deliveryDate, fullAddress, haveExtraFee, message }) => {
    setErrorMessage(undefined);

    if (!user._id) {
      return;
    }

    setIsLoading(true);

    try {
      let requestBody = {
        deliveryDate: new Date(deliveryDate),
        contact,
        address: isDelivery ? fullAddress : '',
        deliveryFee: Number(getDeliveryFee()),
        haveExtraDeliveryFee: haveExtraFee,
        haveDeliveryDiscount: isElegibleForGlobalDiscount(isFreeDeliveryForAll, deliveryMethod, haveExtraFee, order.deliveryMethod, order.haveDeliveryDiscount),
        message,
        deliveryMethod,
        amountForFreeDelivery: order.deliveryMethod === 'delivery' ? order.amountForFreeDelivery : amountForFreeDelivery,
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
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
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
                  <Button variant={componentProps.variant.contained} {...bindTrigger(popupState)} sx={{ my: 2 }}>
                    Adicionar Item
                  </Button>
                  <Menu {...bindMenu(popupState)}>
                    {shopItems.map((item, index) => {
                      if (!cartItems.includes(item._id)) {
                        return (
                          <MenuItem key={index} onClick={() => dispatch(addToCart({ id: item._id }))}>
                            <Box sx={editOrderPageClasses.listItem}>
                              <Typography color={componentProps.color.primary} sx={{ fontWeight: 'bold' }}>
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
            handleOrderSubmit={handleEditOrderSubmit}
            control={control}
            errors={errors}
            handleDeliveryRadio={handleDeliveryRadio}
            isAddressVisible={isAddressVisible}
            errorMessage={errorMessage}
            submitBtnRef={submitBtnRef}
            haveExtraFee={haveExtraFee}
            deliveryMethod={deliveryMethod}
            isDelivery={isDelivery}
            isAdmin={isAdmin}
          />

          <Box sx={editOrderPageClasses.infoContainer}>
            {user._id !== order.userId._id && (
              <Box sx={editOrderPageClasses.infoField}>
                <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main} onClick={() => navigate(`/profile/edit/${order.userId._id}`)}>
                  <b>Autor de pedido:</b>
                </Typography>
                <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main} gutterBottom>
                  {order.userId.username}
                </Typography>
              </Box>
            )}

            {isDelivery && (
              <>
                {shouldShowDeliveryMessage() && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1, mt: 4 }}>
                    <Typography variant={componentProps.variant.body2} color={theme.palette.neutral.main} sx={{ mr: 1, maxWidth: '350px' }}>
                      Entrega grátis a partir de {order.deliveryMethod === 'delivery' ? order.amountForFreeDelivery + APP.currency : amountForFreeDelivery + APP.currency}. Valor em falta:
                      {getMissingAmountForFreeDelivery(order.amountForFreeDelivery, cartTotal, order.deliveryMethod) + APP.currency}.
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: shouldShowDeliveryMessage() ? 0 : 4 }}>
                  <Typography variant={componentProps.variant.h6} color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1 }}>
                    Items no carrinho:
                  </Typography>
                  <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
                    {cartTotal.toFixed(2) + APP.currency}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant={componentProps.variant.h6} color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1 }}>
                    Taxa de entrega:
                  </Typography>

                  <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main} sx={{ textDecoration: isElegibleForFreeDelivery() && 'line-through', mr: 1 }}>
                    {getDeliveryFee() + APP.currency}
                  </Typography>

                  {isElegibleForFreeDelivery() && (
                    <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main} sx={{ mr: 1 }}>
                      0{APP.currency}
                    </Typography>
                  )}
                  {!isAdmin && <TooltipDeliveryFee />}
                </Box>
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2, fontWeight: 'bold', mr: 1 }}>
                Total:
              </Typography>
              <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2 }}>
                {calculateCartTotalToShow() + APP.currency}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {successMessage && <SuccessMessage message={successMessage} />}

      <div>
        {!isLoading && (
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}

        {!successMessage && !isLoading && (
          <>
            <Button sx={{ mr: 1 }} type={componentProps.type.button} color={componentProps.color.error} variant={componentProps.variant.outlined} onClick={() => setIsModalOpen(true)}>
              Apagar
            </Button>

            <CustomModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} mainFunction={handleDeleteOrder} question='Apagar Pedido?' buttonText='Apagar' />

            <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitBtnRef.current.click()}>
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
