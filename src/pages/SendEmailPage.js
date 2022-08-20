// jshint esversion:9

import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneOrder, sendEmail } from '../api';
import { ShopOrder } from '../components/ShopOrder';
import { parseDateToShow } from '../utils/app.utils';

export const SendEmailPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const from = 'cozinhadasandra22@gmail.com';
  const [to, setTo] = useState('');
  const [toError, setToError] = useState(false);
  const [subject, setSubject] = useState('');
  const [subjectError, setSubjectError] = useState(false);
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState(false);
  const [order, setOrder] = useState(null);
  const submitForm = useRef();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const sendEmailClasses = {
    container: {
      px: 3,
      pb: 3,
    },
    formContainer: {
      marginTop: 5,
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
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (orderId) {
      try {
        (async () => {
          let order = await getOneOrder(orderId);
          setOrder(order.data);
          setTo(order.data.userId.email);
          setSubject(`Encomenda ${parseDateToShow(order.data.deliveryDate)}`);
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

    try {
      const requestBody = { from, to, subject, message };
      await sendEmail(requestBody);
      setSuccessMessage('Email enviado com sucesso.');
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <Box sx={sendEmailClasses.container}>
      <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
        Enviar Email
      </Typography>
      <Typography variant='h4' color='#031D44' sx={{ my: '25px' }}>
        Detalhes de encomenda
      </Typography>

      {order && <ShopOrder order={order} />}

      {!successMessage && order && (
        <Box sx={sendEmailClasses.formContainer}>
          <Box sx={sendEmailClasses.form}>
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                id='outlined-read-only-input'
                label='De'
                defaultValue={'A Cozinha da Sandra'}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                sx={sendEmailClasses.formField}
              />

              <TextField label='Para' type='email' variant='outlined' fullWidth required sx={sendEmailClasses.formField} value={to} onChange={(e) => setTo(e.target.value)} error={toError} />

              <TextField
                label='Assunto'
                type='text'
                variant='outlined'
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
                placeholder='Escreva aqui a sua mensagem...'
                error={messageError}
              />

              {errorMessage && (
                <Typography paragraph sx={{ my: '25px' }} color='error'>
                  {errorMessage}
                </Typography>
              )}

              <button type='submit' ref={submitForm} hidden>
                Enviar
              </button>
            </form>
          </Box>
        </Box>
      )}

      {successMessage && (
        <Typography paragraph sx={{ my: '25px' }}>
          {successMessage}
        </Typography>
      )}

      <div>
        <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
          Voltar
        </Button>

        {!successMessage && (
          <Button type='button' variant='contained' onClick={() => submitForm.current.click()}>
            Enviar
          </Button>
        )}
      </div>
    </Box>
  );
};
