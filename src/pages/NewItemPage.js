// jshint esversion:9

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createItem, uploadImage } from '../api';
import { addNewShopItem } from '../redux/features/items/itemsSlice';
import defaultProductImage from '../images/item.svg';

import { Box, Typography, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { componentProps, newItemClasses } from '../utils/app.styleClasses';
import ItemForm from '../components/ItemForm';

const NewItemPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
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
  const inputFileUploadRef = useRef(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const submitFormRef = useRef(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setTitleError(true);
      setErrorMessage('Por favor introduza Titulo.');
      return;
    }
    setTitleError(false);

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

      const requestBody = { name: title, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

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
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
        CRIAR
      </Typography>

      {!successMessage && (
        <Box sx={newItemClasses.formContainer}>
          <ItemForm
            handleSubmit={handleSubmit}
            tempImageUrl={tempImageUrl}
            setTitle={setTitle}
            titleError={titleError}
            title={title}
            category={category}
            categoryError={categoryError}
            setCategory={setCategory}
            handlePrice={handlePrice}
            priceError={priceError}
            price={price}
            setDescription={setDescription}
            description={description}
            descriptionError={descriptionError}
            setIngredients={setIngredients}
            ingredients={ingredients}
            ingredientsError={ingredientsError}
            errorMessage={errorMessage}
            inputFileUploadRef={inputFileUploadRef}
            setTempImageUrl={setTempImageUrl}
            setObjImageToUpload={setObjImageToUpload}
            submitFormRef={submitFormRef}
          />
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
            <Button sx={{ mr: 1 }} type={componentProps.type.button} variant={componentProps.variant.outlined} endIcon={<AddIcon />} onClick={() => inputFileUploadRef.current.click()}>
              Imagem
            </Button>
            <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitFormRef.current.click()}>
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
