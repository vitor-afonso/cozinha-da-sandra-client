// jshint esversion:9

import { Box, TextField, Typography, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { forgotPassword } from '../api';
import forgotImage from '../images/forgot.svg';

const ForgotPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const forgotClasses = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 5,
      //outline: '1px solid red',
    },
    top: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    image: {
      maxWidth: { xs: '250px', md: '450px' },
    },
    form: {
      width: { xs: '300px', md: '500px' },
    },
    field: {
      marginTop: 5,
      marginBottom: 5,
      display: 'block',
    },
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    email === '' ? setEmailError(true) : setEmailError(false);

    if (!email.includes('@')) {
      setErrorMessage('Endereço de email inválido.');
      setEmailError(true);
      return;
    }
    setBtnLoading(true);
    try {
      const requestBody = { email };

      await forgotPassword(requestBody);

      setSuccessMessage(`Verifique caixa de correio de ${email}, e siga instruções para repor password.`);
    } catch (error) {
      //console.log('forgot error', error);
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
      setBtnLoading(false);
    }
  };
  return (
    <Box sx={forgotClasses.container}>
      {!successMessage && (
        <>
          <Box sx={forgotClasses.top}>
            <Box sx={forgotClasses.image}>
              <img src={forgotImage} alt='Forgot password' className='auth-images' />
            </Box>

            <Typography variant='h4' sx={{ my: 4 }} color='#031D44'>
              Esqueceu password?
            </Typography>

            <Typography color='#031D44'>Digite o seu email.</Typography>
          </Box>
          <Box sx={forgotClasses.form}>
            <form noValidate autoComplete='off' onSubmit={handleForgotSubmit}>
              <TextField label='Email' type='email' variant='outlined' fullWidth required sx={forgotClasses.field} onChange={(e) => setEmail(e.target.value)} error={emailError} />

              {errorMessage && (
                <Typography sx={{ marginBottom: '25px' }} color='error'>
                  {errorMessage}
                </Typography>
              )}

              {!btnLoading && (
                <Button variant='contained' type='submit'>
                  Recuperar
                </Button>
              )}
              {btnLoading && <CircularProgress size='20px' />}
            </form>
          </Box>
        </>
      )}
      {successMessage && (
        <Box sx={forgotClasses.top}>
          <Box sx={forgotClasses.image}>
            <img src={forgotImage} alt='Forgot password' className='auth-images' />
          </Box>
          <Typography sx={{ mt: '25px', mx: 3 }}>{successMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPage;
