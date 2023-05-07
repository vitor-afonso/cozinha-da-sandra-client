// jshint esversion:9
import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'context/auth.context';
import { addToCart, decreaseItemAmount, increaseItemAmount, removeFromCart } from 'redux/features/items/itemsSlice';
import { RWebShare } from 'react-web-share';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { orange, teal } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { APP } from 'utils/app.utils';
import { cardClasses, componentProps } from 'utils/app.styleClasses';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

/****************************************************/

export const ShopItem = ({ name, _id, imageUrl, price, amount, description, category, ingredients }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store) => store.items);
  const [ingredientsList, setIngredientsList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (ingredients) {
      let allingredients = formatIngredients(ingredients);
      setIngredientsList(allingredients);
      if (location.pathname === `/items/${_id}`) {
        handleExpandClick();
      }
    }
  }, [ingredients, _id]);

  const formatIngredients = (list) => {
    let filteredList = list.split(',').filter((element) => element.length > 0);

    let trimmedList = filteredList.map((element) => element.trim());

    let upperList = trimmedList.map((element) => element[0].toUpperCase() + element.slice(1));

    return upperList;
  };

  /********************** CARD MUI *************************/
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  /****************************************************/

  const handleDecrease = () => {
    if (amount === 1) {
      dispatch(removeFromCart({ id: _id }));
      return;
    }
    dispatch(decreaseItemAmount({ id: _id }));
  };

  const handleIncrease = () => {
    dispatch(increaseItemAmount({ id: _id }));
    dispatch(addToCart({ id: _id }));
  };

  return (
    <Card sx={{ maxWidth: 300, mx: 'auto', backgroundColor: category === 'doces' ? orange[50] : teal[50] }}>
      <CardHeader
        avatar={
          <Avatar sx={cardClasses.avatar} onClick={() => navigate(`/${category}`)}>
            <Typography color={componentProps.color.primary} sx={cardClasses.avatarLetter}>
              {category[0].toUpperCase()}
            </Typography>
          </Avatar>
        }
        action={
          isLoggedIn &&
          user.userType === 'admin' && (
            <Button size={componentProps.size.small} sx={cardClasses.editBtn} onClick={() => navigate(`/items/edit/${_id}`)}>
              Editar
            </Button>
          )
        }
        title={
          <Typography sx={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate(`/items/${_id}`)} color={componentProps.color.primary}>
            {name}
          </Typography>
        }
        subheader={category[0].toUpperCase() + category.slice(1)}
      />
      <CardMedia component='img' height='194' width='281' image={imageUrl} alt={name} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/items/${_id}`)} />
      <CardContent>
        <Box sx={cardClasses.cardContent}>
          <Typography sx={{ mr: 1, fontSize: '20px' }} color={componentProps.color.neutral} onClick={() => navigate(`/items/${_id}`)}>
            {price + APP.currency}
          </Typography>

          {!isLoggedIn && (
            <Button
              size={componentProps.size.small}
              variant={componentProps.variant.contained}
              sx={{ cursor: 'pointer' }}
              color={componentProps.color.neutral}
              onClick={() => navigate(`/login`)}
              data-testid='go-to-login'
            >
              Adicionar
            </Button>
          )}

          {cartItems.includes(_id) && isLoggedIn && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <RemoveCircleIcon fontSize={componentProps.fontSize.large} onClick={handleDecrease} sx={{ cursor: 'pointer', mr: 1 }} color={componentProps.color.neutral} />
              <Typography variant='span' sx={{ fontSize: '20px' }} color={componentProps.color.neutral}>
                {amount}
              </Typography>
              <AddCircleIcon fontSize={componentProps.fontSize.large} onClick={handleIncrease} sx={{ cursor: 'pointer', ml: 1 }} color={componentProps.color.neutral} />
            </Box>
          )}

          {isLoggedIn && (
            <Box>
              {!cartItems.includes(_id) && (
                <Button
                  size={componentProps.size.small}
                  variant={componentProps.variant.contained}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  color={componentProps.color.neutral}
                  onClick={() => dispatch(addToCart({ id: _id }))}
                >
                  Adicionar
                </Button>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
      {!location.pathname.includes('/orders') && !location.pathname.includes('/cart') && (
        <CardActions disableSpacing sx={{ paddingTop: 0, paddingBottom: 0, borderTop: '1px solid #E4E4E4' }}>
          <RWebShare
            data={{
              text: name,
              url: `https://acozinhadasandra.netlify.app/items/${_id}`,
              title: 'Share',
            }}
            onClick={() => console.log('Shared successfully!')}
          >
            <IconButton aria-label='share'>
              <ShareIcon color={componentProps.color.neutral} />
            </IconButton>
          </RWebShare>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
            <ExpandMoreIcon color={componentProps.color.neutral} />
          </ExpandMore>
        </CardActions>
      )}
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography paragraph color='textSecondary' sx={{ textAlign: 'left' }}>
            {description}
          </Typography>
          <Typography paragraph sx={{ textAlign: 'left', fontWeight: 'bold' }} color={componentProps.color.primary}>
            Ingredientes:
          </Typography>
          {ingredientsList.length > 0 &&
            ingredientsList.map((ingredient, index) => (
              <Typography key={index} sx={{ textAlign: 'left' }} color='textSecondary'>
                - {ingredient.trim()[0] + ingredient.slice(1).toLowerCase()}
              </Typography>
            ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};
