// jshint esversion:9

import { Box, CircularProgress, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItemCard';

const ItemDetailsPage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  const [oneItem, setOneItem] = useState(null);
  const { itemId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (itemId) {
      let itemToDisplay = shopItems.find((item) => item._id === itemId);
      setOneItem(itemToDisplay);
    }
  }, [itemId]);

  return (
    <Box>
      {oneItem && (
        <Typography variant='h3' color='primary' sx={{ my: '25px' }}>
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
