// jshint esversion:9

import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItemCard';

export const ItemDetailsPage = () => {
  const { shopItems } = useSelector((store) => store.items);
  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {shopItems.length > 0 ? (
        shopItems.map((item) => {
          if (item._id === itemId) {
            return (
              <div className='ItemDetailsPage' key={item._id}>
                <Typography variant='h3' color='primary' sx={{ my: '25px' }}>
                  {item.name}
                </Typography>
                <ShopItem {...item} />
              </div>
            );
          }
        })
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
