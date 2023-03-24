// jshint esversion:9

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createItem, uploadImage } from '../api';
import { addNewShopItem } from '../redux/features/items/itemsSlice';
import defaultProductImage from '../images/item.svg';

import { Box, FormControl, Typography, FormLabel, RadioGroup, FormControlLabel, TextField, Button, CircularProgress } from '@mui/material';
import Radio from '@mui/material/Radio';
import AddIcon from '@mui/icons-material/Add';
import { newItemClasses } from '../utils/app.styleClasses';
import { handleFileUpload } from '../utils/app.utils';

const NewItemPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [ingredientsError, setIngredientsError] = useState(false);
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState(false);
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const inputFileUpload = useRef(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const submitForm = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setTempImageUrl(defaultProductImage);
  }, []);

  const handlePrice = (e) => {
    //regEx to prevent from typing letters
    const re = /^[0-9]*\.?[0-9]*$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setPrice(e.target.value);
    }
  };

  const handleImageUpload = async (e) => {
    handleFileUpload(e, setTempImageUrl, setObjImageToUpload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setNameError(true);
      setErrorMessage('Por favor introduza Titulo.');
      return;
    }
    setNameError(false);

    if (!category) {
      setCategoryError(true);
      setErrorMessage('Por favor escolha categoria.');
      return;
    }
    setCategoryError(false);

    if (!price) {
      setPriceError(true);
      setErrorMessage('Por favor introduza preço.');
      return;
    }
    setPriceError(false);

    if (!description) {
      setDescriptionError(true);
      setErrorMessage('Por favor introduza descrição.');
      return;
    }
    setDescriptionError(false);

    if (!ingredients) {
      setIngredientsError(true);
      setErrorMessage('Por favor introduza ingredientes.');
      return;
    }
    setIngredientsError(false);

    if (!objImageToUpload) {
      setErrorMessage('Por favor adicione imagem.');
      return;
    }

    setBtnLoading(true);

    try {
      const uploadData = new FormData();

      uploadData.append('imageUrl', objImageToUpload);

      let { fileUrl } = await uploadImage(uploadData);

      const requestBody = { name, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

      let { data } = await createItem(requestBody);

      dispatch(addNewShopItem(data));

      setSuccessMessage('Item criado com sucesso.');

      setBtnLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setBtnLoading(false);
    }
  };

  return (
    <Box sx={newItemClasses.container}>
      <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
        CRIAR
      </Typography>

      {!successMessage && (
        <Box sx={newItemClasses.formContainer}>
          <Box sx={newItemClasses.form}>
            <form onSubmit={handleSubmit} noValidate>
              <Box sx={{ maxWidth: '250px', mx: 'auto' }}>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />}</Box>

              <TextField label='Titulo' type='text' variant='outlined' fullWidth required sx={newItemClasses.nameField} onChange={(e) => setName(e.target.value)} error={nameError} value={name} />

              <Box>
                <FormControl sx={{ mb: 2 }} align='left' fullWidth={true} error={categoryError}>
                  <FormLabel id='demo-row-radio-buttons-group-label'>Categoria</FormLabel>
                  <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group' onChange={(e) => setCategory(e.target.value)}>
                    <FormControlLabel value='doces' control={<Radio />} label='Doces' />
                    <FormControlLabel value='salgados' control={<Radio />} label='Salgados' />
                  </RadioGroup>
                </FormControl>
              </Box>

              <TextField label='Preço' type='text' variant='outlined' fullWidth required sx={newItemClasses.formField} onChange={(e) => handlePrice(e)} error={priceError} value={price} />

              <TextField
                id='outlined-multiline-flexible'
                label='Descrição'
                multiline
                maxRows={4}
                sx={newItemClasses.formTextArea}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                placeholder='Escreva aqui a descrição...'
                error={descriptionError}
              />

              <TextField
                id='outlined-multiline-flexible'
                label='Ingredientes'
                multiline
                maxRows={4}
                sx={newItemClasses.formTextArea}
                onChange={(e) => setIngredients(e.target.value)}
                value={ingredients}
                required
                placeholder='Escreva aqui os ingredientes separados por virgula...'
                error={ingredientsError}
              />

              {errorMessage && (
                <Typography paragraph sx={{ my: '25px' }} color='error'>
                  {errorMessage}
                </Typography>
              )}

              <div>
                <input ref={inputFileUpload} hidden type='file' onChange={(e) => handleImageUpload(e)} />

                <button type='submit' ref={submitForm} hidden>
                  Criar
                </button>
              </div>
            </form>
          </Box>
        </Box>
      )}

      {successMessage && <p>{successMessage}</p>}

      <Box>
        {!btnLoading && (
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}

        {!successMessage && !btnLoading && (
          <>
            <Button sx={{ mr: 1 }} type='button' variant='outlined' endIcon={<AddIcon />} onClick={() => inputFileUpload.current.click()}>
              Imagem
            </Button>
            <Button type='button' variant='contained' onClick={() => submitForm.current.click()}>
              Criar
            </Button>
          </>
        )}
        {btnLoading && !successMessage && <CircularProgress size='80px' sx={{ mb: 2 }} />}
      </Box>
    </Box>
  );
};

export default NewItemPage;
