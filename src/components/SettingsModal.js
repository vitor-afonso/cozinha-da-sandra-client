import { Box, Button, CircularProgress, FormControlLabel, Modal, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { componentProps, settingsClasses, settingsModalStyle } from 'utils/app.styleClasses';
import ErrorMessage from './ErrorMessage';
import { updateSettings } from 'api';
import { updateInitialDeliveryFee } from 'redux/features/items/itemsSlice';

const SettingsModal = ({ isModalOpen, setIsModalOpen }) => {
  const { orderDeliveryFee, globalDeliveryDiscount, amountForFreeDelivery, percentageDiscount, settingsId } = useSelector((store) => store.items);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const submitFormRef = useRef(null);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  let haveGlobalDeliveryDiscount = watch('haveGlobalDeliveryDiscount');
  let deliveryFee = watch('deliveryFee');
  let minAmountForFreeDelivery = watch('minAmountForFreeDelivery');
  let discount = watch('discount');

  let areValuesUnchanged =
    deliveryFee === orderDeliveryFee && haveGlobalDeliveryDiscount === globalDeliveryDiscount && minAmountForFreeDelivery === amountForFreeDelivery && discount === percentageDiscount;

  useEffect(() => {
    if (!isLoading) {
      let initialFormValues = { deliveryFee: orderDeliveryFee, haveGlobalDeliveryDiscount: globalDeliveryDiscount, minAmountForFreeDelivery: amountForFreeDelivery, discount: percentageDiscount };

      // Sets the initial values to the form fields
      reset(initialFormValues);
    }
  }, [isLoading]);

  const handleSubmitSettings = async ({ deliveryFee, haveGlobalDeliveryDiscount, minAmountForFreeDelivery, discount }) => {
    setErrorMessage(undefined);

    if (areValuesUnchanged) {
      // Prevents from making API call if theres no change
      setIsModalOpen(false);
      return;
    }

    setIsLoading(true);

    const requestBody = {
      deliveryFee: Number(deliveryFee),
      minForFreeDelivery: Number(minAmountForFreeDelivery),
      discount: Number(discount),
      globalDeliveryDiscount: haveGlobalDeliveryDiscount,
    };

    try {
      let { data } = await updateSettings(requestBody, settingsId);
      dispatch(updateInitialDeliveryFee(data));
      setIsModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box sx={settingsModalStyle}>
        <Typography variant={componentProps.variant.h4} color={componentProps.color.primary} sx={{ mb: 4 }} component={componentProps.variant.h1}>
          Definiçoes gerais
        </Typography>
        <Box sx={settingsClasses.form}>
          <form noValidate onSubmit={handleSubmit(handleSubmitSettings)}>
            <Controller
              name={componentProps.name.minAmountForFreeDelivery}
              control={control}
              rules={{ required: 'Valor minimo em falta' }}
              render={({ field }) => (
                <TextField
                  label='Valor minimo para entrega grátis'
                  type={componentProps.type.text}
                  variant={componentProps.variant.outlined}
                  fullWidth
                  sx={settingsClasses.formField}
                  error={errors.minAmountForFreeDelivery ? true : false}
                  autoComplete='true'
                  {...field}
                />
              )}
            />

            <Controller
              name={componentProps.name.deliveryFee}
              control={control}
              rules={{ required: 'Valor de taxa entrega em falta' }}
              render={({ field }) => (
                <TextField
                  label='Valor de taxa entrega'
                  type={componentProps.type.text}
                  variant={componentProps.variant.outlined}
                  fullWidth
                  sx={settingsClasses.formField}
                  error={errors.deliveryFee ? true : false}
                  autoComplete='true'
                  {...field}
                />
              )}
            />

            <Controller
              name={componentProps.name.discount}
              control={control}
              rules={{ required: 'Desconto em falta' }}
              render={({ field }) => (
                <TextField
                  label='Percentagem de desconto'
                  type={componentProps.type.text}
                  variant={componentProps.variant.outlined}
                  fullWidth
                  sx={settingsClasses.formField}
                  error={errors.discount ? true : false}
                  autoComplete='true'
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name={componentProps.name.haveGlobalDeliveryDiscount}
              render={({ field }) => <FormControlLabel control={<Switch checked={haveGlobalDeliveryDiscount} {...field} />} label='Entrega gratuita geral' />}
            />

            <button type={componentProps.type.submit} ref={submitFormRef} hidden>
              Criar
            </button>
          </form>
        </Box>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {errors.minAmountForFreeDelivery && <ErrorMessage message={errors.minAmountForFreeDelivery.message} />}
        {errors.haveGlobalDeliveryDiscount && <ErrorMessage message={errors.haveGlobalDeliveryDiscount.message} />}
        {errors.deliveryFee && <ErrorMessage message={errors.deliveryFee.message} />}
        {errors.discount && <ErrorMessage message={errors.discount.message} />}
        {!isLoading && (
          <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitFormRef.current.click()}>
            Actualizar
          </Button>
        )}
        {isLoading && <CircularProgress size='50px' />}
      </Box>
    </Modal>
  );
};

export default SettingsModal;
