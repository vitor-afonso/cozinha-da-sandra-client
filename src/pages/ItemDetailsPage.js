// jshint esversion:9

import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShopItem } from '../components/ShopItemCard';
import { getShopItems } from '../redux/features/items/itemsSlice';
import { componentProps } from '../utils/app.styleClasses';

const ItemDetailsPage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  const dispatch = useDispatch();
  const [oneItem, setOneItem] = useState(null);
  const { itemId } = useParams();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      dispatch(getShopItems());
      return () => {
        effectRan.current = true;
      };
    }
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (itemId) {
      let itemToDisplay = shopItems.find((item) => item._id === itemId);
      setOneItem(itemToDisplay);
    }
  }, [itemId, shopItems]);

  return (
    <Box sx={{ my: 4 }}>
      {oneItem && (
        <Typography variant={componentProps.variant.h3} color={componentProps.color.primary} sx={{ mb: 4 }}>
          {oneItem.name}
        </Typography>
      )}

      {isLoading && <CircularProgress sx={{ mt: 20 }} size='80px' />}

      {oneItem && !isLoading && <ShopItem {...oneItem} />}
    </Box>
  );
};

export default ItemDetailsPage;
