// jshint esversion:9

import { useState } from 'react';

import { capitalizeAppName, APP } from 'utils/app.utils.js';
import instagramImage from 'images/instagram.svg';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { aboutClasses, componentProps } from 'utils/app.styleClasses.js';
import TermsModal from 'components/TermsModal.js';
import useAboutUsData from 'hooks/useAboutUsData.js';
import ReviewsModal from 'components/ReviewsModal.js';
import RatingAverage from 'components/RatingAverage.js';
import { Box, Typography, Link, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const APP_NAME = capitalizeAppName();
const MAIL_TO = `mailto:${APP.email}`;

const AboutPage = () => {
  const { reviewsData } = useAboutUsData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <Box sx={aboutClasses.container}>
      <Box sx={aboutClasses.hero}>
        <Box sx={aboutClasses.imgContainer}></Box>

        <Box>
          <Box sx={aboutClasses.heroText}>
            <Typography variant={componentProps.variant.h2} sx={aboutClasses.heroTitle}>
              A dona da cozinha!
            </Typography>
            <Typography variant={componentProps.variant.body1} sx={aboutClasses.heroDescription}>
              <i>{APP.ownerName}</i>, é o rosto por trás dos nossos produtos. Apaixonada pela confecção e criação de snacks tradicionais da cozinha portuguesa com sabor a África.
            </Typography>
          </Box>
          {reviewsData && <RatingAverage setIsModalOpen={setIsReviewModalOpen} />}
        </Box>
      </Box>

      <Box sx={aboutClasses.bottomContainer}>
        <Typography variant={componentProps.variant.h4} sx={aboutClasses.bottomTitle}>
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

      <Box sx={aboutClasses.social}>
        <Box>
          <Typography variant={componentProps.variant.h6} sx={aboutClasses.socialTitle}>
            Contactos
          </Typography>
          <Box sx={aboutClasses.socialContainer}>
            <Link href='https://www.facebook.com/A-Cozinha-da-Sandra-104480682299126/'>
              <FacebookOutlinedIcon fontSize={componentProps.fontSize.large} sx={{ mr: 2 }} color={componentProps.color.secondary} />
            </Link>
            <Link href=''>
              <img src={instagramImage} alt='Instagram' width='28px' height='auto' />
            </Link>
            <Link href={MAIL_TO}>
              <EmailIcon fontSize={componentProps.fontSize.large} sx={{ mt: '2px', ml: 2 }} />
            </Link>
          </Box>
        </Box>
        <Button type={componentProps.type.text} sx={aboutClasses.terms} onClick={() => setIsModalOpen(true)}>
          Termos e condições
        </Button>
      </Box>

      <ReviewsModal isModalOpen={isReviewModalOpen} setIsModalOpen={setIsReviewModalOpen} reviewsData={reviewsData} />

      <TermsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Box>
  );
};

export default AboutPage;
