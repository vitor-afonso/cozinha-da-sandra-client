import { useContext, useState } from 'react';
import { AuthContext } from '../context/auth.context';

import { Box, FormControl, FormControlLabel, FormLabel, RadioGroup, Switch, TextField, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import { handleCustomDeliveryFee, maxDays, minDays } from '../utils/app.utils';

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
  deliveryDateError,
  customDeliveryFeeError,
  customDeliveryFee,
  setCustomDeliveryFee,
  addressError,
  haveExtraFee,
  setHaveExtraFee,
}) {
  const { user } = useContext(AuthContext);
  const [inputType, setInputType] = useState('datetime-local');

  const editOrderClasses = {
    formContainer: {
      marginTop: 0,
      marginBottom: 1,
    },
    form: {
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: 300,
      maxWidth: 600,
    },
    formField: {
      marginTop: 0,
      marginBottom: 2,
      display: 'block',
    },
    formTextArea: {
      minWidth: '100%',
    },
    datePropsUser: {
      min: new Date(+new Date() + minDays).toISOString().slice(0, -8),
      max: new Date(+new Date() + maxDays).toISOString().slice(0, -8),
    },
    datePropsAdmin: {
      min: new Date().toISOString().slice(0, -8),
    },
  };

  return (
    <Box sx={editOrderClasses.formContainer}>
      <Box sx={editOrderClasses.form}>
        <form onSubmit={handleSubmit} noValidate>
          <TextField label='Telefone' type='text' variant='outlined' fullWidth required sx={editOrderClasses.formField} onChange={(e) => validateContact(e)} error={contactError} value={contact} />

          <TextField
            label='Data & Hora de entrega'
            type={inputType}
            variant='outlined'
            fullWidth
            required
            sx={editOrderClasses.formField}
            onChange={(e) => setDeliveryDate(e.target.value)}
            error={deliveryDateError}
            value={deliveryDate}
            inputProps={user.userType === 'user' ? editOrderClasses.datePropsUser : editOrderClasses.datePropsAdmin}
            onFocus={() => setInputType('datetime-local')}
            onBlur={() => !deliveryDate && setInputType('text')}
          />
          <Box sx={{ display: { xs: 'block', md: 'flex' }, mb: 2 }}>
            <FormControl align='left' fullWidth={true}>
              <FormLabel id='demo-row-radio-buttons-group-label'>Metodo de entrega</FormLabel>
              <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group' onChange={handleRadioClick}>
                <FormControlLabel value='delivery' control={<Radio />} label='Entrega' checked={deliveryMethod === 'delivery'} />
                <FormControlLabel value='takeAway' control={<Radio />} label='Take Away' checked={deliveryMethod === 'takeAway'} />
              </RadioGroup>
            </FormControl>

            {deliveryMethod === 'delivery' && user.userType === 'admin' && (
              <FormControlLabel
                control={<Switch checked={haveExtraFee} onChange={() => setHaveExtraFee(!haveExtraFee)} inputProps={{ 'aria-label': 'controlled' }} />}
                label='Definir taxa de entrega'
                sx={{ width: '100%', pt: { xs: 0, md: 3 } }}
              />
            )}
          </Box>
          {!isAddressNotVisible && (
            <>
              {user.userType === 'admin' && haveExtraFee && (
                <TextField
                  label='Taxa de entrega'
                  type='text'
                  variant='outlined'
                  fullWidth
                  required
                  sx={editOrderClasses.formField}
                  onChange={(e) => handleCustomDeliveryFee(e.target.value, setCustomDeliveryFee)}
                  error={customDeliveryFeeError}
                  value={customDeliveryFee}
                />
              )}
              <TextField
                label='Morada'
                type='text'
                variant='outlined'
                fullWidth
                required={requiredInput}
                sx={editOrderClasses.formField}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder='Rua dos bolos n 7'
                error={addressError}
                value={fullAddress}
                ref={addressRef}
              />
            </>
          )}

          <TextField label='Mensagem' value={message} sx={editOrderClasses.formTextArea} multiline maxRows={4} onChange={(e) => setMessage(e.target.value)} placeholder='Escreva aqui a sua mensagem' />

          {errorMessage && (
            <Typography
              paragraph
              sx={{
                my: 4,
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
