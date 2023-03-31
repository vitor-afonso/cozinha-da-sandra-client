import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { componentProps, homeClasses } from '../utils/app.styleClasses';
import { ShopItem } from './ShopItemCard';

const ShopItemsCategory = ({ categoryItems, categoryName, categoryStyles }) => {
  const navigate = useNavigate();

  return (
    <Box className='items-doces-container' sx={categoryStyles} data-testid='items-container'>
      <Grid container spacing={2}>
        {categoryItems.map((element) => {
          return (
            <Grid item key={element._id} xs={12} sm={6} md={4} lg={3}>
              <ShopItem {...element} />
            </Grid>
          );
        })}
      </Grid>

      <Button variant={componentProps.variant.outlined} sx={homeClasses.seeMoreBtn} onClick={() => navigate(`/${categoryName}`)}>
        Ver mais...
      </Button>
    </Box>
  );
};

export default ShopItemsCategory;
