// jshint esversion:9

import { Box, TextField, Typography, Button, CircularProgress, useTheme } from '@mui/material';
import { useState } from 'react';
import { forgotPassword } from '../api';
import forgotImage from '../images/forgot.svg';
import { componentProps, forgotClasses } from '../utils/app.styleClasses';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const ForgotPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

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

            <Typography variant={componentProps.variant.h4} sx={{ my: 2 }} color={theme.palette.neutral.main}>
              Esqueceu password?
            </Typography>

            <Typography color={theme.palette.neutral.main}>Digite o seu email.</Typography>
          </Box>
          <Box sx={forgotClasses.form}>
            <form noValidate autoComplete='off' onSubmit={handleForgotSubmit}>
              <TextField
                label='Email'
                type={componentProps.type.email}
                variant={componentProps.variant.outlined}
                fullWidth
                required
                sx={forgotClasses.field}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                autoComplete='true'
                autoFocus
              />

              {errorMessage && <ErrorMessage message={errorMessage} />}

              {!isLoading && (
                <Button variant={componentProps.variant.contained} type={componentProps.type.submit} sx={{ mb: 4 }}>
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
          <SuccessMessage message={successMessage} />
        </Box>
      )}
    </Box>
  );
};

export default ForgotPage;
