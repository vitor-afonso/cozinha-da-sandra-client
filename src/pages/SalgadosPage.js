// jshint esversion:9

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ShopItem } from 'components/ShopItemCard';
import { Box, CircularProgress, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { componentProps, salgadosClasses } from 'utils/app.styleClasses';

const SalgadosPage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  const [str, setStr] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (str === '' && shopItems.length > 0) {
      setFilteredItems(shopItems);
    } else {
      let filteredItems = shopItems.filter((item) => item.name.toLowerCase().includes(str.toLowerCase()));
      setFilteredItems(filteredItems);
    }
  }, [str, shopItems]);

  return (
    <Box sx={salgadosClasses.container}>
      <Typography variant={componentProps.variant.h2} color={componentProps.color.primary} sx={{ my: 4 }}>
        SALGADOS
      </Typography>

      <TextField
        label='Procurar'
        type={componentProps.type.text}
        variant={componentProps.variant.outlined}
        fullWidth
        sx={salgadosClasses.field}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
        }}
        onChange={(e) => setStr(e.target.value)}
        autoComplete='true'
      />

      {isLoading && <CircularProgress sx={{ mt: 20 }} />}

      {filteredItems.length !== 0 && (
        <Grid container spacing={2}>
          {filteredItems.map((element) => {
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
      )}
      {filteredItems.length === 0 && (
        <Typography paragraph color={componentProps.color.neutral} sx={{ my: 4 }}>
          Nenhum item encontrado.
        </Typography>
      )}
    </Box>
  );
};

export default SalgadosPage;
