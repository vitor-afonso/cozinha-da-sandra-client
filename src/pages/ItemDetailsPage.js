// jshint esversion:9
import { useEffect } from 'react';
import { ShopItem } from 'components/ShopItemCard';
import { componentProps } from 'utils/app.styleClasses';
import useItemDetailsPage from 'hooks/useItemDetailsPage';

import { Box, CircularProgress, Typography } from '@mui/material';

const ItemDetailsPage = () => {
  const { oneItem, isLoading } = useItemDetailsPage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
