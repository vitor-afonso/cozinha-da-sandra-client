import React, { useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { useState } from 'react';
import { createReview } from '../api';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { addReviewPageClasses, componentProps } from '../utils/app.styleClasses';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { Box, Button, CircularProgress, Rating, TextField, Typography } from '@mui/material';
import { ShopOrder } from '../components/ShopOrder';
import { addNewShopReview } from '../redux/features/reviews/reviewsSlice';

const CreateReviewPage = () => {
  const { shopOrders } = useSelector((store) => store.orders);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [ratingError, setRatingError] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const submitBtnRef = useRef(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (shopOrders.length > 0 && orderId) {
      let orderToReview = shopOrders.find((item) => item._id === orderId);
      setOrder(orderToReview);
    }
  }, [shopOrders, orderId]);

  const handleRatingChange = (event, value) => {
    setRatingValue(value);
    setRatingError(false);
    setErrorMessage(undefined);
  };

  const handleReviewSubmit = async ({ title, content }) => {
    setErrorMessage(undefined);
    setIsLoading(true);

    if (ratingValue === 0) {
      setRatingError(true);
      setErrorMessage('Avaliação em falta.');
      setIsLoading(false);
      return;
    }
    setRatingError(false);

    try {
      const requestBody = {
        author: user.username,
        title,
        content,
        rating: ratingValue,
        userId: user._id,
        orderId,
        orderItems: order.items.map((item) => item._id),
      };

      let { data } = await createReview(requestBody);

      dispatch(addNewShopReview(data.createdReview));

      setSuccessMessage('Review criado com sucesso. Obrigado =)');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={addReviewPageClasses.container}>
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
        REVIEW
      </Typography>
      {order && !successMessage && (
        <Box sx={addReviewPageClasses.form}>
          <ShopOrder order={order} />
          <form onSubmit={handleSubmit(handleReviewSubmit)} noValidate>
            <Box sx={ratingError ? addReviewPageClasses.ratingError : addReviewPageClasses.rating} align='left'>
              <Typography component='legend'>Avaliação</Typography>
              <Rating name='rating-controlled' onChange={handleRatingChange} value={ratingValue} />
            </Box>
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
                  sx={addReviewPageClasses.formField}
                  error={!!errors.title}
                  autoComplete='true'
                  autoFocus
                  {...field}
                />
              )}
            />

            <Controller
              name={componentProps.name.content}
              control={control}
              rules={{ required: 'Descrição em falta', minLength: { value: 30, message: 'Avaliação deve conter pelo menos 25 caracteres.' } }}
              render={({ field }) => (
                <TextField label='Descrição' maxRows={4} multiline sx={addReviewPageClasses.formTextArea} placeholder='Escreva aqui a descrição...' error={!!errors.content} {...field} />
              )}
            />

            <button type={componentProps.type.submit} ref={submitBtnRef} hidden>
              Enviar
            </button>
          </form>
        </Box>
      )}

      {successMessage && <SuccessMessage message={successMessage} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {errors.rating && <ErrorMessage message={errors.contact.message} />}
      {errors.title && <ErrorMessage message={errors.title.message} />}
      {errors.content && <ErrorMessage message={errors.content.message} />}

      <Box sx={{ mt: 4 }}>
        {!isLoading && successMessage && (
          <Button sx={{ mr: 1 }} onClick={() => navigate('/')}>
            Voltar
          </Button>
        )}

        {!successMessage && !isLoading && (
          <Button type={componentProps.type.button} variant={componentProps.variant.contained} onClick={() => submitBtnRef.current.click()}>
            Enviar
          </Button>
        )}

        {isLoading && !successMessage && <CircularProgress size='80px' sx={{ mt: 2, mb: 2 }} />}
      </Box>
    </Box>
  );
};

export default CreateReviewPage;
