// jshint esversion:9

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { APP, getMissingAmountForFreeDelivery, handleCustomDeliveryFee, maxDays, minDays } from '../utils/app.utils';

import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, RadioGroup, Switch, TextField, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import TooltipDeliveryFee from './TooltipDeliveryFee';

// When on mobile inputType is not being toggled
// so we check if its mobile or not
const IS_MOBILE = window.innerWidth < 600 ? true : false;

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
  isLoading,
  user,
  calculateCartTotalToShow,
  haveExtraFee,
  setHaveExtraFee,
  customDeliveryFeeError,
  customDeliveryFee,
  setcustomDeliveryFee,
}) => {
  const { cartTotal, orderDeliveryFee, amountForFreeDelivery, hasDeliveryDiscount } = useSelector((store) => store.items);
  const theme = useTheme();
  const [inputType, setInputType] = useState('text');

  const cartFormClasses = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mx: 'auto',
      minWidth: 300,
      maxWidth: 600,
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
      min: new Date(+new Date() + minDays).toISOString().slice(0, -8),
      max: new Date(+new Date() + maxDays).toISOString().slice(0, -8),
    },
  };

  const isElegibleForFreeDelivery = () => {
    return (hasDeliveryDiscount && !haveExtraFee) || (cartTotal > amountForFreeDelivery && deliveryMethod === 'delivery' && !haveExtraFee);
  };

  return (
    <Box sx={isNotVisible ? cartFormClasses.notVisible : null} ref={formRef}>
      <Typography variant='h4' color={theme.palette.neutral.main} sx={{ my: 2 }}>
        Dados de entrega
      </Typography>
      <Box sx={cartFormClasses.form}>
        <form onSubmit={submitOrder} noValidate>
          <TextField label='Telefone' type='text' variant='outlined' fullWidth required sx={cartFormClasses.formField} onChange={(e) => validateContact(e)} error={contactError} value={contact} />

          <TextField
            label='Data & Hora de entrega'
            type={IS_MOBILE ? 'datetime-local' : inputType}
            variant='outlined'
            fullWidth
            required
            sx={cartFormClasses.formField}
            onChange={(e) => setDeliveryDate(e.target.value)}
            onFocus={() => !IS_MOBILE && setInputType('datetime-local')}
            onBlur={() => !IS_MOBILE && !deliveryDate && setInputType('text')}
            error={deliveryDateError}
            value={deliveryDate}
            inputProps={user.userType === 'user' ? cartFormClasses.dateProps : {}}
          />

          <Box sx={{ display: { xs: 'block', md: 'flex' }, mb: 2 }}>
            <FormControl align='left' fullWidth={true} error={deliveryMethodError} sx={{ my: 1 }}>
              <FormLabel id='demo-row-radio-buttons-group-label'>Método de entrega</FormLabel>
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
          {user.userType === 'admin' && haveExtraFee && (
            <TextField
              label='Taxa de entrega'
              type='text'
              variant='outlined'
              fullWidth
              required
              sx={cartFormClasses.formField}
              onChange={(e) => handleCustomDeliveryFee(e.target.value, setcustomDeliveryFee)}
              error={customDeliveryFeeError}
              value={customDeliveryFee}
            />
          )}
          <Box sx={isAddressNotVisible ? cartFormClasses.notVisible : null} ref={orderAddressRef}>
            <Typography variant='h4' color={theme.palette.neutral.main} sx={{ mb: 2 }}>
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
                my: 4,
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

        {deliveryMethod === 'delivery' && (
          <Box sx={{ mb: 2 }}>
            {cartTotal < amountForFreeDelivery && !haveExtraFee && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <Typography variant='body2' color={theme.palette.neutral.main} sx={{ mr: 1, maxWidth: '350px' }}>
                  Entrega grátis a partir de {amountForFreeDelivery + APP.currency}. Valor em falta:{getMissingAmountForFreeDelivery(amountForFreeDelivery, cartTotal) + APP.currency}.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant='h6' color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1, textAlign: 'left' }}>
                Entrega desde:
              </Typography>
              <Typography variant='body1' color={theme.palette.neutral.main} sx={{ textDecoration: isElegibleForFreeDelivery() && 'line-through', mr: 1 }}>
                {haveExtraFee ? customDeliveryFee + APP.currency : orderDeliveryFee + APP.currency}
              </Typography>
              {(isElegibleForFreeDelivery() || !customDeliveryFee) && (
                <Typography variant='body1' color={theme.palette.neutral.main} sx={{ mr: 1 }}>
                  0{APP.currency}
                </Typography>
              )}

              {user.userType === 'user' && <TooltipDeliveryFee />}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant='h4' color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2, fontWeight: 'bold', mr: 1 }}>
                Total:
              </Typography>
              <Typography variant='h4' color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2 }}>
                {calculateCartTotalToShow()}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {!successMessage && !isLoading && (
        <Box>
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>

          <Button type='button' variant='contained' onClick={() => submitBtnRef.current.click()}>
            Encomendar
          </Button>
        </Box>
      )}
      {isLoading && <CircularProgress size='80px' sx={{ mb: 2 }} />}
    </Box>
  );
};
