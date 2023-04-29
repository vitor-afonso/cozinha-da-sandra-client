import React from 'react';
import { Controller } from 'react-hook-form';
import { componentProps, newItemClasses } from 'utils/app.styleClasses';
import { APP, handleFileUpload } from 'utils/app.utils';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import ErrorMessage from 'components/ErrorMessage';

const ItemForm = ({ handleItemSubmit, handleRHFSubmit, tempImageUrl, control, errors, errorMessage, inputFileUploadRef, setTempImageUrl, setObjImageToUpload, submitFormRef }) => {
  return (
    <Box sx={newItemClasses.form}>
      <form noValidate onSubmit={handleRHFSubmit(handleItemSubmit)}>
        <Box sx={{ maxWidth: '250px', mx: 'auto' }}>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />}</Box>

        <Controller
          name={componentProps.name.title}
          control={control}
          rules={{ required: 'Titulo em falta' }}
          render={({ field }) => (
            <TextField
              label='Titulo'
              type={componentProps.type.text}
              variant={componentProps.variant.outlined}
              fullWidth
              sx={newItemClasses.titleField}
              error={errors.title ? true : false}
              autoComplete='true'
              autoFocus
              {...field}
            />
          )}
        />

        <FormControl sx={errors.category ? { mb: 2, outline: '1px solid #d32f2f', padding: 2, borderRadius: '3px' } : { mb: 2 }} align='left' fullWidth error={errors.category ? true : false}>
          <FormLabel>Categoria</FormLabel>
          <Controller
            name={componentProps.name.category}
            control={control}
            rules={{ required: 'Categoria em falta' }}
            render={({ field }) => (
              <RadioGroup row name='row-radio-buttons-group' {...field}>
                <FormControlLabel value={APP.categories.doces} control={<Radio />} label='Doces' />
                <FormControlLabel value={APP.categories.salgados} control={<Radio />} label='Salgados' />
              </RadioGroup>
            )}
          />
        </FormControl>

        <Controller
          name={componentProps.name.price}
          control={control}
          rules={{
            required: 'Preço em falta',
            pattern: { value: /^[0-9]*\.?[0-9]*$/, message: 'Valor inválido' },
          }}
          render={({ field }) => (
            <TextField
              label='Preço'
              type={componentProps.type.text}
              variant={componentProps.variant.outlined}
              fullWidth
              sx={newItemClasses.formField}
              error={errors.price ? true : false}
              autoComplete='true'
              {...field}
            />
          )}
        />

        <Controller
          name={componentProps.name.description}
          control={control}
          rules={{ required: 'Descrição em falta' }}
          render={({ field }) => (
            <TextField
              label='Descrição'
              maxRows={4}
              multiline
              sx={newItemClasses.formTextArea}
              placeholder='Escreva aqui a descrição'
              error={errors.description ? true : false}
              autoComplete='true'
              {...field}
            />
          )}
        />

        <Controller
          name={componentProps.name.ingredients}
          control={control}
          rules={{ required: 'Ingredientes em falta' }}
          render={({ field }) => (
            <TextField
              label='Ingredientes'
              maxRows={4}
              multiline
              sx={newItemClasses.formTextArea}
              placeholder='Escreva aqui os ingredientes separados por virgula. Ex: "ovos,farinha,fermento"'
              error={errors.ingredients ? true : false}
              autoComplete='true'
              {...field}
            />
          )}
        />

        {errorMessage && <ErrorMessage message={errorMessage} />}
        {errors.title && <ErrorMessage message={errors.title.message} />}
        {errors.category && <ErrorMessage message={errors.category.message} />}
        {errors.price && <ErrorMessage message={errors.price.message} />}
        {errors.description && <ErrorMessage message={errors.description.message} />}
        {errors.ingredients && <ErrorMessage message={errors.ingredients.message} />}

        <div>
          <input ref={inputFileUploadRef} hidden type='file' onChange={(e) => handleFileUpload(e, setTempImageUrl, setObjImageToUpload)} />

          <button type={componentProps.type.submit} ref={submitFormRef} hidden>
            Criar
          </button>
        </div>
      </form>
    </Box>
  );
};

export default ItemForm;
