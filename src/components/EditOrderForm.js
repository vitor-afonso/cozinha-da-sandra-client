import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

import { Box, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';

export function EditOrderForm({
  handleSubmit,
  validateContact,
  contactError,
  contact,
  setDeliveryDate,
  deliveryDate,
  handleRadioClick,
  deliveryMethod,
  isAddressNotVisible,
  requiredInput,
  setFullAddress,
  fullAddress,
  addressRef,
  message,
  setMessage,
  errorMessage,
  submitForm,
  order,
  deliveryDateError,
}) {
  const { user } = useContext(AuthContext);

  const editOrderClasses = {
    formContainer: {
      marginTop: 0,
      marginBottom: 5,
    },
    form: {
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: 300,
      maxWidth: 600,
    },
    formField: {
      marginTop: 0,
      marginBottom: 5,
      display: 'block',
    },
    formTextArea: {
      minWidth: '100%',
    },
    dateProps: {
      min: new Date().toISOString().slice(0, -8),
    },
  };
  return (
    <Box sx={editOrderClasses.formContainer}>
      <Box sx={editOrderClasses.form}>
        <form onSubmit={handleSubmit}>
          <TextField label='Contacto' type='text' variant='outlined' fullWidth required sx={editOrderClasses.formField} onChange={(e) => validateContact(e)} error={contactError} value={contact} />

          <TextField
            label='Data & Hora de entrega'
            type='datetime-local'
            variant='outlined'
            fullWidth
            required
            sx={editOrderClasses.formField}
            onChange={(e) => setDeliveryDate(e.target.value)}
            error={deliveryDateError}
            value={deliveryDate}
            inputProps={editOrderClasses.dateProps}
          />

          <FormControl
            sx={{
              mb: 5,
            }}
            align='left'
            fullWidth={true}
          >
            <FormLabel id='demo-row-radio-buttons-group-label'>Metodo de entrega</FormLabel>
            <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group' onChange={handleRadioClick}>
              <FormControlLabel value='delivery' control={<Radio />} label='Entrega' checked={deliveryMethod === 'delivery'} />
              <FormControlLabel value='takeAway' control={<Radio />} label='Take Away' checked={deliveryMethod === 'takeAway'} />
            </RadioGroup>
          </FormControl>

          {!isAddressNotVisible && (
            <TextField
              label='Morada'
              type='text'
              variant='outlined'
              fullWidth
              required={requiredInput}
              sx={editOrderClasses.formField}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder='Rua dos bolos n 7'
              error={contactError}
              value={fullAddress}
              ref={addressRef}
            />
          )}

          {user._id !== order.userId._id && (
            <TextField
              id='outlined-read-only-input'
              label='Mensagem'
              defaultValue={message}
              InputProps={{
                readOnly: true,
              }}
              sx={editOrderClasses.formTextArea}
              multiline
              maxRows={4}
            />
          )}

          {user._id === order.userId._id && (
            <TextField
              id='outlined-multiline-flexible'
              label='Mensagem'
              multiline
              maxRows={4}
              sx={editOrderClasses.formTextArea}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder='Escreva aqui a sua mensagem...'
            />
          )}

          {errorMessage && (
            <Typography
              paragraph
              sx={{
                my: '25px',
              }}
              color='error'
            >
              {errorMessage}
            </Typography>
          )}

          <button type='submit' ref={submitForm} hidden>
            Actualizar
          </button>
        </form>
      </Box>
    </Box>
  );
}
