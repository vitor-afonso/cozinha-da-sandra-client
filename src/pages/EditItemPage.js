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
import { useForm } from 'react-hook-form';
import SuccessMessage from '../components/SuccessMessage';

const EditItemPage = () => {
  const { shopItems } = useSelector((store) => store.items);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const inputFileUploadRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { itemId } = useParams();
  const effectRan = useRef(false);
  const submitFormRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Watches value changes in the title field
  const itemTitle = watch('title');

  useEffect(() => {
    if (!effectRan.current && itemId && control) {
      let oneItem = shopItems.find((item) => item._id === itemId);
      let initialFormValues = { title: oneItem.name, price: oneItem.price, category: oneItem.category, description: oneItem.description, ingredients: oneItem.ingredients };

      setTempImageUrl(oneItem.imageUrl);

      // Sets the initial values to the form fields
      reset(initialFormValues);

      return () => {
        effectRan.current = true;
      };
    }
  }, [itemId, shopItems, control, reset]);

  const handleDeleteItem = async () => {
    setIsLoading(true);
    try {
      await deleteItem(itemId);

      dispatch(removeShopItem({ id: itemId }));
      setSuccessMessage('Item apagado com sucesso.');
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItemSubmit = async ({ title, price, category, description, ingredients }) => {
    if (!objImageToUpload && !tempImageUrl) {
      setErrorMessage('Por favor adicione imagem.');
      return;
    }

    setIsLoading(true);
    try {
      if (objImageToUpload) {
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let { fileUrl } = await uploadImage(uploadData);

        const requestBody = { name: title, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

        let { data } = await updateItem(requestBody, itemId);

        dispatch(updateShopItem(data.updatedItem));

        setSuccessMessage('Item actualizado com sucesso.');

        setIsLoading(false);
      } else {
        const requestBody = { name: title, category, description, ingredients, price: Number(price) };

        let { data } = await updateItem(requestBody, itemId);

        dispatch(updateShopItem(data.updatedItem));

        setSuccessMessage('Item actualizado com sucesso.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={editItemClasses.container}>
      {tempImageUrl && (
        <>
          <Typography variant={componentProps.variant.h2} color={theme.palette.primary.main} sx={{ my: 4 }}>
            EDITAR
          </Typography>

          <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main} sx={{ my: 4 }}>
            {itemTitle}
          </Typography>

          {!successMessage && (
            <Box sx={editItemClasses.formContainer}>
              <Box sx={editItemClasses.form}>
                <ItemForm
                  handleRHFSubmit={handleSubmit}
                  handleItemSubmit={handleEditItemSubmit}
                  control={control}
                  errors={errors}
                  tempImageUrl={tempImageUrl}
                  errorMessage={errorMessage}
                  inputFileUploadRef={inputFileUploadRef}
                  setTempImageUrl={setTempImageUrl}
                  setObjImageToUpload={setObjImageToUpload}
                  submitFormRef={submitFormRef}
                />
              </Box>
            </Box>
          )}

          {successMessage && <SuccessMessage message={successMessage} />}

          <Box>
            {!isLoading && (
              <Button sx={{ mr: 1, mt: 1 }} onClick={() => navigate(-1)}>
                Voltar
              </Button>
            )}

            {!successMessage && !isLoading && (
              <>
                <Button sx={{ mr: 1, mt: 1 }} type={componentProps.type.button} color={componentProps.color.error} variant={componentProps.variant.outlined} onClick={setIsModalOpen}>
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
            {isLoading && !successMessage && <CircularProgress size='80px' sx={{ mb: 2 }} />}
          </Box>
        </>
      )}
      <CustomModal isModalOpen={isModalOpen} handleCloseModal={setIsModalOpen} mainFunction={handleDeleteItem} question='Apagar Item?' buttonText='Apagar' />
    </Box>
  );
};

export default EditItemPage;
