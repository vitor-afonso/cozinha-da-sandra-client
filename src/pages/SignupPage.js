// jshint esversion:9

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';
import signupImage from '../images/signup.svg';
import { componentProps, signupClasses } from '../utils/app.styleClasses';
import TermsModal from '../components/TermsModal';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import ErrorMessage from '../components/ErrorMessage';

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password2: '',
    },
  });

  const handleSignupSubmit = async ({ username, email, password }) => {
    if (!conditionsAccepted) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = { email, password, username };
      await signup(requestBody);
      navigate('/login');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={signupClasses.container}>
      <Box sx={signupClasses.top}>
        <Box sx={signupClasses.image}>
          <img src={signupImage} alt='Signup' className='auth-images' />
        </Box>

        <Box sx={{ alignSelf: { md: 'start' }, ml: { md: 6 } }}>
          <Typography variant={componentProps.variant.h4} sx={{ marginTop: { xs: 2 } }} color={theme.palette.neutral.main}>
            Registrar
          </Typography>

          <Box>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ mb: 0.3 }} color={theme.palette.neutral.main}>
                Já tens conta?
              </Typography>
              <Button onClick={() => navigate('/login')} size={componentProps.size.small}>
                Faz Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={signupClasses.form}>
        <form noValidate onSubmit={handleSubmit(handleSignupSubmit)}>
          <Controller
            name='username'
            control={control}
            rules={{ required: 'Username em falta' }}
            render={({ field }) => (
              <TextField
                label='Username'
                type={componentProps.type.text}
                variant={componentProps.variant.outlined}
                fullWidth
                sx={signupClasses.field}
                error={errors.username ? true : false}
                disabled={isLoading}
                autoComplete='true'
                autoFocus
                {...field}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Endereço de email em falta',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Endereço de email invalido',
              },
            }}
            render={({ field }) => (
              <TextField
                label='Email'
                type={componentProps.type.email}
                variant={componentProps.variant.outlined}
                fullWidth
                sx={signupClasses.field}
                error={errors.email ? true : false}
                disabled={isLoading}
                autoComplete='true'
                {...field}
              />
            )}
          />

          {!isLoading && (
            <Box>
              <Controller
                name={componentProps.type.password}
                control={control}
                rules={{
                  required: 'Password em falta',
                  pattern: {
                    value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
                    message: 'A password deve ter pelo menos 6 caracteres e conter pelo menos um número, uma letra minúscula e uma letra maiúscula.',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label='Password'
                    type={componentProps.type.password}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={signupClasses.field}
                    error={errors.password ? true : false}
                    disabled={isLoading}
                    {...field}
                  />
                )}
              />
              <Controller
                name='password2'
                control={control}
                rules={{ required: 'Password em falta', validate: (value) => value === control._fields.password._f.value || 'Insira a mesma password nos 2 campos' }}
                render={({ field }) => (
                  <TextField
                    label='Repetir Password'
                    type={componentProps.type.password}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={signupClasses.field}
                    error={errors.password2 ? true : false}
                    disabled={isLoading}
                    {...field}
                  />
                )}
              />
            </Box>
          )}

          {errorMessage && <ErrorMessage message={errorMessage} />}
          {errors.username && <ErrorMessage message={errors.username.message} />}
          {errors.email && <ErrorMessage message={errors.email.message} />}
          {errors.password && <ErrorMessage message={errors.password.message} />}
          {errors.password2 && <ErrorMessage message={errors.password2.message} />}

          {!isLoading && (
            <Button type={componentProps.type.submit} variant={componentProps.variant.contained}>
              Registrar
            </Button>
          )}
          {isLoading && <CircularProgress size='80px' sx={{ my: 2 }} />}
        </form>
      </Box>
      <TermsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} conditionsAccepted={conditionsAccepted} setConditionsAccepted={setConditionsAccepted} />
    </Box>
  );
};

export default SignupPage;
