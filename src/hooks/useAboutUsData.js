import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useAboutUsData() {
  const { shopReviews, averageRating, numberOfReviews } = useSelector((store) => store.reviews);

  const [reviewsData, setReviewsData] = useState(null);

  useEffect(() => {
    if (shopReviews.length > 0) {
      setReviewsData({ averageRating, reviews: shopReviews, numberOfReviews });
    }
  }, [shopReviews, numberOfReviews, averageRating]);

  return {
    reviewsData,
  };
}
