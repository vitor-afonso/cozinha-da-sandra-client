// jshint esversion:9

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { login } from 'api';
import { AuthContext } from 'context/auth.context';
import loginImage from 'images/login.svg';
import { componentProps, loginClasses } from 'utils/app.styleClasses';
import ErrorMessage from 'components/ErrorMessage';
import { Box, Button, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';

const LoginPage = () => {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginSubmit = async ({ email, password }) => {
    setErrorMessage(undefined);
    setIsLoading(true);

    try {
      let response = await login({ email, password });

      storeToken(response.data.authToken);

      // Verify the token by sending a request
      // to the server's JWT validation endpoint.
      await authenticateUser();

      navigate(orderId ? `/reviews/create/${orderId}` : '/');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={loginClasses.container}>
      <Box sx={loginClasses.top}>
        <Box sx={loginClasses.image}>
          <img src={loginImage} alt='Login' className='auth-images' />
        </Box>
        <Box sx={{ alignSelf: { xs: 'start' } }}>
          <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main}>
            Login
          </Typography>

          <Box sx={{ marginBottom: { md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mb: 0.3 }} color={theme.palette.neutral.main}>
                Ainda não tens conta?
              </Typography>

              <Button size={componentProps.size.small} onClick={() => navigate('/signup')}>
                Registra-te
              </Button>
            </Box>

            <Button size={componentProps.size.small} onClick={() => navigate('/forgot')}>
              Recuperar password
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={loginClasses.form}>
        <form noValidate onSubmit={handleSubmit(handleLoginSubmit)}>
          <Controller
            name={componentProps.name.email}
            control={control}
            rules={{
              required: 'Endereço de email em falta',
            }}
            render={({ field }) => (
              <TextField
                label='Email'
                type={componentProps.type.email}
                variant={componentProps.variant.outlined}
                fullWidth
                sx={loginClasses.field}
                error={errors.email ? true : false}
                disabled={isLoading}
                autoComplete='true'
                {...field}
              />
            )}
          />

          <Controller
            name={componentProps.name.password}
            control={control}
            rules={{
              required: 'Password em falta',
            }}
            render={({ field }) => (
              <TextField
                label='Password'
                type={componentProps.type.password}
                variant={componentProps.variant.outlined}
                fullWidth
                sx={loginClasses.field}
                error={errors.password ? true : false}
                disabled={isLoading}
                {...field}
              />
            )}
          />

          {errorMessage && <ErrorMessage message={errorMessage} />}
          {errors.email && <ErrorMessage message={errors.email.message} />}
          {errors.password && <ErrorMessage message={errors.password.message} />}

          {!isLoading && (
            <Button variant={componentProps.variant.contained} type={componentProps.type.submit}>
              Entrar
            </Button>
          )}

          {isLoading && <CircularProgress size='80px' sx={{ my: 2 }} />}
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
