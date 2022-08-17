// jshint esversion:9

import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShopItem } from '../components/ShopItem/ShopItemCard';

export const DocesPage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);

  const docesClasses = {
    container: {
      px: 3,
      mb: 12,
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={docesClasses.container}>
      <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
        DOCES
      </Typography>

      {isLoading && <CircularProgress sx={{ mt: 20 }} />}

      {shopItems.length !== 0 && (
        <Grid container spacing={2}>
          {shopItems.map((element) => {
            if (element.category === 'doces') {
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
