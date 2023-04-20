import { Box, FormControl, FormControlLabel, FormLabel, RadioGroup, Switch, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import { isValidDeliveryDate } from '../utils/app.utils';
import { cartFormClasses, componentProps, editOrderClasses } from '../utils/app.styleClasses';
import ErrorMessage from './ErrorMessage';
import { Controller } from 'react-hook-form';

export function EditOrderForm({ handleSubmit, handleOrderSubmit, control, errors, handleDeliveryRadio, isAddressVisible, errorMessage, submitBtnRef, haveExtraFee, isDelivery, isAdmin }) {
  const userType = isAdmin ? 'admin' : 'user';
  return (
    <Box sx={editOrderClasses.formContainer}>
      <Box sx={editOrderClasses.form}>
        <form onSubmit={handleSubmit(handleOrderSubmit)} noValidate>
          <Controller
            name={componentProps.name.contact}
            control={control}
            rules={{
              required: 'Contacto em falta',
              minLength: { value: 9, message: 'Contacto inválido' },
              maxLength: { value: 14, message: 'Contacto inválido' },
              pattern: { value: /^[0-9]{0,14}$/, message: 'Contacto inválido' },
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
                autoComplete='true'
                autoFocus
                {...field}
              />
            )}
          />

          <Controller
            name={componentProps.name.deliveryDate}
            control={control}
            rules={{ required: 'Data em falta', validate: (value) => isValidDeliveryDate(value, userType) || 'Data de entrega invalida, escolha data com um minimo de 48h' }}
            render={({ field }) => (
              <TextField
                label='Data & Hora de entrega'
                type={componentProps.type.datetimeLocal}
                variant={componentProps.variant.outlined}
                fullWidth
                sx={cartFormClasses.formField}
                error={errors.deliveryDate ? true : false}
                inputProps={isAdmin ? editOrderClasses.datePropsAdmin : editOrderClasses.datePropsUser}
                {...field}
              />
            )}
          />
          <Box sx={{ display: { xs: 'block', md: 'flex' }, mb: 2 }}>
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
                    <FormControlLabel value='takeAway' control={<Radio />} label='Take Away' checked={!isDelivery} onChange={(e) => handleDeliveryRadio(e.target.value, field)} />
                  </RadioGroup>
                )}
              />
            </FormControl>

            {isDelivery && isAdmin && (
              <Controller
                control={control}
                name={componentProps.name.haveExtraFee}
                render={({ field }) => <FormControlLabel control={<Switch checked={haveExtraFee} {...field} />} label='Definir taxa de entrega' sx={{ width: '100%', mt: { md: 3 } }} />}
              />
            )}
          </Box>
          {isAddressVisible && (
            <>
              {isAdmin && haveExtraFee && (
                <>
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
                </>
              )}

              <Controller
                name={componentProps.name.fullAddress}
                control={control}
                rules={{ required: { value: isDelivery, message: 'Morada em falta' } }}
                render={({ field }) => (
                  <TextField
                    label='Morada'
                    type={componentProps.type.text}
                    variant={componentProps.variant.outlined}
                    fullWidth
                    sx={cartFormClasses.formField}
                    placeholder='Rua dos bolos n 7'
                    error={errors.fullAddress ? true : false}
                    autoComplete='true'
                    {...field}
                  />
                )}
              />
            </>
          )}
          <Controller
            name={componentProps.name.message}
            control={control}
            render={({ field }) => <TextField label='Mensagem' maxRows={4} multiline sx={cartFormClasses.formTextArea} placeholder='Escreva aqui a sua mensagem...' {...field} />}
          />
          {errorMessage && <ErrorMessage message={errorMessage} />}
          {errors.contact && <ErrorMessage message={errors.contact.message} />}
          {errors.deliveryDate && <ErrorMessage message={errors.deliveryDate.message} />}
          {errors.deliveryMethod && <ErrorMessage message={errors.deliveryMethod.message} />}
          {errors.customDeliveryFee && <ErrorMessage message={errors.customDeliveryFee.message} />}
          {errors.fullAddress && <ErrorMessage message={errors.fullAddress.message} />}
          <button type={componentProps.type.submit} ref={submitBtnRef} hidden>
            Actualizar
          </button>
        </form>
      </Box>
    </Box>
  );
}
