// jshint esversion:9

import { Box, Button, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sendEmail } from 'api';
import { ShopOrder } from 'components/ShopOrder';
import { componentProps, sendEmailClasses } from 'utils/app.styleClasses';
import { parseDateAndTimeToShow, capitalizeAppName, APP } from 'utils/app.utils';
import ErrorMessage from 'components/ErrorMessage';
import SuccessMessage from 'components/SuccessMessage';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const APP_NAME = capitalizeAppName();
const APP_EMAIL = APP.email;

const SendEmailPage = () => {
  const { shopOrders } = useSelector((store) => store.orders);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const submitForm = useRef(null);
  const effectRan = useRef(null);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!effectRan.current && orderId) {
      const order = shopOrders.find((oneOrder) => oneOrder._id === orderId);
      setOrder(order);

      let initialFormValues = {
        to: order.userId.email,
        subject: `Pedido ${parseDateAndTimeToShow(order.deliveryDate)}`,
        message: '',
      };

      // Sets the initial values to the form fields
      reset(initialFormValues);

      return () => {
        effectRan.current = true;
      };
    }
  }, [shopOrders, orderId, reset]);

  const handleEmailSubmit = async ({ to, subject, message }) => {
    setErrorMessage(undefined);
    setIsLoading(true);
    try {
      const requestBody = { from: APP_EMAIL, to, subject, message };
      await sendEmail(requestBody);
      setSuccessMessage('Email enviado com sucesso.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={sendEmailClasses.container}>
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ mt: 4, mb: 2 }}>
        Enviar Email
      </Typography>
      <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ mb: 4 }}>
        Detalhes de pedido
      </Typography>

      {order && !successMessage && (
        <Box>
          <ShopOrder order={order} />

          <Box sx={sendEmailClasses.form}>
            <form onSubmit={handleSubmit(handleEmailSubmit)} noValidate>
              <TextField
                label='De'
                defaultValue={APP_NAME}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                sx={sendEmailClasses.formField}
              />

              <Controller
                name={componentProps.name.to}
                control={control}
                rules={{ required: 'Email em falta' }}
                render={({ field }) => (
                  <TextField
                    label='Para'
                    type={componentProps.type.email}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={sendEmailClasses.formField}
                    InputProps={{
                      readOnly: true,
                    }}
                    error={errors.to ? true : false}
                    autoComplete='true'
                    {...field}
                  />
                )}
              />

              <Controller
                name={componentProps.name.subject}
                control={control}
                rules={{ required: 'Assunto em falta' }}
                render={({ field }) => (
                  <TextField
                    label='Assunto'
                    type={componentProps.type.text}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={sendEmailClasses.formField}
                    error={errors.subject ? true : false}
                    autoComplete='true'
                    {...field}
                  />
                )}
              />

              <Controller
                name={componentProps.name.message}
                control={control}
                rules={{ required: 'Mensagem em falta' }}
                render={({ field }) => (
                  <TextField
                    label='Mensagem'
                    maxRows={4}
                    multiline
                    sx={sendEmailClasses.formTextArea}
                    placeholder='Escreva aqui a sua mensagem...'
                    autoComplete='true'
                    error={errors.message ? true : false}
                    {...field}
                  />
                )}
              />

              {errorMessage && <ErrorMessage message={errorMessage} />}
              {errors.to && <ErrorMessage message={errors.to.message} />}
              {errors.subject && <ErrorMessage message={errors.subject.message} />}
              {errors.message && <ErrorMessage message={errors.message.message} />}

              <button type={componentProps.type.submit} ref={submitForm} hidden>
                Enviar
              </button>
            </form>
          </Box>
        </Box>
      )}

      {successMessage && <SuccessMessage message={successMessage} />}

      <Box>
        {!isLoading && (
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}

        {!successMessage && !isLoading && order && (
          <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitForm.current.click()}>
            Enviar
          </Button>
        )}
        {isLoading && !successMessage && <CircularProgress size='80px' />}
      </Box>
    </Box>
  );
};

export default SendEmailPage;
