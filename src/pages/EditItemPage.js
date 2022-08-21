// jshint esversion:9

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteItem, updateItem, uploadImage } from '../api';
import { removeShopItem, updateShopItem } from '../redux/features/items/itemsSlice';

import { Box, Button, FormControl, FormControlLabel, FormLabel, RadioGroup, TextField, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import AddIcon from '@mui/icons-material/Add';

export const EditItemPage = () => {
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
  const { itemId } = useParams();
  const effectRan = useRef(false);
  const submitFormButtom = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editItemClasses = {
    container: {
      px: 3,
      pb: 3,
    },
    formContainer: {
      marginTop: 0,
    },
    form: {
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: 300,
      maxWidth: 600,
    },
    formField: {
      marginTop: 0,
      marginBottom: 5,
      display: 'block',
    },
    nameField: {
      marginTop: 0,
      marginBottom: 2,
      display: 'block',
    },
    formTextArea: {
      minWidth: '100%',
      marginBottom: 5,
    },
  };

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
        setObjImageToUpload(e.target.files[0]);
      }
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const handleDeleteItem = async () => {
    // showDeleteModal() - on click apagar
    // delete item - on confirm delete
    try {
      await deleteItem(itemId);

      dispatch(removeShopItem({ id: itemId }));
      setSuccessMessage('Item apagado com sucesso.');
      setTimeout(() => navigate('/'), 5000);
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

    try {
      if (objImageToUpload) {
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let { fileUrl } = await uploadImage(uploadData);

        const requestBody = { name, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

        let { data } = await updateItem(requestBody, itemId);

        dispatch(updateShopItem(data.updatedItem));

        setSuccessMessage('Item actualizado com sucesso.');

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
    }
  };

  return (
    <Box sx={editItemClasses.container}>
      {itemToEdit && (
        <>
          <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
            Editar Item
          </Typography>

          <Typography variant='h4' color='#031D44' sx={{ my: '25px' }}>
            {name}
          </Typography>

          {!successMessage && (
            <Box sx={editItemClasses.formContainer}>
              <Box sx={editItemClasses.form}>
                <form onSubmit={handleSubmit} noValidate>
                  <Box sx={{ maxWidth: '250px', mx: 'auto' }}>{tempImageUrl && <img src={tempImageUrl} alt='Novo item' style={{ maxWidth: '100%', height: 'auto', marginBottom: '25px' }} />}</Box>

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

                  <TextField label='Preço' type='text' variant='outlined' fullWidth required sx={editItemClasses.formField} onChange={(e) => handlePrice(e)} error={priceError} value={price} />

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
                    <Typography paragraph sx={{ mb: '25px' }} color='error'>
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

          {successMessage && <p>{successMessage}</p>}

          <Box>
            <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
              Voltar
            </Button>

            {!successMessage && (
              <>
                <Button sx={{ mr: 1 }} type='button' variant='outlined' endIcon={<AddIcon />} onClick={() => inputFileUpload.current.click()}>
                  Imagem
                </Button>
                <Button type='button' variant='contained' onClick={() => submitFormButtom.current.click()}>
                  Actualizar
                </Button>
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
