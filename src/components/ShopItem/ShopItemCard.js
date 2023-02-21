// jshint esversion:9
import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { addToCart, decreaseItemAmount, increaseItemAmount, removeFromCart } from '../../redux/features/items/itemsSlice';
import { RWebShare } from 'react-web-share';

/********************** MUI *************************/
import * as React from 'react';
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
import { grey, orange, teal } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useEffect } from 'react';

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

  const getCategoryColor = (category) => {
    if (category === 'doces') {
      return orange[50];
    }
    return teal[50];
  };

  const cardClasses = {
    container: {
      maxWidth: 300,
      mx: 'auto',
      //mt: 2,
      backgroundColor: getCategoryColor(category),
    },
    avatar: {
      backgroundColor: '#FFF',
      cursor: 'pointer',
    },
    avatarLetter: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    editBtn: {
      color: grey[700],
      cursor: 'pointer',
      mt: 1,
    },
    cardContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    <Card sx={cardClasses.container}>
      <CardHeader
        avatar={
          <Avatar sx={cardClasses.avatar} aria-label='recipe' onClick={() => navigate(`/${category}`)}>
            <Typography color='primary' sx={cardClasses.avatarLetter}>
              {category[0].toUpperCase()}
            </Typography>
          </Avatar>
        }
        action={
          isLoggedIn &&
          user.userType === 'admin' && (
            <Button size='small' sx={cardClasses.editBtn} onClick={() => navigate(`/items/edit/${_id}`)}>
              Editar
            </Button>
          )
        }
        title={
          <Typography sx={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate(`/items/${_id}`)} color='primary'>
            {name}
          </Typography>
        }
        subheader={category[0].toUpperCase() + category.slice(1)}
      />
      <CardMedia component='img' height='194' image={imageUrl} alt={name} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/items/${_id}`)} />
      <CardContent>
        <Box sx={cardClasses.cardContent}>
          <Typography sx={{ mr: 1, fontSize: '20px' }} color='neutral' onClick={() => navigate(`/items/${_id}`)}>
            {price}€
          </Typography>

          {!isLoggedIn && (
            <Button size='small' variant='contained' sx={{ cursor: 'pointer' }} color='neutral' onClick={() => navigate(`/login`)} data-testid='go-to-login'>
              Adicionar
            </Button>
          )}

          {cartItems.includes(_id) && isLoggedIn && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <RemoveCircleIcon fontSize='large' onClick={handleDecrease} sx={{ cursor: 'pointer', mr: 1 }} color='neutral' />
              <Typography variant='span' sx={{ fontSize: '20px' }} color='neutral'>
                {amount}
              </Typography>
              <AddCircleIcon fontSize='large' onClick={handleIncrease} sx={{ cursor: 'pointer', ml: 1 }} color='neutral' />
            </Box>
          )}

          {isLoggedIn && (
            <Box>
              {!cartItems.includes(_id) && (
                <Button size='small' variant='contained' sx={{ cursor: 'pointer', fontWeight: 'bold' }} color='neutral' onClick={() => dispatch(addToCart({ id: _id }))}>
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
              <ShareIcon color='neutral' />
            </IconButton>
          </RWebShare>
          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
            <ExpandMoreIcon color='neutral' />
          </ExpandMore>
        </CardActions>
      )}
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography paragraph color='textSecondary' sx={{ textAlign: 'left' }}>
            {description}
          </Typography>
          <Typography paragraph sx={{ textAlign: 'left', fontWeight: 'bold' }} color='primary'>
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
