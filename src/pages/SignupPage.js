// jshint esversion:9

import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';
import signupImage from '../images/signup.svg';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const signupClasses = {
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
      marginTop: 0,
      marginBottom: 5,
      display: 'block',
    },
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    username === '' ? setUsernameError(true) : setUsernameError(false);
    email === '' ? setEmailError(true) : setEmailError(false);
    password === '' ? setPasswordError(true) : setPasswordError(false);
    password2 === '' ? setPasswordError(true) : setPasswordError(false);

    if (password !== password2) {
      setErrorMessage('Por favor insira a mesma password nos 2 campos.');
      setPasswordError(true);
      return;
    }

    try {
      const requestBody = { email, password, username };
      await signup(requestBody);
      navigate('/login');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <Box sx={signupClasses.container}>
      <Box sx={signupClasses.top}>
        <Box sx={signupClasses.image}>
          <img src={signupImage} alt='Signup' className='auth-images' />
        </Box>
        <div>
          <Typography variant='h4' sx={{ marginTop: '15px' }}>
            Registrar
          </Typography>
          <p>
            Já tens conta? <br />
            Faz <Link to='/login'>login</Link>.
          </p>
        </div>
      </Box>
      <Box sx={signupClasses.form}>
        <form noValidate autoComplete='off' onSubmit={handleSignupSubmit}>
          <TextField label='Username' type='text' variant='outlined' fullWidth required sx={signupClasses.field} onChange={(e) => setUsername(e.target.value)} error={usernameError} />

          <TextField label='Email' type='email' variant='outlined' fullWidth required sx={signupClasses.field} onChange={(e) => setEmail(e.target.value)} error={emailError} />

          <TextField label='Password' type='password' variant='outlined' fullWidth required sx={signupClasses.field} onChange={(e) => setPassword(e.target.value)} error={passwordError} />

          <TextField label='Repetir Password' type='password' variant='outlined' fullWidth required sx={signupClasses.field} onChange={(e) => setPassword2(e.target.value)} error={passwordError} />

          {errorMessage && (
            <Typography sx={{ marginBottom: '20px' }} color='error'>
              {errorMessage}
            </Typography>
          )}

          <Button variant='contained' type='submit'>
            Registrar
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignupPage;
