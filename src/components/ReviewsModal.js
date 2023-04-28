import { Box, Modal, Rating, Typography } from '@mui/material';
import React from 'react';
import { componentProps, reviewsModalStyle } from '../utils/app.styleClasses';
import { parseDateToShow } from '../utils/app.utils';

const ReviewsModal = ({ isModalOpen, setIsModalOpen, reviewsData }) => {
  return (
    <>
      {reviewsData && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box sx={reviewsModalStyle}>
            {reviewsData.reviews.map((review) => {
              return (
                <Box sx={{ width: '250px', mb: 8 }} key={review._id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 32 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant={componentProps.variant.h6} sx={{ fontSize: 18 }}>
                        {review.rating}
                      </Typography>
                      <Rating name='review-rating' defaultValue={review.rating} size='small' readOnly />
                    </Box>

                    <Typography variant={componentProps.variant.h6} sx={{ fontSize: 14 }} color={componentProps.color.textSecondary}>
                      {review.author}
                    </Typography>
                  </Box>
                  <Typography variant={componentProps.variant.h6} sx={{ fontSize: 14 }} color={componentProps.color.textSecondary}>
                    {parseDateToShow(review.createdAt)}
                  </Typography>

                  <Typography variant={componentProps.variant.h6}>{review.title}</Typography>

                  <Typography variant='body2'>{review.content}</Typography>
                </Box>
              );
            })}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ReviewsModal;
