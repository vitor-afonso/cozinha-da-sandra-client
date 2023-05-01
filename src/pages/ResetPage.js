// jshint esversion:9

import { Box, TextField, Typography, Button, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from 'api';
import resetImage from 'images/reset.svg';
import { componentProps, resetClasses } from 'utils/app.styleClasses';
import ErrorMessage from 'components/ErrorMessage';
import SuccessMessage from 'components/SuccessMessage';
import { Controller, useForm } from 'react-hook-form';

const ResetPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password2: '',
    },
  });
  const password = watch('password');

  const handleResetSubmit = async ({ password }) => {
    setIsLoading(true);
    try {
      const requestBody = { password };
      await resetPassword(requestBody, userId);
      setSuccessMessage('Password actualizada com sucesso.');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={resetClasses.container}>
      <Box sx={resetClasses.image}>
        <img src={resetImage} alt='Reset password' className='auth-images' />
      </Box>
      {!successMessage && (
        <Box>
          <Box sx={resetClasses.topText}>
            <Typography variant={componentProps.variant.h4} sx={{ my: 2 }} color={theme.palette.neutral.main}>
              Repor password
            </Typography>

            <Typography color={theme.palette.neutral.main} sx={{ mb: 4 }}>
              Digite a sua nova password.
            </Typography>
          </Box>
          <Box sx={resetClasses.form}>
            <form noValidate onSubmit={handleSubmit(handleResetSubmit)}>
              <Controller
                name={componentProps.name.password}
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
                    label='Nova password'
                    type={componentProps.type.password}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={resetClasses.field}
                    error={errors.password ? true : false}
                    disabled={isLoading}
                    autoComplete='true'
                    {...field}
                  />
                )}
              />
              <Controller
                name={componentProps.name.password2}
                control={control}
                rules={{ required: 'Password em falta', validate: (value) => value === password || 'Insira a mesma password nos 2 campos' }}
                render={({ field }) => (
                  <TextField
                    label='Repetir Password'
                    type={componentProps.type.password}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={resetClasses.field}
                    error={errors.password2 ? true : false}
                    disabled={isLoading}
                    autoComplete='true'
                    {...field}
                  />
                )}
              />

              {errorMessage && <ErrorMessage message={errorMessage} />}
              {errors.password && <ErrorMessage message={errors.password.message} />}
              {errors.password2 && <ErrorMessage message={errors.password2.message} />}

              {!isLoading && (
                <Button variant={componentProps.variant.contained} type={componentProps.type.submit}>
                  Repor
                </Button>
              )}
            </form>
          </Box>
        </Box>
      )}
      {successMessage && (
        <Box sx={resetClasses.top}>
          <SuccessMessage message={successMessage} />
          <Button onClick={() => navigate('/login')}>Entrar</Button>
        </Box>
      )}
    </Box>
  );
};

export default ResetPage;
