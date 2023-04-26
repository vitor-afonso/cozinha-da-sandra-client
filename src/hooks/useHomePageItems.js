import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { APP, getHomePageCategoryItems } from '../utils/app.utils';

export default function useHomePageItems() {
  const { shopOrders } = useSelector((store) => store.orders);
  const { shopItems } = useSelector((store) => store.items);
  const [docesData, setDocesData] = useState(null);
  const [salgadosData, setSalgadosData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);

  useEffect(() => {
    if (shopOrders.length > 0) {
      const allReviews = shopOrders.filter((order) => order.reviewId).map((order) => order.reviewId);
      const ratingTotal = allReviews.reduce((accumulator, review) => accumulator + review.rating, 0);
      setReviewsData({ average: Math.round(ratingTotal / allReviews.length / 0.5) * 0.5, reviews: allReviews });
    }
  }, [shopOrders]);

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
