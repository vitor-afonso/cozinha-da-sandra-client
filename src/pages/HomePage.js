// jshint esversion:9

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { homeClasses } from '../utils/app.styleClasses';
import useHomePageItems from '../hooks/useHomePageItems';
import HomePageHero from '../components/HomeHero';
import ShopItemsCategory from '../components/ShopItemsCategory';
import showLoadingMessage from '../utils/app.utils';

import { Box, CircularProgress, Typography } from '@mui/material';

const HomePage = () => {
  const { docesData, salgadosData } = useHomePageItems();
  const { isLoading } = useSelector((store) => store.items);
  const msgRef = useRef(null);
  const effectRan = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (effectRan.current === false) {
      if (isLoading && msgRef) {
        setTimeout(() => {
          showLoadingMessage(msgRef, 0, 100);
        }, 4000);
      }

      return () => {
        effectRan.current = true;
      };
    }
  }, [msgRef]);

  return (
    <Box className='HomePage' sx={homeClasses.container}>
      <HomePageHero />
      <Box className='shop-items-container' sx={homeClasses.itemsContainer}>
        {docesData?.categoryItems?.length > 0 && <ShopItemsCategory {...docesData} categoryStyles={homeClasses.docesContainer} />}
        {salgadosData?.categoryItems?.length > 0 && <ShopItemsCategory {...salgadosData} categoryStyles={homeClasses.salgadosContainer} />}
      </Box>
      {isLoading && (
        <>
          <CircularProgress sx={{ mt: 4 }} size='80px' />
          <Typography paragraph variant='body1' ref={msgRef} sx={{ mt: 4, mx: 'auto', maxWidth: '300px' }}></Typography>
        </>
      )}
    </Box>
  );
};

export default HomePage;
