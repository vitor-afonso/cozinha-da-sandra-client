// jshint esversion:9

import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItemCard';
import { getShopItems } from '../redux/features/items/itemsSlice';

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
    <Box sx={{ my: '25px' }}>
      {oneItem && (
        <Typography variant='h3' color='primary'>
          {oneItem.name}
        </Typography>
      )}
      {isLoading && <CircularProgress sx={{ mt: 20 }} />}

      {oneItem && (
        <>
          <ShopItem {...oneItem} />
        </>
      )}
    </Box>
  );
};

export default ItemDetailsPage;
