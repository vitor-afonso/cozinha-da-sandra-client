import React from 'react';
import { Box, Button, Rating, Typography } from '@mui/material';
import { componentProps, reviewsClasses } from '../utils/app.styleClasses';

const RatingAverage = ({ reviewsData, setIsModalOpen }) => {
  return (
    <Box sx={reviewsClasses.container}>
      <Button sx={reviewsClasses.reviewsBtn} onClick={() => setIsModalOpen(true)}>
        <Typography variant={componentProps.variant.h5}>{reviewsData.averageRating}</Typography>
        <Rating name='half-rating-read' defaultValue={reviewsData.averageRating} max={1} />
        <Typography variant={componentProps.variant.body2}>({` ${reviewsData.numberOfReviews} reviews`})</Typography>
      </Button>
    </Box>
  );
};

export default RatingAverage;
