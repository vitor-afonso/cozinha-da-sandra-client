// jshint esversion:9

import { Box, TextField, Typography, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { forgotPassword } from '../api';
import forgotImage from '../images/forgot.svg';
import { forgotClasses } from '../utils/app.styleClasses';

const ForgotPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(undefined);

    email === '' ? setEmailError(true) : setEmailError(false);

    if (!email.includes('@')) {
      setErrorMessage('Endereço de email inválido.');
      setEmailError(true);
      return;
    }
    setIsLoading(true);
    try {
      const requestBody = { email };

      await forgotPassword(requestBody);

      setSuccessMessage(`Verifique caixa de correio de ${email}, e siga instruções para repor password.`);
    } catch (error) {
      //console.log('forgot error', error);
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
      setIsLoading(false);
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

            <Typography variant='h4' sx={{ my: 2 }} color='#031D44'>
              Esqueceu password?
            </Typography>

            <Typography color='#031D44'>Digite o seu email.</Typography>
          </Box>
          <Box sx={forgotClasses.form}>
            <form noValidate autoComplete='off' onSubmit={handleForgotSubmit}>
              <TextField label='Email' type='email' variant='outlined' fullWidth required sx={forgotClasses.field} onChange={(e) => setEmail(e.target.value)} error={emailError} />

              {errorMessage && (
                <Typography sx={{ marginBottom: 2 }} color='error'>
                  {errorMessage}
                </Typography>
              )}

              {!isLoading && (
                <Button variant='contained' type='submit' sx={{ mb: 4 }}>
                  Recuperar
                </Button>
              )}
              {isLoading && <CircularProgress size='80px' sx={{ my: 2 }} />}
            </form>
          </Box>
        </>
      )}
      {successMessage && (
        <Box sx={forgotClasses.top}>
          <Box sx={forgotClasses.image}>
            <img src={forgotImage} alt='Forgot password' className='auth-images' />
          </Box>
          <Typography sx={{ mt: 4, mx: 3 }}>{successMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ForgotPage;
