import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react';
import TextInput from './TextInput';
import { componentProps, newItemClasses } from '../utils/app.styleClasses';
import TextAreaInput from './TextAreaInput';
import { APP, handleFileUpload } from '../utils/app.utils';

const ItemForm = ({
  handleSubmit,
  tempImageUrl,
  handleTitle,
  titleError,
  title,
  category,
  categoryError,
  handleCategory,
  handlePrice,
  priceError,
  price,
  handleDescription,
  description,
  descriptionError,
  handleIngredients,
  ingredients,
  ingredientsError,
  errorMessage,
  inputFileUploadRef,
  setTempImageUrl,
  setObjImageToUpload,
  submitFormRef,
}) => {
  return (
    <Box sx={newItemClasses.form}>
      <form onSubmit={handleSubmit} noValidate>
        <Box sx={{ maxWidth: '250px', mx: 'auto' }}>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />}</Box>

        <TextInput label='Titulo' variant={componentProps.variant.outlined} handleChange={handleTitle} error={titleError} value={title} autoComplete='true' style={newItemClasses.titleField} />

        <FormControl sx={{ mb: 2 }} align='left' fullWidth={true} error={categoryError}>
          <FormLabel>Categoria</FormLabel>
          <RadioGroup row name='row-radio-buttons-group' onChange={handleCategory}>
            <FormControlLabel value={APP.categories.doces} control={<Radio />} label='Doces' checked={category === APP.categories.doces} />
            <FormControlLabel value={APP.categories.salgados} control={<Radio />} label='Salgados' checked={category === APP.categories.salgados} />
          </RadioGroup>
        </FormControl>

        <TextInput label='Preço' variant={componentProps.variant.outlined} handleChange={handlePrice} error={priceError} value={price} autoComplete='true' style={newItemClasses.formField} />

        <TextAreaInput
          label='Descrição'
          maxRows={4}
          style={newItemClasses.formTextArea}
          handleChange={handleDescription}
          value={description}
          required={true}
          placeholder='Escreva aqui a descrição...'
          error={descriptionError}
        />

        <TextAreaInput
          label='Ingredientes'
          maxRows={4}
          style={newItemClasses.formTextArea}
          handleChange={handleIngredients}
          value={ingredients}
          required={true}
          placeholder='Escreva aqui os ingredientes separados por virgula...'
          error={ingredientsError}
        />

        {errorMessage && (
          <Typography paragraph sx={{ my: 4 }} color={componentProps.color.error}>
            {errorMessage}
          </Typography>
        )}

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
