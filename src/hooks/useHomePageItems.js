import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { APP, getHomePageCategoryItems } from 'utils/app.utils';

export default function useHomePageItems() {
  const { shopReviews, averageRating, numberOfReviews } = useSelector((store) => store.reviews);
  const { shopItems } = useSelector((store) => store.items);
  const [docesData, setDocesData] = useState(null);
  const [salgadosData, setSalgadosData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);

  useEffect(() => {
    if (shopReviews.length > 0) {
      setReviewsData({ averageRating, reviews: shopReviews, numberOfReviews });
    }
  }, [shopReviews, averageRating, numberOfReviews]);

  useEffect(() => {
    if (shopItems.length > 0) {
      const filteredDoces = getHomePageCategoryItems(shopItems, APP.categories.doces);
      const filteredSalgados = getHomePageCategoryItems(shopItems, APP.categories.salgados);
      setDocesData({ categoryItems: filteredDoces, categoryName: APP.categories.doces });
      setSalgadosData({ categoryItems: filteredSalgados, categoryName: APP.categories.salgados });
    }
  }, [shopItems]);

  return {
    docesData,
    salgadosData,
    reviewsData,
  };
}
