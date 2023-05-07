// jshint esversion:9

import { useState } from 'react';

import { capitalizeAppName, APP } from 'utils/app.utils.js';
import { aboutClasses, componentProps } from 'utils/app.styleClasses.js';
import useAboutUsData from 'hooks/useAboutUsData.js';
import ReviewsModal from 'components/ReviewsModal.js';
import RatingAverage from 'components/RatingAverage.js';
import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { pagesRoutes } from 'utils/app.pagesRoutes';

const APP_NAME = capitalizeAppName();

const AboutPage = () => {
  const { reviewsData } = useAboutUsData();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title> Sobre nós </title>
        <meta name='description' content='Sandra, é o rosto por trás dos nossos produtos. Apaixonada pela confecção e criação de snacks tradicionais da cozinha portuguesa com sabor a África.' />
        <link rel='canonical' href={pagesRoutes.about} />
      </Helmet>
      <Box sx={aboutClasses.container}>
        <Box sx={aboutClasses.hero}>
          <Box sx={{ mt: '5vh' }}>
            <Box sx={aboutClasses.imgContainer}></Box>
            <Box sx={aboutClasses.heroText}>
              <Typography variant={componentProps.variant.h2} sx={aboutClasses.heroTitle} component={componentProps.variant.h1}>
                A dona da cozinha!
              </Typography>
              <Typography variant={componentProps.variant.body1} sx={aboutClasses.heroDescription}>
                <i>{APP.ownerName}</i>, é o rosto por trás dos nossos produtos. Apaixonada pela confecção e criação de snacks tradicionais da cozinha portuguesa com sabor a África.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ alignSelf: 'end' }}>{reviewsData && <RatingAverage setIsModalOpen={setIsReviewModalOpen} />}</Box>
        </Box>

        <Box sx={aboutClasses.bottomContainer}>
          <Typography variant={componentProps.variant.h4} sx={aboutClasses.bottomTitle} component={componentProps.variant.h3}>
            Cozinhar com gosto
          </Typography>
          <Typography variant={componentProps.variant.body1} sx={aboutClasses.bottomDescription}>
            É essa a nossa especialidade. Por trás de tudo o que fazemos está sempre a preocupação de criar algo que seja reflexo da nossa dedicação e paixão pela arte de cozinhar. De A a Z, tudo n'
            <em>{APP_NAME}</em> é comida de verdade.
          </Typography>
          <Typography variant={componentProps.variant.body1} sx={aboutClasses.bottomDescription}>
            Cozinhar bem não chega! O nosso objectivo é a cada dia melhorar e inovar na criação dos nossos produtos, com intuito de entregar algo verdadeiramente único e delicioso.
          </Typography>
          <Typography variant={componentProps.variant.body1} sx={aboutClasses.bottomDescription}>
            Com Tavira como ponto de partida, efectuamos entregas até Faro. Para outras zonas por favor entre em contacto através das nossas redes sociais ou email.
          </Typography>
        </Box>

        <ReviewsModal isModalOpen={isReviewModalOpen} setIsModalOpen={setIsReviewModalOpen} reviewsData={reviewsData} />
      </Box>
    </>
  );
};

export default AboutPage;
