// jshint esversion:9

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShopOrder } from './../components/ShopOrder';

import Masonry from 'react-masonry-css';

import { Box, FormControl, Typography, Select, MenuItem, FormHelperText, Grid, CircularProgress } from '@mui/material';
import { getShopOrders } from '../redux/features/orders/ordersSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { shopOrders, isLoading } = useSelector((store) => store.orders);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterOption, setFilterOption] = useState('');
  const userEffectRan = useRef(false);

  const ordersClasses = {
    breakpoints: {
      default: 4,
      1600: 3,
      1100: 2,
      700: 1,
    },
  };

  useEffect(() => {
    if (userEffectRan.current === false) {
      dispatch(getShopOrders());

      return () => {
        userEffectRan.current = true;
      };
    }
  }, [dispatch]);

  useEffect(() => {
    if (shopOrders.length > 0) {
      setFilteredOrders(shopOrders);
    }
  }, [shopOrders]);

  const handleFilterSelect = (e) => {
    setFilterOption(e.target.value);
    filterOrders(e.target.value);
  };

  const filterOrders = (filterOption) => {
    switch (filterOption) {
      case 'paid':
        let paidOrders = shopOrders.filter((order) => order.paid && new Date(order.deliveryDate) > new Date());
        paidOrders = paidOrders.sort((a, b) => {
          return new Date(a.deliveryDate) - new Date(b.deliveryDate);
        });
        setFilteredOrders(paidOrders);
        break;
      case 'delivery':
        let deliveryOrders = shopOrders.filter((order) => order.deliveryMethod === 'delivery' && new Date(order.deliveryDate) > new Date());
        setFilteredOrders(deliveryOrders);
        break;
      case 'takeAway':
        let takeAwayOrders = shopOrders.filter((order) => order.deliveryMethod === 'takeAway' && new Date(order.deliveryDate) > new Date());
        setFilteredOrders(takeAwayOrders);
        break;
      case 'pending':
        let pendingOrders = shopOrders.filter((order) => order.orderStatus === 'pending' && new Date(order.deliveryDate) > new Date());
        setFilteredOrders(pendingOrders);
        break;
      case 'confirmed':
        let confirmedOrders = shopOrders.filter((order) => order.orderStatus === 'confirmed' && new Date(order.deliveryDate) > new Date());
        setFilteredOrders(confirmedOrders);
        break;
      case 'deliveryDate':
        // because the array is frozen in strict mode, we need to copy the array before sorting it
        let sortedOrders = shopOrders.slice().sort((a, b) => {
          return new Date(a.deliveryDate) - new Date(b.deliveryDate);
        });
        setFilteredOrders(sortedOrders);
        break;
      default:
        // because the array is frozen in strict mode, we need to copy the array before sorting it
        let allOrders = shopOrders.slice().sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        setFilteredOrders(allOrders);
    }
  };

  return (
    <Box>
      <Box>
        <Typography variant='h2' color='primary' sx={{ my: '25px' }}>
          PEDIDOS
        </Typography>
      </Box>

      <Box>
        <FormControl sx={{ minWidth: 300 }} size='small'>
          <Select id='demo-simple-select-helper' value={filterOption} displayEmpty inputProps={{ 'aria-label': 'Without label' }} onChange={handleFilterSelect}>
            <MenuItem value=''>Todos</MenuItem>
            <MenuItem value='pending'>Pendentes</MenuItem>
            <MenuItem value='confirmed'>Confirmados</MenuItem>
            <MenuItem value='paid'>Pagos</MenuItem>
            <MenuItem value='delivery'>Para Entrega</MenuItem>
            <MenuItem value='takeAway'>Take Away</MenuItem>
            <MenuItem value='deliveryDate'>Data Entrega</MenuItem>
          </Select>
          <FormHelperText>Filtrar por categoria</FormHelperText>
        </FormControl>
      </Box>

      {isLoading && <CircularProgress sx={{ mt: 20 }} />}

      <Box sx={{ padding: 3 }}>
        <Masonry breakpointCols={ordersClasses.breakpoints} className='my-masonry-grid' columnClassName='my-masonry-grid_column'>
          {filteredOrders.length > 0 &&
            filteredOrders.map((order) => {
              return (
                <div key={order._id}>
                  <ShopOrder order={order} />
                </div>
              );
            })}
        </Masonry>
        {filteredOrders.length === 0 && (
          <div>
            {!isLoading && (
              <Typography paragraph sx={{ mt: 4 }}>
                Nenhum pedido com o filtro seleccionado.
              </Typography>
            )}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage;
