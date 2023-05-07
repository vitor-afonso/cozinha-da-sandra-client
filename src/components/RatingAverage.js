import React from 'react';
import { Box, Button, Rating, Typography } from '@mui/material';
import { componentProps, reviewsClasses } from 'utils/app.styleClasses';
import { useSelector } from 'react-redux';

const RatingAverage = ({ setIsModalOpen }) => {
  const { averageRating, numberOfReviews } = useSelector((store) => store.reviews);
  return (
    <Box sx={reviewsClasses.container}>
      <Button sx={reviewsClasses.reviewsBtn} onClick={() => setIsModalOpen(true)}>
        <Typography variant={componentProps.variant.h5} component={componentProps.variant.h2}>
          {averageRating}
        </Typography>
        <Rating name='rating-average' defaultValue={averageRating} max={1} readOnly />
        <Typography variant={componentProps.variant.body1} sx={{ textTransform: 'lowercase', fontSize: 16 }}>
          ({` ${numberOfReviews} reviews`})
        </Typography>
      </Button>
    </Box>
  );
};

export default RatingAverage;
