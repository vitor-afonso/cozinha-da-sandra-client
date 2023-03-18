import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { homeClasses } from '../utils/app.styleClasses';
import { ShopItem } from './ShopItemCard';

const ShopItemsCategory = ({ shopItems, categoryStyles }) => {
  const navigate = useNavigate();
  const categoryName = shopItems[0].category;

  return (
    <Box className='items-doces-container' sx={categoryStyles} data-testid='items-container'>
      <Grid container spacing={2}>
        {shopItems.map((element) => {
          if (element.category === categoryName) {
            return (
              <Grid item key={element._id} xs={12} sm={6} md={4} lg={3}>
                <ShopItem {...element} />
              </Grid>
            );
          }
          return null;
        })}
      </Grid>

      <Button variant='outlined' sx={homeClasses.seeMoreBtn} onClick={() => navigate(`/${categoryName}`)}>
        Ver mais...
      </Button>
    </Box>
  );
};

export default ShopItemsCategory;
