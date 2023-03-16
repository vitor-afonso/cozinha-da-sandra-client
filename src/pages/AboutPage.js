// jshint esversion:9

import Tilt from 'react-parallax-tilt';
import { capitalizeAppName, APP } from '../utils/app.utils.js';
import instagramImage from '../images/instagram.svg';

import { Box, Grid, Typography, Link } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailIcon from '@mui/icons-material/Email';
import { aboutClasses } from '../utils/app.styleClasses.js';

const APP_NAME = capitalizeAppName();
const MAIL_TO = `mailto:${APP.email}`;

const AboutPage = () => {
  return (
    <Box sx={aboutClasses.container}>
      <Grid container spacing={0} sx={aboutClasses.hero}>
        <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' }, justifyContent: { lg: 'center' } }}>
          <Tilt>
            <Box sx={aboutClasses.imgContainer}></Box>
          </Tilt>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' }, justifyContent: { lg: 'start' } }}>
          <Box sx={aboutClasses.heroText}>
            <Typography variant='h2' sx={aboutClasses.heroTitle}>
              A dona da cozinha!
            </Typography>
            <Typography variant='body1' sx={aboutClasses.heroDescription}>
              <i>{APP.ownerName}</i>, é o rosto por trás dos nossos produtos. Apaixonada pela confecção e criação de snacks tradicionais da cozinha portuguesa com sabor a África.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={aboutClasses.bottom}>
        <Box sx={aboutClasses.bottomContainer}>
          <Typography variant='h4' sx={aboutClasses.bottomTitle}>
            Cozinhar com gosto
          </Typography>
          <Typography variant='body1' sx={aboutClasses.bottomDescription}>
            É essa a nossa especialidade. Por trás de tudo o que fazemos está sempre a preocupação de criar algo que seja reflexo da nossa dedicação e paixão pela arte de cozinhar. De A a Z, tudo n'
            <em>{APP_NAME}</em> é comida de verdade.
          </Typography>
          <Typography variant='body1' sx={aboutClasses.bottomDescription}>
            Cozinhar bem não chega! O nosso objectivo é a cada dia melhorar e inovar na criação dos nossos produtos, com intuito de entregar algo verdadeiramente único e delicioso.
          </Typography>
          <Typography variant='body1' sx={aboutClasses.bottomDescription}>
            Com Tavira como ponto de partida, efectuamos entregas até Faro. Para outras zonas por favor entre em contacto através das nossas redes sociais ou email.
          </Typography>
        </Box>
      </Box>
      <Box sx={aboutClasses.mapImg}></Box>
      <Box sx={aboutClasses.social}>
        <Typography variant='h6' sx={aboutClasses.socialTitle}>
          Contactos
        </Typography>
        <Box sx={aboutClasses.socialContainer}>
          <Link href='https://www.facebook.com/A-Cozinha-da-Sandra-104480682299126/'>
            <FacebookOutlinedIcon fontSize='large' sx={{ mr: 2 }} color='secondary' />
          </Link>
          <Link href=''>
            <img src={instagramImage} alt='Instagram' width='28px' height='auto' />
          </Link>
          <Link href={MAIL_TO}>
            <EmailIcon fontSize='large' sx={{ mt: '2px', ml: 2 }} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;
