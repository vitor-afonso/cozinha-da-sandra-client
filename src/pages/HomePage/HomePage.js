// jshint esversion:9
import { AuthContext } from '../../context/auth.context';
import { useEffect, useContext, useState } from 'react';

import { ShopItem } from '../../components/ShopItem/ShopItemCard';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, Grid } from '@mui/material';
import { orange, teal } from '@mui/material/colors';

export const HomePage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn, user } = useContext(AuthContext);
  const [shopItemsDoces, setShopItemsDoces] = useState([]);
  const [shopItemsSalgados, setShopItemsSalgados] = useState([]);

  const navigate = useNavigate();

  const homeClasses = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    itemsContainer: {
      width: '100%',
    },
    docesContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px: 4,
    },
    salgadosContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px: 4,
      pb: 6,
    },
    seeMoreDoces: {
      mt: 2,
      alignSelf: 'end',
    },
    seeMoreSalgados: {
      my: 2,
      alignSelf: 'end',
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let docesCount = 0;
    let salgadosCount = 0;

    if (shopItems.length > 0) {
      const filteredDoces = shopItems.filter((item) => {
        if (docesCount < 4 && item.category === 'doces') {
          docesCount++;
          return item;
        }
      });

      const filteredSalgados = shopItems.filter((item) => {
        if (salgadosCount < 4 && item.category === 'salgados') {
          salgadosCount++;
          return item;
        }
      });
      setShopItemsDoces(filteredDoces);
      setShopItemsSalgados(filteredSalgados);
    }
  }, [shopItems]);

  return (
    <Box className='HomePage' sx={homeClasses.container}>
      {isLoggedIn ? <div>Olá {user.username}!</div> : <div>Please log in</div>}
      {isLoading && <p>Loading...</p>}

      {shopItemsDoces.length > 0 && shopItemsSalgados.length > 0 && (
        <Box className='shop-items-container' sx={homeClasses.itemsContainer} data-testid='shop-items-container'>
          <Box className='items-doces-container' sx={homeClasses.docesContainer} data-testid='items-container'>
            <Grid container spacing={2}>
              {shopItemsDoces.map((element) => {
                if (element.category === 'doces') {
                  return (
                    <Grid item key={element._id} xs={12} md={4} lg={3}>
                      <ShopItem {...element} />
                    </Grid>
                  );
                }
              })}
            </Grid>

            <Button variant='outlined' sx={homeClasses.seeMoreDoces} onClick={() => navigate('/doces')}>
              Ver mais...
            </Button>
          </Box>

          <Box className='items-salgados-container' sx={homeClasses.salgadosContainer} data-testid='items-container'>
            <Grid container spacing={2}>
              {shopItemsSalgados.map((element) => {
                if (element.category === 'salgados') {
                  return (
                    <Grid item key={element._id} xs={12} md={4} lg={3}>
                      <ShopItem {...element} />
                    </Grid>
                  );
                }
              })}
            </Grid>
            <Button variant='outlined' sx={homeClasses.seeMoreSalgados} onClick={() => navigate('/salgados')}>
              Ver mais...
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
