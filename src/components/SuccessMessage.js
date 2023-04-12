import { Typography } from '@mui/material';
import React from 'react';

const SuccessMessage = ({ message }) => {
  return (
    <Typography paragraph sx={{ my: 4 }}>
      {message}
    </Typography>
  );
};

export default SuccessMessage;
