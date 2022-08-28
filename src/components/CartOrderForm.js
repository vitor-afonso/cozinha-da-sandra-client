// jshint esversion:9
import ms from 'ms';

import { Input, Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';

export const CartOrderForm = ({
  formRef,
  orderAddressRef,
  isNotVisible,
  submitOrder,
  contact,
  validateContact,
  deliveryDate,
  setDeliveryDate,
  deliveryMethod,
  handleRadioClick,
  isAddressNotVisible,
  requiredInput,
  addressStreet,
  setAddressStreet,
  addressCode,
  validateAddressCode,
  addressCity,
  setAddressCity,
  message,
  setMessage,
  errorMessage,
  navigate,
  contactError,
  deliveryDateError,
  deliveryMethodError,
  addressStreetError,
  addressCodeError,
  addressCityError,
  submitBtnRef,
  successMessage,
  btnLoading,
}) => {
  // ms converts days to milliseconds
  // then i can use it to define the date that the user can book
  const minDay = ms('2d');
  const maxDay = ms('60d');

  const cartFormClasses = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mx: 'auto',
      minWidth: 300,
      maxWidth: 600,
      //outline: '1px solid red',
    },
    formField: {
      marginTop: 0,
      marginBottom: 2,
    },
    formTextArea: {
      minWidth: '100%',
      marginBottom: 5,
    },
    notVisible: {
      display: 'none',
    },
    dateProps: {
      min: new Date(+new Date() + minDay).toISOString().slice(0, -8),
      max: new Date(+new Date() + maxDay).toISOString().slice(0, -8),
    },
  };

  return (
    <Box sx={isNotVisible ? cartFormClasses.notVisible : null} ref={formRef}>
      <Typography variant='h4' color='#031D44' sx={{ my: 2 }}>
        Dados de entrega
      </Typography>
      <Box sx={cartFormClasses.form}>
        <form onSubmit={submitOrder} noValidate>
          <TextField label='Telefone' type='text' variant='outlined' fullWidth required sx={cartFormClasses.formField} onChange={(e) => validateContact(e)} error={contactError} value={contact} />

          {/* <TextField
            label='Data & Hora de entrega'
            type='datetime-local'
            variant='outlined'
            fullWidth
            required
            sx={cartFormClasses.formField}
            onChange={(e) => setDeliveryDate(e.target.value)}
            error={deliveryDateError}
            value={deliveryDate}
            inputProps={cartFormClasses.dateProps}
          /> */}

          <Input type='datetime-local' onChange={(e) => setDeliveryDate(e.target.value)} inputProps={cartFormClasses.dateProps} />

          <FormControl align='left' fullWidth={true} error={deliveryMethodError} sx={{ my: 1 }}>
            <FormLabel id='demo-row-radio-buttons-group-label'>Metodo de entrega</FormLabel>
            <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group' onChange={handleRadioClick}>
              <FormControlLabel value='delivery' control={<Radio />} label='Entrega' checked={deliveryMethod === 'delivery'} />
              <FormControlLabel value='takeAway' control={<Radio />} label='Take Away' checked={deliveryMethod === 'takeAway'} />
            </RadioGroup>
          </FormControl>

          <Box sx={isAddressNotVisible ? cartFormClasses.notVisible : null} ref={orderAddressRef}>
            <Typography variant='h4' color='#031D44' sx={{ mb: 2 }}>
              Morada
            </Typography>
            <TextField
              label='Rua'
              type='text'
              variant='outlined'
              fullWidth
              required={requiredInput}
              sx={cartFormClasses.formField}
              onChange={(e) => setAddressStreet(e.target.value)}
              placeholder='Rua dos bolos n 7'
              error={addressStreetError}
              value={addressStreet}
            />

            <TextField
              label='Código Postal'
              type='text'
              variant='outlined'
              fullWidth
              required={requiredInput}
              sx={cartFormClasses.formField}
              onChange={validateAddressCode}
              placeholder='8800-123'
              error={addressCodeError}
              value={addressCode}
            />

            <TextField
              label='Cidade'
              type='text'
              variant='outlined'
              fullWidth
              required={requiredInput}
              sx={cartFormClasses.formField}
              onChange={(e) => setAddressCity(e.target.value)}
              placeholder='Tavira'
              error={addressCityError}
              value={addressCity}
            />
          </Box>

          <TextField
            id='outlined-multiline-flexible'
            label='Mensagem'
            multiline
            maxRows={4}
            sx={cartFormClasses.formTextArea}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder='Escreva aqui a sua mensagem...'
          />

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

          <button type='submit' ref={submitBtnRef} hidden>
            Encomendar
          </button>
        </form>
      </Box>

      {!successMessage && !btnLoading && (
        <Box>
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>

          <Button type='button' variant='contained' onClick={() => submitBtnRef.current.click()}>
            Encomendar
          </Button>
        </Box>
      )}
      {btnLoading && <CircularProgress size='20px' />}
    </Box>
  );
};
