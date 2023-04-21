import { Typography } from '@mui/material';
import React from 'react';

const SuccessMessage = ({ message }) => {
  return (
    <Typography paragraph sx={{ my: 4, maxWidth: '600px', mx: 'auto' }}>
      {message}
    </Typography>
  );
};

export default SuccessMessage;
