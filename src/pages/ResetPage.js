// jshint esversion:9

import { Box, TextField, Typography, Button, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../api';
import resetImage from '../images/reset.svg';
import { resetClasses } from '../utils/app.styleClasses';

const ResetPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    newPassword === '' ? setPasswordError(true) : setPasswordError(false);
    newPassword2 === '' ? setPasswordError(true) : setPasswordError(false);

    if (newPassword !== newPassword2) {
      setErrorMessage('Por favor insira a mesma password nos 2 campos.');
      setPasswordError(true);
      return;
    }

    try {
      const requestBody = { password: newPassword };

      await resetPassword(requestBody, userId);

      setSuccessMessage('A sua password foi actualizada com sucesso.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };
  return (
    <Box sx={resetClasses.container}>
      {!successMessage && (
        <>
          <Box sx={resetClasses.top}>
            <Box sx={resetClasses.image}>
              <img src={resetImage} alt='Reset password' className='auth-images' />
            </Box>

            <Typography variant='h4' sx={{ my: 4 }} color={theme.palette.neutral.main}>
              Repor password
            </Typography>

            <Typography color={theme.palette.neutral.main} sx={{ mb: 4 }}>
              Digite a sua nova password.
            </Typography>
          </Box>
          <Box sx={resetClasses.form}>
            <form noValidate autoComplete='off' onSubmit={handleResetSubmit}>
              <TextField label='Nova Password' type='password' variant='outlined' fullWidth required sx={resetClasses.field} onChange={(e) => setNewPassword(e.target.value)} error={passwordError} />

              <TextField
                label='Repetir Password'
                type='password'
                variant='outlined'
                fullWidth
                required
                sx={resetClasses.field}
                onChange={(e) => setNewPassword2(e.target.value)}
                error={passwordError}
              />

              {errorMessage && (
                <Typography sx={{ marginBottom: '25px' }} color='error'>
                  {errorMessage}
                </Typography>
              )}

              <Button variant='contained' type='submit'>
                Repor
              </Button>
            </form>
          </Box>
        </>
      )}
      {successMessage && (
        <Box sx={resetClasses.top}>
          <Box sx={resetClasses.image}>
            <img src={resetImage} alt='Forgot password' className='auth-images' />
          </Box>
          <Typography sx={{ marginTop: '25px' }}>{successMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResetPage;
