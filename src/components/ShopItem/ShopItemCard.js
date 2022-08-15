// jshint esversion:9
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { addToCart, decreaseItemAmount, increaseItemAmount, removeFromCart } from '../../redux/features/items/itemsSlice';

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
import { Box, Button, Chip } from '@mui/material';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';

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

export const ShopItem = ({ name, _id, imageUrl, price, amount, description, deliveryMethod, category }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store) => store.items);

  const navigate = useNavigate();

  const getCategoryColor = (category) => {
    if (category === 'doces') {
      return orange[100];
    }
    return teal[100];
  };

  const cardClasses = {
    container: {
      width: 300,
      mt: 4,
    },
    avatar: {
      backgroundColor: getCategoryColor(category),
      cursor: 'pointer',
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
    dispatch(decreaseItemAmount({ id: _id, deliveryMethod }));
  };

  const handleIncrease = () => {
    dispatch(increaseItemAmount({ id: _id }));
    dispatch(addToCart({ id: _id }));
  };

  return (
    <Card sx={cardClasses.container}>
      <CardHeader
        avatar={
          <Avatar sx={cardClasses.avatar} aria-label='recipe' onClick={() => navigate(`/doces`)}>
            {category[0].toUpperCase()}
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
          <Typography sx={{ cursor: 'pointer' }} onClick={() => navigate(`/items/${_id}`)}>
            {name}
          </Typography>
        }
        subheader={category[0].toUpperCase() + category.slice(1)}
      />
      <CardMedia component='img' height='194' image={imageUrl} alt={name} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/items/${_id}`)} />
      <CardContent>
        <Box sx={cardClasses.cardContent}>
          <Chip label={`${price}€`} color='success' sx={{ mr: 1 }} />

          {!isLoggedIn && (
            <Button size='small' variant='outlined' sx={{ cursor: 'pointer' }} onClick={() => navigate(`/login`)} data-testid='go-to-login'>
              Adicionar
            </Button>
          )}

          {cartItems.includes(_id) && isLoggedIn && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <RemoveCircleOutlineOutlinedIcon fontSize='large' onClick={handleDecrease} sx={{ cursor: 'pointer', mr: 1 }} color='primary' />
              <Typography variant='span'>{amount}</Typography>
              <ControlPointOutlinedIcon fontSize='large' onClick={handleIncrease} sx={{ cursor: 'pointer', ml: 1 }} color='primary' />
            </Box>
          )}

          {isLoggedIn && (
            <Box>
              {!cartItems.includes(_id) && (
                <Button size='small' variant='outlined' sx={{ cursor: 'pointer' }} onClick={() => dispatch(addToCart({ id: _id }))}>
                  Adicionar
                </Button>
              )}
            </Box>
          )}
        </Box>

        {isLoggedIn && (
          <Box>
            {cartItems.includes(_id) && (
              <Button size='small' variant='outlined' sx={{ cursor: 'pointer', mt: 2, mb: 1 }} onClick={() => dispatch(removeFromCart({ id: _id }))}>
                Remover do carrinho
              </Button>
            )}
          </Box>
        )}
      </CardContent>
      <CardActions disableSpacing sx={{ paddingTop: 0, paddingBottom: 0, borderTop: '1px solid #E4E4E4' }}>
        <IconButton aria-label='share'>
          <ShareIcon />
        </IconButton>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography paragraph color='textSecondary'>
            {description}
          </Typography>
          <Typography paragraph color='textSecondary'>
            Ingredientes:
          </Typography>
          <Typography paragraph color='textSecondary'>
            {' '}
            - item 1
          </Typography>
          <Typography paragraph color='textSecondary'>
            {' '}
            - item 2
          </Typography>
          <Typography paragraph color='textSecondary'>
            {' '}
            - item 3
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
