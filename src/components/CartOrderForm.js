// jshint esversion:9

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { APP, getMissingAmountForFreeDelivery, handleCustomDeliveryFee } from '../utils/app.utils';

import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, RadioGroup, Switch, TextField, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import TooltipDeliveryFee from './TooltipDeliveryFee';
import { cartFormClasses, componentProps } from '../utils/app.styleClasses';
import ErrorMessage from './ErrorMessage';

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
  setCustomDeliveryFee,
}) => {
  const { cartTotal, orderDeliveryFee, amountForFreeDelivery, globalDeliveryDiscount } = useSelector((store) => store.items);
  const theme = useTheme();
  const [inputType, setInputType] = useState('text');

  const isElegibleForFreeDelivery = () => {
    return (globalDeliveryDiscount || (cartTotal > amountForFreeDelivery && deliveryMethod === 'delivery')) && !haveExtraFee;
  };

  return (
    <Box sx={isNotVisible ? cartFormClasses.notVisible : null} ref={formRef}>
      <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ my: 2 }}>
        Dados de entrega
      </Typography>
      <Box sx={cartFormClasses.form}>
        <form onSubmit={submitOrder} noValidate style={cartFormClasses.innerForm}>
          <TextField
            label='Telefone'
            type={componentProps.type.text}
            variant={componentProps.variant.outlined}
            fullWidth
            required
            sx={cartFormClasses.formField}
            onChange={validateContact}
            error={contactError}
            value={contact}
            autoComplete='true'
            autoFocus
          />

          <TextField
            label='Data & Hora de entrega'
            type={IS_MOBILE ? 'datetime-local' : inputType}
            variant={componentProps.variant.outlined}
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
                control={<Switch checked={haveExtraFee} onChange={() => setHaveExtraFee(!haveExtraFee)} />}
                label='Definir taxa de entrega'
                sx={{ width: '100%', pt: { xs: 0, md: 3 } }}
              />
            )}
          </Box>
          {user.userType === 'admin' && haveExtraFee && (
            <TextField
              label='Taxa de entrega'
              type={componentProps.type.text}
              variant={componentProps.variant.outlined}
              fullWidth
              required
              sx={cartFormClasses.formField}
              onChange={(e) => handleCustomDeliveryFee(e.target.value, setCustomDeliveryFee)}
              error={customDeliveryFeeError}
              value={customDeliveryFee}
              inputProps={{ maxLength: 6 }}
              autoFocus
            />
          )}
          <Box sx={isAddressNotVisible ? cartFormClasses.notVisible : null} ref={orderAddressRef}>
            <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ mb: 2 }}>
              Morada
            </Typography>
            <TextField
              label='Rua'
              type={componentProps.type.text}
              variant={componentProps.variant.outlined}
              fullWidth
              required={requiredInput}
              sx={cartFormClasses.formField}
              onChange={(e) => setAddressStreet(e.target.value)}
              placeholder='Rua dos bolos n 7'
              error={addressStreetError}
              value={addressStreet}
              autoComplete='true'
            />

            <TextField
              label='Código Postal'
              type={componentProps.type.text}
              variant={componentProps.variant.outlined}
              fullWidth
              required={requiredInput}
              sx={cartFormClasses.formField}
              onChange={validateAddressCode}
              placeholder='8800-123'
              error={addressCodeError}
              value={addressCode}
              autoComplete='true'
            />

            <TextField
              label='Cidade'
              type={componentProps.type.text}
              variant={componentProps.variant.outlined}
              fullWidth
              required={requiredInput}
              sx={cartFormClasses.formField}
              onChange={(e) => setAddressCity(e.target.value)}
              placeholder='Tavira'
              error={addressCityError}
              value={addressCity}
              autoComplete='true'
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

          {errorMessage && <ErrorMessage message={errorMessage} />}

          <button type={componentProps.type.submit} ref={submitBtnRef} hidden>
            Encomendar
          </button>
        </form>

        {deliveryMethod === 'delivery' && (
          <Box sx={{ mb: 2 }}>
            {isElegibleForFreeDelivery() && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <Typography variant={componentProps.variant.body2} color={theme.palette.neutral.main} sx={{ mr: 1, maxWidth: '350px' }}>
                  Entrega grátis a partir de {amountForFreeDelivery + APP.currency}. Valor em falta:{getMissingAmountForFreeDelivery(amountForFreeDelivery, cartTotal) + APP.currency}.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant={componentProps.variant.h6} color={theme.palette.neutral.main} sx={{ fontWeight: 'bold', mr: 1, textAlign: 'left' }}>
                Entrega desde:
              </Typography>
              <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main} sx={{ textDecoration: isElegibleForFreeDelivery() && 'line-through', mr: 1 }}>
                {haveExtraFee ? customDeliveryFee : orderDeliveryFee}
                {APP.currency}
              </Typography>
              {isElegibleForFreeDelivery() && (
                <Typography variant={componentProps.variant.body1} color={theme.palette.neutral.main}>
                  0{APP.currency}
                </Typography>
              )}

              {user.userType === 'user' && <TooltipDeliveryFee />}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2, fontWeight: 'bold', mr: 1 }}>
                Total:
              </Typography>
              <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ mt: 1, mb: 2 }}>
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

          <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitBtnRef.current.click()}>
            Encomendar
          </Button>
        </Box>
      )}
      {isLoading && <CircularProgress size='80px' sx={{ mb: 2 }} />}
    </Box>
  );
};
