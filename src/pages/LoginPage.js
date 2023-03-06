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
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const loginClasses = {
    container: {
      height: 'calc(100vh - 64px)',
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
      maxWidth: { xs: '250px', md: '450px' },
      transform: 'scaleX(-1)',
      order: { xs: 0, md: 1 },
      marginBottom: { xs: 4 },
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

    setBtnLoading(true);

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
      setBtnLoading(false);
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
          <TextField label='Email' type='email' variant='outlined' fullWidth required sx={loginClasses.field} onChange={(e) => setEmail(e.target.value)} error={emailError} />

          <TextField label='Password' type='password' variant='outlined' fullWidth required sx={loginClasses.field} onChange={(e) => setPassword(e.target.value)} error={passwordError} />

          {errorMessage && (
            <Typography sx={{ marginBottom: '25px' }} color='error'>
              {errorMessage}
            </Typography>
          )}

          {!btnLoading && (
            <Button variant='contained' type='submit'>
              Entrar
            </Button>
          )}

          {btnLoading && <CircularProgress size='20px' />}
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
