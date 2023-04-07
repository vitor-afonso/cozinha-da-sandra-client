// jshint esversion:9

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteItem, updateItem, uploadImage } from '../api';
import { removeShopItem, updateShopItem } from '../redux/features/items/itemsSlice';
import { componentProps, editItemClasses } from '../utils/app.styleClasses';
import { CustomModal } from '../components/CustomModal';

import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ItemForm from '../components/ItemForm';

const EditItemPage = () => {
  const { shopItems } = useSelector((store) => store.items);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
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
  const inputFileUploadRef = useRef(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const { itemId } = useParams();
  const effectRan = useRef(false);
  const submitFormRef = useRef(null);
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
      setTitle(item.name);
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

    if (!title) {
      setTitleError(true);
      setErrorMessage('Por favor introduza titulo.');
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

        const requestBody = { name: title, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

        let { data } = await updateItem(requestBody, itemId);

        dispatch(updateShopItem(data.updatedItem));

        setSuccessMessage('Item actualizado com sucesso.');

        setBtnLoading(false);
      } else {
        const requestBody = { name: title, category, description, ingredients, price: Number(price) };

        let { data } = await updateItem(requestBody, itemId);

        dispatch(updateShopItem(data.updatedItem));

        setSuccessMessage('Item actualizado com sucesso.');
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
          <Typography variant={componentProps.variant.h2} color={theme.palette.primary.main} sx={{ my: 4 }}>
            EDITAR
          </Typography>

          <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ my: 4 }}>
            {title}
          </Typography>

          {!successMessage && (
            <Box sx={editItemClasses.formContainer}>
              <Box sx={editItemClasses.form}>
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
                <Button sx={{ mr: 1, mt: 1 }} type={componentProps.type.button} color={componentProps.color.error} variant={componentProps.variant.outlined} onClick={handleOpen}>
                  Apagar
                </Button>

                <Button sx={{ mr: 1, mt: 1 }} type={componentProps.type.button} variant={componentProps.variant.outlined} endIcon={<AddIcon />} onClick={() => inputFileUploadRef.current.click()}>
                  Imagem
                </Button>
                <Button sx={{ mt: 1 }} type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitFormRef.current.click()}>
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
