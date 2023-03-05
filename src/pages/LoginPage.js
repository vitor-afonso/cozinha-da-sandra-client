// jshint esversion:9

import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { AuthContext } from '../context/auth.context';
import loginImage from '../images/login.svg';

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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 5,
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

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
        <div>
          <Typography variant='h4' sx={{ marginTop: '25px' }} color='#031D44'>
            Login
          </Typography>

          <Box>
            <Box sx={{ display: 'flex', marginTop: '25px', alignItems: 'center' }}>
              <Typography sx={{ mb: '2px' }} color='#031D44'>
                Novo na Cozinha da Sandra?
              </Typography>

              <Button size='small' onClick={() => navigate('/signup')}>
                Registra-te
              </Button>
            </Box>

            <Button size='small' onClick={() => navigate('/forgot')}>
              Esqueceu password?
            </Button>
          </Box>
        </div>
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
            <Typography sx={{ marginBottom: '25px' }} color='error'>
              {errorMessage}
            </Typography>
          )}

          {!isLoading && (
            <Button variant='contained' type='submit'>
              Entrar
            </Button>
          )}

          {isLoading && <CircularProgress size='20px' />}
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
