// jshint esversion:9

import { Box, TextField, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api';
import forgotImage from '../images/forgot.svg';

export const ForgotPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const forgotClasses = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '25px',
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

    try {
      const requestBody = { email };

      await forgotPassword(requestBody);

      setSuccessMessage(`Verifique caixa de correio de ${email}, e siga instruções para repor password.`);
    } catch (error) {
      console.log('forgot error', error);
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
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

            <Typography variant='h4' sx={{ marginTop: '25px' }}>
              Esqueceu password
            </Typography>
            <Typography variant='p' sx={{ marginTop: '25px' }}>
              Por favor digite o seu email.
            </Typography>
          </Box>
          <Box sx={forgotClasses.form}>
            <form noValidate autoComplete='off' onSubmit={handleForgotSubmit}>
              <TextField label='Email' type='email' variant='outlined' fullWidth required sx={forgotClasses.field} onChange={(e) => setEmail(e.target.value)} error={emailError} />

              {errorMessage && (
                <Typography sx={{ marginBottom: '25px' }} color='error'>
                  {errorMessage}
                </Typography>
              )}

              <Button variant='contained' type='submit'>
                Recuperar
              </Button>
            </form>
          </Box>
        </>
      )}
      {successMessage && <p>{successMessage}</p>}
    </Box>
  );
};
