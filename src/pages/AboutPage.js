// jshint esversion:9

import { Box, Grid, Typography, Link } from '@mui/material';
import sandraImage from '../images/aboutSandra.png';
import instagramImage from '../images/instagram.svg';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import EmailIcon from '@mui/icons-material/Email';

export const AboutPage = () => {
  const aboutClasses = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '95vh',
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
      backgroundImage: `url(${sandraImage})`,
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
    social: {
      width: '100%',
      p: 3,
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Pellentesque in ipsum id orci porta dapibus.
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
            Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vestibulum ac diam sit amet quam vehicula elementum sed sit
            amet dui.
          </Typography>
          <Typography variant='body1' sx={aboutClasses.bottomDescription}>
            Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus. Vestibulum ac diam sit amet quam vehicula elementum sed
            sit amet dui. Vivamus suscipit tortor eget felis porttitor volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
        </Box>
      </Box>
      <Box sx={aboutClasses.social}>
        <Typography variant='h6' sx={aboutClasses.socialTitle}>
          Contactos
        </Typography>
        <Box sx={aboutClasses.socialContainer}>
          <Link href=''>
            <FacebookOutlinedIcon fontSize='large' sx={{ mr: 2 }} />
          </Link>
          <Link href=''>
            <img src={instagramImage} alt='Instagram' width='28px' height='auto' />
          </Link>
          <Link href='mailto:cozinhadasandra22@gmail.com'>
            <EmailIcon fontSize='large' sx={{ mt: '2px', ml: 2 }} />
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
