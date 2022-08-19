// jshint esversion:9

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShopOrder } from './../components/ShopOrder';

import { Box, FormControl, Typography, Select, MenuItem, FormHelperText, Grid } from '@mui/material';
import { getShopOrders } from '../redux/features/orders/ordersSlice';

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const { shopOrders, isLoading } = useSelector((store) => store.orders);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterOption, setFilterOption] = useState('');
  const userEffectRan = useRef(false);

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
          Encomendas
        </Typography>
      </Box>

      <Box>
        <FormControl sx={{ minWidth: 300 }} size='small'>
          <Select id='demo-simple-select-helper' value={filterOption} displayEmpty inputProps={{ 'aria-label': 'Without label' }} onChange={handleFilterSelect}>
            <MenuItem value=''>Todas</MenuItem>
            <MenuItem value='pending'>Pendentes</MenuItem>
            <MenuItem value='confirmed'>Confirmadas</MenuItem>
            <MenuItem value='paid'>Pagas</MenuItem>
            <MenuItem value='delivery'>Para Entrega</MenuItem>
            <MenuItem value='takeAway'>Take Away</MenuItem>
            <MenuItem value='deliveryDate'>Data Entrega</MenuItem>
          </Select>
          <FormHelperText>Filtrar por categoria</FormHelperText>
        </FormControl>
      </Box>

      {isLoading && <p>Loading...</p>}
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <ShopOrder order={order} />
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Typography paragraph sx={{ mt: 4 }}>
                Nenhuma encomenda com o filtro seleccionado.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};
