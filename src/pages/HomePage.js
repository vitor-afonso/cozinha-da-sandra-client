// jshint esversion:9
import { AuthContext } from '../context/auth.context';
import { useEffect, useContext } from 'react';
import heroImage from '../images/hero.svg';

import { ShopItem } from '../components/ShopItemCard';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { homeClasses } from '../utils/app.styleClasses';
import useHomePageItems from '../hooks/useHomePageItems';

const HomePage = () => {
  const { shopItemsDoces, shopItemsSalgados } = useHomePageItems();
  const { user } = useContext(AuthContext);
  const { isLoading } = useSelector((store) => store.items);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box className='HomePage' sx={homeClasses.container}>
      <Grid container spacing={0} sx={homeClasses.hero}>
        <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' }, justifyContent: { lg: 'end' } }}>
          <Box sx={{ maxWidth: { md: '600px' } }}>
            <img src={heroImage} alt='Cake' width='100%' height='auto' />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: { lg: 'flex' }, justifyContent: { lg: 'start' } }}>
          <Box sx={homeClasses.heroText}>
            <Typography variant='h2' sx={homeClasses.heroTitle}>
              {user ? `Bem-vindo ${user.username}!` : 'Bem-vindo!'}
            </Typography>
            <Typography variant='body1' sx={homeClasses.heroDescription}>
              Escolha os seus snacks preferidos e faça a sua encomenda. Com serviço de entrega e take-away. Conveniência e snacks deliciosos, à distância de um clique. 👩🏾‍🍳
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {isLoading && <CircularProgress sx={{ mt: 20 }} />}

      <Box className='shop-items-container' sx={homeClasses.itemsContainer} data-testid='shop-items-container'>
        {shopItemsDoces.length > 0 && (
          <Box className='items-doces-container' sx={homeClasses.docesContainer} data-testid='items-container'>
            <Grid container spacing={2}>
              {shopItemsDoces.map((element) => {
                if (element.category === 'doces') {
                  return (
                    <Grid item key={element._id} xs={12} sm={6} md={4} lg={3}>
                      <ShopItem {...element} />
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>

            <Button variant='outlined' sx={homeClasses.seeMoreBtn} onClick={() => navigate('/doces')}>
              Ver mais...
            </Button>
          </Box>
        )}

        {shopItemsSalgados.length > 0 && (
          <Box className='items-salgados-container' sx={homeClasses.salgadosContainer} data-testid='items-container'>
            <Grid container spacing={2}>
              {shopItemsSalgados.map((element) => {
                if (element.category === 'salgados') {
                  return (
                    <Grid item key={element._id} xs={12} sm={6} md={4} lg={3}>
                      <ShopItem {...element} />
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>
            <Button variant='outlined' sx={homeClasses.seeMoreBtn} onClick={() => navigate('/salgados')}>
              Ver mais...
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
