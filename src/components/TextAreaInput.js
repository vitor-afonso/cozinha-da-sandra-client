import { TextField } from '@mui/material';
import React from 'react';

const TextAreaInput = ({ label, maxRows, style, handleChange, value, required, placeholder, error }) => {
  return <TextField label={label} multiline maxRows={maxRows} sx={style} onChange={handleChange} value={value} required={required} placeholder={placeholder} error={error} />;
};

export default TextAreaInput;
