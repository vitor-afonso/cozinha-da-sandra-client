// jshint esversion:9

import { Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { AuthContext } from '../context/auth.context';
import loginImage from '../images/login.svg';

export const LoginPage = () => {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const loginClasses = {
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    email === '' ? setEmailError(true) : setEmailError(false);
    password === '' ? setPasswordError(true) : setPasswordError(false);

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
    }
  };

  return (
    <Box sx={loginClasses.container}>
      <Box sx={loginClasses.top}>
        <Box sx={loginClasses.image}>
          <img src={loginImage} alt='Login' className='auth-images' />
        </Box>
        <div>
          <Typography variant='h4' sx={{ marginTop: '25px' }}>
            Login
          </Typography>
          <p>
            Novo na Cozinha da Sandra?
            <Link to='/signup'> Registra-te </Link>
            <br />
            <small>
              <Link to='/forgot'>Esqueceu password?</Link>
            </small>
          </p>
        </div>
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

          <Button variant='contained' type='submit'>
            Entrar
          </Button>
        </form>
      </Box>
    </Box>
  );
};
