// jshint esversion:9

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteItem, updateItem, uploadImage } from '../api';
import { removeShopItem, updateShopItem } from '../redux/features/items/itemsSlice';
import convert from 'image-file-resize';
import { editItemClasses } from '../utils/app.styleClasses';
import { CustomModal } from '../components/CustomModal';

import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField, Typography, useTheme } from '@mui/material';
import Radio from '@mui/material/Radio';
import AddIcon from '@mui/icons-material/Add';

const EditItemPage = () => {
  const { shopItems } = useSelector((store) => store.items);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [ingredientsError, setIngredientsError] = useState(false);
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState(false);
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const inputFileUpload = useRef(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const { itemId } = useParams();
  const effectRan = useRef(false);
  const submitFormButtom = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (effectRan.current === false && itemId) {
      let item = shopItems.find((item) => item._id === itemId);

      setItemToEdit(item);
      setTempImageUrl(item.imageUrl);
      setName(item.name);
      setCategory(item.category);
      setDescription(item.description);
      setIngredients(item.ingredients);
      setPrice(item.price);

      return () => {
        effectRan.current = true;
      };
    }
  }, [itemId, shopItems]);

  const handlePrice = (e) => {
    //regEx to prevent from typing letters
    const re = /^[0-9]*\.?[0-9]*$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setPrice(e.target.value);
    }
  };

  const handleFileUpload = async (e) => {
    try {
      if (e.target.files.lenght !== 0) {
        setTempImageUrl(URL.createObjectURL(e.target.files[0]));

        let resizedImg = await convert({
          file: e.target.files[0],
          width: 300,
          height: 225,
          type: 'jpeg',
        });

        setObjImageToUpload(resizedImg);
      }
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await deleteItem(itemId);

      dispatch(removeShopItem({ id: itemId }));
      setSuccessMessage('Item apagado com sucesso.');
    } catch (error) {
      console.log(error.message);
    }
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

    if (!objImageToUpload && !tempImageUrl) {
      setErrorMessage('Por favor adicione imagem.');
      return;
    }

    setBtnLoading(true);
    try {
      if (objImageToUpload) {
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let { fileUrl } = await uploadImage(uploadData);

        const requestBody = { name, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

        let { data } = await updateItem(requestBody, itemId);

        dispatch(updateShopItem(data.updatedItem));

        setSuccessMessage('Item actualizado com sucesso.');

        setBtnLoading(false);

        setTimeout(() => navigate('/'), 5000);
      } else {
        const requestBody = { name, category, description, ingredients, price: Number(price) };

        let { data } = await updateItem(requestBody, itemId);

        dispatch(updateShopItem(data.updatedItem));

        setSuccessMessage('Item actualizado com sucesso.');

        setTimeout(() => navigate('/'), 5000);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setBtnLoading(false);
    }
  };

  return (
    <Box sx={editItemClasses.container}>
      {itemToEdit && (
        <>
          <Typography variant='h2' color='primary' sx={{ my: 4 }}>
            EDITAR
          </Typography>

          <Typography variant='h4' color={theme.pallete.neutral.main} sx={{ my: 4 }}>
            {name}
          </Typography>

          {!successMessage && (
            <Box sx={editItemClasses.formContainer}>
              <Box sx={editItemClasses.form}>
                <form onSubmit={handleSubmit} noValidate>
                  <Box sx={{ maxWidth: '250px', mx: 'auto' }}>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ maxWidth: '100%', height: 'auto', marginBottom: 4 }} />}</Box>

                  <TextField label='Titulo' type='text' variant='outlined' fullWidth required sx={editItemClasses.nameField} onChange={(e) => setName(e.target.value)} error={nameError} value={name} />

                  <Box>
                    <FormControl sx={{ mb: 2 }} align='left' fullWidth={true} error={categoryError}>
                      <FormLabel id='demo-row-radio-buttons-group-label'>Categoria</FormLabel>
                      <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group' onChange={(e) => setCategory(e.target.value)}>
                        <FormControlLabel value='doces' control={<Radio />} label='Doces' checked={category === 'doces'} />
                        <FormControlLabel value='salgados' control={<Radio />} label='Salgados' checked={category === 'salgados'} />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  <TextField
                    label='Preço'
                    type='text'
                    variant='outlined'
                    fullWidth
                    required
                    sx={editItemClasses.formField}
                    onChange={(e) => handlePrice(e)}
                    error={priceError}
                    value={price}
                    autoComplete='true'
                  />

                  <TextField
                    id='outlined-multiline-flexible'
                    label='Descrição'
                    multiline
                    maxRows={4}
                    sx={editItemClasses.formTextArea}
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
                    sx={editItemClasses.formTextArea}
                    onChange={(e) => setIngredients(e.target.value)}
                    value={ingredients}
                    required
                    placeholder='Escreva aqui os ingredientes separados por virgula...'
                    error={ingredientsError}
                  />

                  {errorMessage && (
                    <Typography paragraph sx={{ mb: 4 }} color='error'>
                      {errorMessage}
                    </Typography>
                  )}

                  <div>
                    <input ref={inputFileUpload} hidden type='file' onChange={(e) => handleFileUpload(e)} />

                    <button type='submit' ref={submitFormButtom} hidden>
                      Actualizar
                    </button>
                  </div>
                </form>
              </Box>
            </Box>
          )}

          {successMessage && (
            <Typography paragraph sx={{ my: 4 }}>
              {successMessage}
            </Typography>
          )}

          <Box>
            {!btnLoading && (
              <Button sx={{ mr: 1, mt: 1 }} onClick={() => navigate(-1)}>
                Voltar
              </Button>
            )}

            {!successMessage && !btnLoading && (
              <>
                <Button sx={{ mr: 1, mt: 1 }} type='button' color='error' variant='outlined' onClick={handleOpen}>
                  Apagar
                </Button>

                <Button sx={{ mr: 1, mt: 1 }} type='button' variant='outlined' endIcon={<AddIcon />} onClick={() => inputFileUpload.current.click()}>
                  Imagem
                </Button>
                <Button sx={{ mt: 1 }} type='button' variant='contained' onClick={() => submitFormButtom.current.click()}>
                  Actualizar
                </Button>
              </>
            )}
            {btnLoading && !successMessage && <CircularProgress size='80px' sx={{ mb: 2 }} />}
          </Box>
        </>
      )}
      <CustomModal isModalOpen={open} handleCloseModal={handleClose} mainFunction={handleDeleteItem} question='Apagar Item?' buttonText='Apagar' />
    </Box>
  );
};

export default EditItemPage;
