import { Typography } from '@mui/material';

const SuccessMessage = ({ message }) => {
  return (
    <Typography paragraph sx={{ my: 4, maxWidth: '600px', mx: 'auto' }}>
      {message}
    </Typography>
  );
};

export default SuccessMessage;
