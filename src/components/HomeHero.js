import { AuthContext } from 'context/auth.context';
import { useContext } from 'react';
import { componentProps, homeClasses } from 'utils/app.styleClasses';
import heroImage from 'images/hero.svg';

import { Box, Grid, Typography } from '@mui/material';

const HomePageHero = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <Grid container spacing={0} sx={homeClasses.hero}>
      <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' }, justifyContent: { lg: 'end' } }}>
        <Box sx={{ maxWidth: { md: '600px' } }}>
          <img src={heroImage} alt='Cake' width='100%' height='auto' />
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' }, justifyContent: { lg: 'start' } }}>
        <Box sx={homeClasses.heroText}>
          <Typography variant={componentProps.variant.h2} sx={homeClasses.heroTitle}>
            {user ? `Bem-vindo ${user.username}!` : 'Bem-vindo!'}
          </Typography>
          <Typography variant={componentProps.variant.body1} sx={homeClasses.heroDescription}>
            Escolha os seus snacks preferidos e faça a sua encomenda. Com serviço de entrega e take-away. Conveniência e snacks deliciosos, à distância de um clique. 👩🏾‍🍳
          </Typography>
        </Box>
      </Grid>
      {children}
    </Grid>
  );
};

export default HomePageHero;
