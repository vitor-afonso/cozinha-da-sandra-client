// jshint esversion:9

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { homeClasses } from 'utils/app.styleClasses';
import useHomePageItems from 'hooks/useHomePageItems';
import HomePageHero from 'components/HomeHero';
import ShopItemsCategory from 'components/ShopItemsCategory';
import showLoadingMessage from 'utils/app.utils';
import { Box, CircularProgress } from '@mui/material';
import RatingAverage from 'components/RatingAverage';
import ReviewsModal from 'components/ReviewsModal';
import { pagesRoutes } from 'utils/app.pagesRoutes';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const { docesData, salgadosData, reviewsData } = useHomePageItems();
  const { isLoading } = useSelector((store) => store.items);
  const msgRef = useRef(null);
  const effectRan = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <Helmet>
        <title>Home</title>
        <meta name='description' content='Snacks para todos os gostos e ocasiões com opção de entrega e take-away.' />
        <link rel='canonical' href={pagesRoutes.home} />
      </Helmet>
      <Box className='HomePage' sx={homeClasses.container}>
        <HomePageHero isLoading={isLoading} msgRef={msgRef}>
          {reviewsData && <RatingAverage setIsModalOpen={setIsModalOpen} />}
        </HomePageHero>
        <Box sx={homeClasses.itemsContainer}>
          {docesData?.categoryItems?.length > 0 && <ShopItemsCategory {...docesData} categoryStyles={homeClasses.docesContainer} />}
          {salgadosData?.categoryItems?.length > 0 && <ShopItemsCategory {...salgadosData} categoryStyles={homeClasses.salgadosContainer} />}
        </Box>
        {isLoading && <CircularProgress sx={{ mt: 4 }} size='80px' />}
        <ReviewsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} reviewsData={reviewsData} />
      </Box>
    </>
  );
};

export default HomePage;
