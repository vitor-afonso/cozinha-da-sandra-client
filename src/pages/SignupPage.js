// jshint esversion:9

import { Box, Button, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';
import TermsModal from '../components/TermsModal';
import signupImage from '../images/signup.svg';
import { componentProps, signupClasses } from '../utils/app.styleClasses';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(undefined);

    username === '' ? setUsernameError(true) : setUsernameError(false);
    email === '' ? setEmailError(true) : setEmailError(false);
    password === '' ? setPasswordError(true) : setPasswordError(false);
    password2 === '' ? setPasswordError(true) : setPasswordError(false);

    if (password !== password2) {
      setErrorMessage('Por favor insira a mesma password nos 2 campos.');
      setPasswordError(true);
      return;
    }
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
        <form noValidate autoComplete='off' onSubmit={handleSignupSubmit}>
          <TextField
            label='Username'
            type={componentProps.type.text}
            variant={componentProps.variant.outlined}
            fullWidth
            required
            sx={signupClasses.field}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            disabled={isLoading}
            autoComplete='true'
            autoFocus
          />

          <TextField
            label='Email'
            type={componentProps.type.email}
            variant={componentProps.variant.outlined}
            fullWidth
            required
            sx={signupClasses.field}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            disabled={isLoading}
            autoComplete='true'
          />
          {!isLoading && (
            <Box>
              <TextField
                label='Password'
                type='password'
                variant={componentProps.variant.outlined}
                fullWidth
                required
                sx={signupClasses.field}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                disabled={isLoading}
              />

              <TextField
                label='Repetir Password'
                type='password'
                variant={componentProps.variant.outlined}
                fullWidth
                required
                sx={signupClasses.field}
                onChange={(e) => setPassword2(e.target.value)}
                error={passwordError}
                disabled={isLoading}
              />
            </Box>
          )}

          {errorMessage && (
            <Typography sx={{ marginBottom: '20px' }} color={componentProps.color.error}>
              {errorMessage}
            </Typography>
          )}

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
