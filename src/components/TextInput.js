import { TextField } from '@mui/material';
import React from 'react';
import { componentProps } from '../utils/app.styleClasses';

const TextInput = ({ label, variant, error, value, handleChange, autoComplete, style }) => {
  return <TextField label={label} type={componentProps.type.text} variant={variant} fullWidth required onChange={handleChange} error={error} value={value} autoComplete={autoComplete} sx={style} />;
};

export default TextInput;