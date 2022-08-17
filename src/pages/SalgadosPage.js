// jshint esversion:9

import { Box, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ShopItem } from '../components/ShopItem/ShopItemCard';

export const SalgadosPage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ px: 3, mb: 12 }}>
      <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
        SALGADOS
      </Typography>

      {isLoading && <p>Loading...</p>}

      {shopItems.length !== 0 && (
        <Grid container spacing={2}>
          {shopItems.map((element) => {
            if (element.category === 'salgados') {
              return (
                <Grid item key={element._id} xs={12} sm={6} md={4} lg={3}>
                  <ShopItem {...element} />
                </Grid>
              );
            }
          })}
        </Grid>
      )}
    </Box>
  );
};
