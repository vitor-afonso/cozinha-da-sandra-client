// jshint esversion:9

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { homeClasses } from '../utils/app.styleClasses';
import useHomePageItems from '../hooks/useHomePageItems';
import HomePageHero from '../components/HomeHero';
import ShopItemsCategory from '../components/ShopItemsCategory';

import { Box, CircularProgress } from '@mui/material';

const HomePage = () => {
  const { shopItemsDoces, shopItemsSalgados } = useHomePageItems();
  const { isLoading } = useSelector((store) => store.items);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className='HomePage' sx={homeClasses.container}>
      <HomePageHero />
      <Box className='shop-items-container' sx={homeClasses.itemsContainer} data-testid='shop-items-container'>
        {shopItemsDoces.length > 0 && <ShopItemsCategory shopItems={shopItemsDoces} categoryStyles={homeClasses.docesContainer} />}
        {shopItemsSalgados.length > 0 && <ShopItemsCategory shopItems={shopItemsSalgados} categoryStyles={homeClasses.salgadosContainer} />}
      </Box>
      {isLoading && <CircularProgress sx={{ mt: 20 }} size='80px' />}
    </Box>
  );
};

export default HomePage;
