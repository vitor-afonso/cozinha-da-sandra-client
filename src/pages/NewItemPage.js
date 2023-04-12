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
import { useForm } from 'react-hook-form';
import SuccessMessage from '../components/SuccessMessage';

const NewItemPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const inputFileUploadRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const submitFormRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: '',
      price: '',
      description: '',
      ingredients: '',
    },
  });

  useEffect(() => {
    setTempImageUrl(defaultProductImage);
  }, []);

  const handleItemSubmit = async ({ title, price, category, description, ingredients }) => {
    if (!objImageToUpload) {
      setErrorMessage('Por favor adicione imagem.');
      return;
    }

    setIsLoading(true);

    try {
      const uploadData = new FormData();

      uploadData.append('imageUrl', objImageToUpload);

      let { fileUrl } = await uploadImage(uploadData);

      const requestBody = { name: title, category, imageUrl: fileUrl, description, ingredients, price: Number(price) };

      let { data } = await createItem(requestBody);

      dispatch(addNewShopItem(data));

      setSuccessMessage('Item criado com sucesso.');

      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
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
            handleRHFSubmit={handleSubmit}
            handleItemSubmit={handleItemSubmit}
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
      )}

      {successMessage && <SuccessMessage message={successMessage} />}

      <Box>
        {!isLoading && (
          <Button sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        )}

        {!successMessage && !isLoading && (
          <>
            <Button sx={{ mr: 1 }} type={componentProps.type.button} variant={componentProps.variant.outlined} endIcon={<AddIcon />} onClick={() => inputFileUploadRef.current.click()}>
              Imagem
            </Button>
            <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitFormRef.current.click()}>
              Criar
            </Button>
          </>
        )}
        {isLoading && !successMessage && <CircularProgress size='80px' sx={{ mb: 2 }} />}
      </Box>
    </Box>
  );
};

export default NewItemPage;
