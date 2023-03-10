// jshint esversion:9

import { capitalizeAppName, APP } from '../utils/app.utils.js';
import mapImage from '../images/aboutMap.png';
import ownerImage from '../images/aboutChef.jpeg';
import instagramImage from '../images/instagram.svg';

import { Box, Grid, Typography, Link } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailIcon from '@mui/icons-material/Email';

const APP_NAME = capitalizeAppName();
const MAIL_TO = `mailto:${APP.email}`;

const AboutPage = () => {
  const aboutClasses = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '90vh',
    },
    hero: {
      width: '100%',
      padding: 3,
      backgroundImage: 'linear-gradient(to bottom right, #ffe0b2, #b2dfdb)',
    },
    imgContainer: {
      border: '5px solid #816E94',
      borderRadius: '50%',
      width: '300px',
      height: '300px',
      mx: 'auto',
      mt: { xs: 2, md: 0 },
      backgroundImage: `url(${ownerImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    heroText: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      py: 3,
    },
    heroTitle: {
      fontSize: 50,
      fontWeight: 'bold',
      color: '#031D44',
      pb: 2,
      //whiteSpace: 'nowrap',
    },
    heroDescription: {
      fontSize: '16px',
      color: '#031D44',
      maxWidth: '600px',
    },
    bottom: {
      width: '100%',
      display: 'flex',
      justifyContent: { md: 'flex-start', xs: 'center' },
      padding: 3,
    },
    bottomContainer: {
      pt: 3,
      px: 3,
      maxWidth: '600px',
    },
    bottomTitle: {
      fontWeight: 'bold',
      color: '#031D44',
      pb: 2,
      textAlign: { md: 'left' },
    },
    bottomDescription: {
      fontSize: '16px',
      color: '#031D44',
      mb: 3,
      mx: 'auto',
      textAlign: 'left',
    },
    mapImg: {
      width: '100%',
      height: '400px',

      backgroundImage: `url(${mapImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    social: {
      width: '100%',
      py: 1,
      px: 3,
      backgroundImage: 'linear-gradient(to bottom right, #b2dfdb, #fff)',
      alignSelf: 'flex-end',
    },
    socialContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '200px',
    },
    socialTitle: {
      fontWeight: 'bold',
      color: '#031D44',
      pb: 1,
      textAlign: 'left',
    },
  };

  return (
    <Box sx={aboutClasses.container}>
      <Grid container spacing={0} sx={aboutClasses.hero}>
        <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' }, justifyContent: { lg: 'end' } }}>
          <Box sx={aboutClasses.imgContainer}></Box>
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
