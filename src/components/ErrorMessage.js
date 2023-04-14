import React from 'react';
import { componentProps } from '../utils/app.styleClasses';
import { Typography } from '@mui/material';

const ErrorMessage = ({ message }) => {
  return (
    <Typography sx={{ marginBottom: 4 }} color={componentProps.color.error}>
      {message}
    </Typography>
  );
};

export default ErrorMessage;
