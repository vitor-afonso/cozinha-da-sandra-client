// jshint esversion:9

import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { AuthContext } from '../context/auth.context';
import loginImage from '../images/login.svg';
import { APP } from '../utils/app.utils';

const LoginPage = () => {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginClasses = {
    container: {
      height: `calc(100vh - ${APP.navbarHeight})`,
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
    },
    image: {
      maxWidth: { xs: '200px', md: '450px' },
      transform: 'scaleX(-1)',
      order: { xs: 0, md: 1 },
      marginBottom: { xs: 4 },
      marginTop: { xs: 4 },
    },
    form: {
      width: { xs: '300px', md: '500px' },
    },
    field: {
      marginTop: 2,
      marginBottom: 2,
      display: 'block',
    },
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(undefined);

    email === '' ? setEmailError(true) : setEmailError(false);
    password === '' ? setPasswordError(true) : setPasswordError(false);

    setIsLoading(true);

    try {
      const requestBody = { email, password };

      let response = await login(requestBody);

      // console.log('JWT token', response.data.authToken);

      storeToken(response.data.authToken);

      // Verify the token by sending a request
      // to the server's JWT validation endpoint.
      authenticateUser();

      navigate('/');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
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
          <Typography variant='h4' color='#031D44'>
            Login
          </Typography>

          <Box sx={{ marginBottom: { md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mb: '2px' }} color='#031D44'>
                Ainda não tens conta?
              </Typography>

              <Button size='small' onClick={() => navigate('/signup')}>
                Registra-te
              </Button>
            </Box>

            <Button size='small' onClick={() => navigate('/forgot')}>
              Recuperar password
            </Button>
          </Box>
        </Box>
      </Box>
      <Box sx={loginClasses.form}>
        <form noValidate autoComplete='off' onSubmit={handleLoginSubmit}>
          <TextField label='Email' type='email' variant='outlined' fullWidth required sx={loginClasses.field} onChange={(e) => setEmail(e.target.value)} error={emailError} disabled={isLoading} />

          <TextField
            label='Password'
            type='password'
            variant='outlined'
            fullWidth
            required
            sx={loginClasses.field}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            disabled={isLoading}
          />

          {errorMessage && (
            <Typography color='error' sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {!isLoading && (
            <Button variant='contained' type='submit'>
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
