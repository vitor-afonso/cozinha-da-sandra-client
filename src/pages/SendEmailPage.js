// jshint esversion:9

import { Box, Button, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneOrder, sendEmail } from '../api';
import { ShopOrder } from '../components/ShopOrder';
import { componentProps, sendEmailClasses } from '../utils/app.styleClasses';
import { parseDateToShow, capitalizeAppName, APP } from '../utils/app.utils';
import ErrorMessage from '../components/ErrorMessage';

const APP_NAME = capitalizeAppName();
const APP_EMAIL = APP.email;

const SendEmailPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const from = { APP_EMAIL };
  const [to, setTo] = useState('');
  const [toError, setToError] = useState(false);
  const [subject, setSubject] = useState('');
  const [subjectError, setSubjectError] = useState(false);
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState(false);
  const [order, setOrder] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const submitForm = useRef();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (orderId) {
      try {
        (async () => {
          let order = await getOneOrder(orderId);
          setOrder(order.data);
          setTo(order.data.userId.email);
          setSubject(`Pedido ${parseDateToShow(order.data.deliveryDate)}`);
        })();
      } catch (error) {
        console.log(error.message);
        setErrorMessage('Não foi possivel obter email do destinatario na base de dados. Por favor introduza manualmente.');
      }
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!to) {
      setToError(true);
      setErrorMessage('Introduza endereço de email valido.');
      return;
    }
    setToError(false);

    if (!subject) {
      setSubjectError(true);
      setErrorMessage('Introduza assunto.');
      return;
    }
    setSubjectError(false);
    if (!message) {
      setMessageError(true);
      setErrorMessage('Introduza mensagem.');
      return;
    }
    setMessageError(false);
    setBtnLoading(true);
    try {
      const requestBody = { from, to, subject, message };
      await sendEmail(requestBody);
      setSuccessMessage('Email enviado com sucesso.');
      setBtnLoading(false);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setBtnLoading(false);
    }
  };

  return (
    <Box sx={sendEmailClasses.container}>
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
        Enviar Email
      </Typography>
      <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ my: 4 }}>
        Detalhes de pedido
      </Typography>

      {order && <ShopOrder order={order} />}

      {!order && <CircularProgress sx={{ my: 4 }} size='80px' />}

      {!successMessage && order && (
        <Box sx={sendEmailClasses.formContainer}>
          <Box sx={sendEmailClasses.form}>
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                label='De'
                defaultValue={APP_NAME}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                sx={sendEmailClasses.formField}
              />

              <TextField
                label='Para'
                type={componentProps.type.email}
                variant={componentProps.variant.outlined}
                fullWidth
                required
                sx={sendEmailClasses.formField}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                error={toError}
              />

              <TextField
                label='Assunto'
                type={componentProps.type.text}
                variant={componentProps.variant.outlined}
                fullWidth
                required
                sx={sendEmailClasses.formField}
                onChange={(e) => setSubject(e.target.value)}
                error={subjectError}
                value={subject}
              />

              <TextField
                id='outlined-multiline-flexible'
                label='Mensagem'
                multiline
                maxRows={4}
                required
                sx={sendEmailClasses.formTextArea}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Escreva aqui a sua mensagem'
                error={messageError}
              />

              {errorMessage && <ErrorMessage message={errorMessage} />}

              <button type={componentProps.type.submit} ref={submitForm} hidden>
                Enviar
              </button>
            </form>
          </Box>
        </Box>
      )}

      {successMessage && (
        <Typography paragraph sx={{ my: 4 }}>
          {successMessage}
        </Typography>
      )}

      <div>
        {!btnLoading && (
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}

        {!successMessage && !btnLoading && order && (
          <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitForm.current.click()}>
            Enviar
          </Button>
        )}
        {btnLoading && !successMessage && <CircularProgress size='80px' />}
      </div>
    </Box>
  );
};

export default SendEmailPage;
