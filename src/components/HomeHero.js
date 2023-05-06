import { AuthContext } from 'context/auth.context';
import { useContext } from 'react';
import { componentProps, homeClasses } from 'utils/app.styleClasses';
import heroImage from 'images/hero.svg';

import { Box, CircularProgress, Typography } from '@mui/material';

const HomePageHero = ({ children, isLoading, msgRef }) => {
  const { user } = useContext(AuthContext);
  return (
    <Box sx={homeClasses.hero}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row', maxWidth: { md: '80vw' } }, flexGrow: 1, mt: '10vh' }}>
        <Box sx={{ mr: { md: 3 } }}>
          {!isLoading && (
            <Box sx={{ maxWidth: { md: '600px' }, mb: 4 }}>
              <img src={heroImage} alt='Cake' width='100%' height='auto' />
            </Box>
          )}
        </Box>
        <Box>
          {isLoading && (
            <Box>
              <CircularProgress size='50px' />
              <Typography paragraph variant={componentProps.variant.body1} ref={msgRef} sx={{ mt: 2, mx: 'auto', maxWidth: '300px' }}></Typography>
            </Box>
          )}
          <Box sx={homeClasses.heroText}>
            <Typography variant={componentProps.variant.h2} sx={homeClasses.heroTitle}>
              {user ? `Bem-vindo ${user.username}!` : 'Bem-vindo!'}
            </Typography>
            <Typography variant={componentProps.variant.body1} sx={homeClasses.heroDescription}>
              Escolha os seus snacks preferidos e faça a sua encomenda. Com serviço de entrega e take-away. Conveniência e snacks deliciosos, à distância de um clique. 👩🏾‍🍳
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ alignSelf: 'end' }}>{children}</Box>
    </Box>
  );
};

export default HomePageHero;
