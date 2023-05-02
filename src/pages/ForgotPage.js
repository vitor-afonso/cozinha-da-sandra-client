// jshint esversion:9

import { useState } from 'react';
import { Box, TextField, Typography, Button, CircularProgress, useTheme } from '@mui/material';
import { forgotPassword } from 'api';
import forgotImage from 'images/forgot.svg';
import { componentProps, forgotClasses } from 'utils/app.styleClasses';
import ErrorMessage from 'components/ErrorMessage';
import SuccessMessage from 'components/SuccessMessage';
import { Controller, useForm } from 'react-hook-form';
import { appRegex } from 'utils/app.utils';

const ForgotPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const handleForgotSubmit = async ({ email }) => {
    setErrorMessage(undefined);
    setIsLoading(true);
    try {
      const requestBody = { email };
      await forgotPassword(requestBody);
      setSuccessMessage(`Verifique a caixa de correio de ${email}, e siga instruções para repor password.`);
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={forgotClasses.container}>
      <Box sx={forgotClasses.image}>
        <img src={forgotImage} alt='Forgot password' className='auth-images' />
      </Box>
      {!successMessage && (
        <>
          <Box sx={forgotClasses.top}>
            <Typography variant={componentProps.variant.h4} sx={{ my: 2 }} color={theme.palette.neutral.main}>
              Esqueceu password?
            </Typography>

            <Typography color={theme.palette.neutral.main}>Digite o seu email.</Typography>
          </Box>
          <Box sx={forgotClasses.form}>
            <form noValidate onSubmit={handleSubmit(handleForgotSubmit)}>
              <Controller
                name={componentProps.name.email}
                control={control}
                rules={{
                  required: 'Endereço de email em falta',
                  pattern: {
                    value: appRegex.email,
                    message: 'Endereço de email invalido',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label='Email'
                    type={componentProps.type.email}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={forgotClasses.field}
                    error={errors.email ? true : false}
                    disabled={isLoading}
                    autoComplete='true'
                    {...field}
                  />
                )}
              />

              {errorMessage && <ErrorMessage message={errorMessage} />}
              {errors.email && <ErrorMessage message={errors.email.message} />}

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
          <SuccessMessage message={successMessage} />
        </Box>
      )}
    </Box>
  );
};

export default ForgotPage;
