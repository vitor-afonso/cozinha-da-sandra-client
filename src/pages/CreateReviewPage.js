import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createReview } from '../api';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { componentProps } from '../utils/app.styleClasses';
import { Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const CreateReviewPage = () => {
  const { shopOrders } = useSelector((store) => store.orders);
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      rating: '',
    },
  });

  useEffect(() => {
    if (shopOrders.length > 0 && orderId) {
      let orderToReview = shopOrders.find((item) => item._id === orderId);
      setOrder(orderToReview);
    }
  }, [shopOrders, orderId]);

  const handleReviewSubmit = async ({ title, content, rating }) => {
    setErrorMessage(undefined);
    setIsLoading(true);

    try {
      const requestBody = {
        title,
        content,
        rating: Number(rating),
        userId: user._id,
        orderId,
      };

      let response = await createReview(requestBody);
      console.log(response.data);

      setSuccessMessage('Review criado com sucesso. Obrigado =)');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Typography variant={componentProps.variant.h4} color={theme.palette.neutral.main}>
        Review
      </Typography>
    </div>
  );
};

export default CreateReviewPage;
