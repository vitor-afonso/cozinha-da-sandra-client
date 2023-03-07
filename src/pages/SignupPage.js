// jshint esversion:9

import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';
import signupImage from '../images/signup.svg';
import { NAVBAR_HEIGHT } from '../utils/app.utils';

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

  const navigate = useNavigate();

  const signupClasses = {
    container: {
      height: `calc(100vh - ${NAVBAR_HEIGHT})`,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      justifyContent: 'center',
      alignItems: 'center',
      py: 5,
    },
    top: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginRight: { md: 4 },
      marginBottom: { md: 6 },
    },
    image: {
      maxWidth: { xs: '200px', md: '450px' },
      order: { xs: 0, md: 1 },
      marginTop: { xs: 4 },
    },
    form: {
      width: { xs: '300px', md: '500px' },
      marginBottom: 4,
    },
    field: {
      marginTop: 0,
      marginBottom: 2,
      display: 'block',
    },
  };

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
          <Typography variant='h4' sx={{ marginTop: { xs: 2 } }} color='#031D44'>
            Registrar
          </Typography>

          <Box>
            <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <Typography sx={{ mb: '3px' }} color='#031D44'>
                Já tens conta?
              </Typography>
              <Button onClick={() => navigate('/login')} size='small'>
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
            type='text'
            variant='outlined'
            fullWidth
            required
            sx={signupClasses.field}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            disabled={isLoading}
          />

          <TextField label='Email' type='email' variant='outlined' fullWidth required sx={signupClasses.field} onChange={(e) => setEmail(e.target.value)} error={emailError} disabled={isLoading} />
          {!isLoading && (
            <Box>
              <TextField
                label='Password'
                type='password'
                variant='outlined'
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
                variant='outlined'
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
            <Typography sx={{ marginBottom: '20px' }} color='error'>
              {errorMessage}
            </Typography>
          )}

          {!isLoading && (
            <Button variant='contained' type='submit'>
              Registrar
            </Button>
          )}
          {isLoading && <CircularProgress size='80px' sx={{ my: 2 }} />}
        </form>
      </Box>
    </Box>
  );
};

export default SignupPage;
