// jshint esversion:9

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { APP, getMissingAmountForFreeDelivery, isValidDeliveryDate } from '../utils/app.utils';

import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, RadioGroup, Switch, TextField, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import TooltipDeliveryFee from './TooltipDeliveryFee';
import { cartFormClasses, componentProps } from '../utils/app.styleClasses';
import ErrorMessage from './ErrorMessage';
import { Controller } from 'react-hook-form';

// When on mobile inputType is not being toggled
// so we check if its mobile or not
const IS_MOBILE = window.innerWidth < 600 ? true : false;

export const CartOrderForm = ({
  formRef,
  orderAddressRef,
  control,
  isFormVisible,
  handleSubmit,
  handleOrderSubmit,
  errors,
  deliveryDate,
  deliveryMethod,
  handleDeliveryRadio,
  isAddressVisible,
  errorMessage,
  navigate,
  haveExtraFee,
  submitBtnRef,
  successMessage,
  isLoading,
  user,
  calculateCartTotalToShow,
  customDeliveryFee,
}) => {
  const { cartTotal, orderDeliveryFee, amountForFreeDelivery, globalDeliveryDiscount } = useSelector((store) => store.items);
  const theme = useTheme();
  const [inputType, setInputType] = useState('text');
  const isDelivery = deliveryMethod === 'delivery';
  const isTakeAway = deliveryMethod === 'takeAway';

  const isElegibleForFreeDelivery = () => {
    return (globalDeliveryDiscount || (cartTotal > amountForFreeDelivery && isDelivery)) && !haveExtraFee;
  };

  const shouldShowDeliveryMessage = () => {
    return !isElegibleForFreeDelivery() && getMissingAmountForFreeDelivery(amountForFreeDelivery, cartTotal, deliveryMethod) > 0;
  };

  return (
    <Box sx={isFormVisible ? null : cartFormClasses.notVisible} ref={formRef}>
      <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ my: 2 }}>
        Dados de entrega
      </Typography>
      <Box sx={cartFormClasses.form}>
        <form onSubmit={handleSubmit(handleOrderSubmit)} noValidate style={cartFormClasses.innerForm}>
          <Controller
            name={componentProps.name.contact}
            control={control}
            rules={{
              required: 'Contacto em falta',

              pattern: { value: /^[0-9]+$/, message: 'Contacto inválido' },
            }}
            render={({ field }) => (
              <TextField
                label='Contacto'
                type={componentProps.type.text}
                variant={componentProps.variant.outlined}
                fullWidth
                sx={cartFormClasses.formField}
                error={errors.contact ? true : false}
                placeholder='912345678'
                inputProps={{ minLength: 9, maxLength: 14 }}
                autoComplete='true'
                autoFocus
                {...field}
              />
            )}
          />

          <Controller
            name={componentProps.name.deliveryDate}
            control={control}
            rules={{ required: 'Data em falta', validate: (value) => isValidDeliveryDate(value, user.userType) || 'Data de entrega invalida, escolha data com um minimo de 48h' }}
            render={({ field }) => (
              <TextField
                label='Data & Hora de entrega'
                type={IS_MOBILE ? componentProps.type.datetimeLocal : inputType}
                variant={componentProps.variant.outlined}
                fullWidth
                sx={cartFormClasses.formField}
                onFocus={() => !IS_MOBILE && setInputType(componentProps.type.datetimeLocal)}
                onBlur={() => !IS_MOBILE && !deliveryDate && setInputType(componentProps.type.text)}
                error={errors.deliveryDate ? true : false}
                inputProps={user.userType === 'user' ? cartFormClasses.dateProps : {}}
                {...field}
              />
            )}
          />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, mb: 2 }}>
            <FormControl
              sx={errors.deliveryMethod ? { pt: 2, pb: 1, pl: 2, outline: '1px solid #d32f2f', borderRadius: '3px' } : null}
              align='left'
              fullWidth
              error={errors.deliveryMethod ? true : false}
            >
              <FormLabel>Método de entrega</FormLabel>
              <Controller
                name={componentProps.name.deliveryMethod}
                control={control}
                rules={{ required: 'Método de entrega em falta' }}
                render={({ field }) => (
                  <RadioGroup row name='row-radio-buttons-group' {...field}>
                    <FormControlLabel value='delivery' control={<Radio />} label='Entrega' checked={isDelivery} onChange={(e) => handleDeliveryRadio(e.target.value, field)} />
                    <FormControlLabel value='takeAway' control={<Radio />} label='Take Away' checked={isTakeAway} onChange={(e) => handleDeliveryRadio(e.target.value, field)} />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {isDelivery && user.userType === 'admin' && (
              <Controller
                control={control}
                name={componentProps.name.haveExtraFee}
                render={({ field }) => <FormControlLabel control={<Switch {...field} />} label='Definir taxa de entrega' sx={{ width: '100%', mt: { md: 3 } }} />}
              />
            )}
          </Box>

          {user.userType === 'admin' && haveExtraFee && (
            <Controller
              name={componentProps.name.customDeliveryFee}
              control={control}
              rules={{
                required: { value: haveExtraFee, message: 'Valor em falta' },
                pattern: { value: /^[0-9.]+$/, message: 'Valor inválido' },
              }}
              render={({ field }) => (
                <TextField
                  label='Taxa de entrega'
                  type={componentProps.type.text}
                  variant={componentProps.variant.outlined}
                  fullWidth
                  sx={cartFormClasses.formField}
                  error={errors.customDeliveryFee ? true : false}
                  inputProps={{ maxLength: 6 }}
                  autoFocus
                  {...field}
                />
              )}
            />
          )}
          <Box sx={isAddressVisible ? null : cartFormClasses.notVisible} ref={orderAddressRef}>
            <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ mb: 2 }}>
              Morada
            </Typography>

            <Controller
              name={componentProps.name.addressStreet}
              control={control}
              rules={{ required: { value: isDelivery, message: 'Rua em falta' } }}
              render={({ field }) => (
                <TextField
                  label='Rua'
                  type={componentProps.type.text}
                  variant={componentProps.variant.outlined}
                  fullWidth
                  sx={cartFormClasses.formField}
                  placeholder='Rua dos bolos n 7'
                  error={errors.addressStreet ? true : false}
                  autoComplete='true'
                  {...field}
                />
              )}
            />

            <Controller
              name={componentProps.name.addressCode}
              control={control}
              rules={{
                required: { value: isDelivery, message: 'Codigo postal em falta' },
                minLength: 4,
                pattern: { value: /^[0-9]{0,4}(?:-[0-9]{0,3})?$/, message: 'Codigo postal inválido' },
              }}
              render={({ field }) => (
                <TextField
                  label='Código Postal'
                  type={componentProps.type.text}
                  variant={componentProps.variant.outlined}
                  fullWidth
                  sx={cartFormClasses.formField}
                  placeholder='8800-123'
                  error={errors.addressCode ? true : false}
                  autoComplete='true'
                  inputProps={{ maxLength: 8 }}
                  {...field}
                />
              )}
            />

            <Controller
              name={componentProps.name.addressCity}
              control={control}
              rules={{ required: { value: isDelivery, message: 'Cidade em falta' } }}
              render={({ field }) => (
                <TextField
                  label='Cidade'
                  type={componentProps.type.text}
                  variant={componentProps.variant.outlined}
                  fullWidth
                  sx={cartFormClasses.formField}
                  placeholder='Tavira'
                  error={errors.addressCity ? true : false}
                  autoComplete='true'
                  inputProps={{ maxLength: 50 }}
                  {...field}
                />
              )}
            />
          </Box>

          <Controller
            name={componentProps.name.message}
            control={control}
            render={({ field }) => <TextField label='Mensagem' maxRows={4} multiline sx={cartFormClasses.formTextArea} placeholder='Escreva aqui a sua mensagem...' autoComplete='true' {...field} />}
          />

          {errorMessage && <ErrorMessage message={errorMessage} />}
          {errors.contact && <ErrorMessage message={errors.contact.message} />}
          {errors.deliveryDate && <ErrorMessage message={errors.deliveryDate.message} />}
          {errors.deliveryMethod && <ErrorMessage message={errors.deliveryMethod.message} />}
          {errors.customDeliveryFee && <ErrorMessage message={errors.customDeliveryFee.message} />}
          {errors.addressStreet && <ErrorMessage message={errors.addressStreet.message} />}
          {errors.addressCode && <ErrorMessage message={errors.addressCode.message} />}
          {errors.addressCity && <ErrorMessage message={errors.addressCity.message} />}

          <button type={componentProps.type.submit} ref={submitBtnRef} hidden>
            Encomendar
          </button>
        </form>

        {isDelivery && (
          <Box sx={{ mb: 2 }}>
            {shouldShowDeliveryMessage() && (
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
