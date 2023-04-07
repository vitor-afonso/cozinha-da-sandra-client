import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React from 'react';
import { componentProps, newItemClasses } from '../utils/app.styleClasses';
import { APP, handleFileUpload } from '../utils/app.utils';

const ItemForm = ({
  handleSubmit,
  tempImageUrl,
  setTitle,
  titleError,
  title,
  category,
  categoryError,
  setCategory,
  handlePrice,
  priceError,
  price,
  setDescription,
  description,
  descriptionError,
  setIngredients,
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
        <TextField
          label='Titulo'
          type={componentProps.type.text}
          variant={componentProps.variant.outlined}
          fullWidth
          required
          sx={newItemClasses.titleField}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          value={title}
          autoComplete='true'
          autoFocus
        />

        <FormControl sx={{ mb: 2 }} align='left' fullWidth={true} error={categoryError}>
          <FormLabel>Categoria</FormLabel>
          <RadioGroup row name='row-radio-buttons-group' onChange={(e) => setCategory(e.target.value)}>
            <FormControlLabel value={APP.categories.doces} control={<Radio />} label='Doces' checked={category === APP.categories.doces} />
            <FormControlLabel value={APP.categories.salgados} control={<Radio />} label='Salgados' checked={category === APP.categories.salgados} />
          </RadioGroup>
        </FormControl>

        <TextField
          label='Preço'
          type={componentProps.type.text}
          variant={componentProps.variant.outlined}
          fullWidth
          required
          sx={newItemClasses.formField}
          onChange={handlePrice}
          error={priceError}
          value={price}
          autoComplete='true'
        />

        <TextField
          label='Descrição'
          maxRows={4}
          multiline
          sx={newItemClasses.formTextArea}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
          placeholder='Escreva aqui a descrição...'
          error={descriptionError}
        />

        <TextField
          label='Ingredientes'
          maxRows={4}
          multiline
          sx={newItemClasses.formTextArea}
          onChange={(e) => setIngredients(e.target.value)}
          value={ingredients}
          required
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
