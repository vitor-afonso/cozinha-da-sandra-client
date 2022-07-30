// jshint esversion:9

import { ShopOrder } from './../components/ShopOrder';

import { useEffect, useRef, useState } from 'react';

import { getAllOrders } from '../api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getShopOrders } from '../redux/features/orders/ordersSlice';

export const OrdersPage = () => {
  const { shopOrders, isLoading } = useSelector((store) => store.orders);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterOption, setFilterOption] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminEffectRan = useRef(false);

  useEffect(() => {
    if (adminEffectRan.current === false) {
      dispatch(getShopOrders());
      return () => {
        adminEffectRan.current = true;
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
        let paidOrders = shopOrders.filter((order) => {
          if (order.paid && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        paidOrders = paidOrders.sort((a, b) => {
          return new Date(a.deliveryDate) - new Date(b.deliveryDate);
        });
        setFilteredOrders(paidOrders);
        break;
      case 'delivery':
        let deliveryOrders = shopOrders.filter((order) => {
          if (order.deliveryMethod === 'delivery' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        setFilteredOrders(deliveryOrders);
        break;
      case 'takeAway':
        let takeAwayOrders = shopOrders.filter((order) => {
          if (order.deliveryMethod === 'takeAway' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        setFilteredOrders(takeAwayOrders);
        break;
      case 'pending':
        let pendingOrders = shopOrders.filter((order) => {
          if (order.orderStatus === 'pending' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        setFilteredOrders(pendingOrders);
        break;
      case 'confirmed':
        let confirmedOrders = shopOrders.filter((order) => {
          if (order.orderStatus === 'confirmed' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
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
    <div>
      <h2>Encomendas</h2>
      <div>
        <label htmlFor='filterOrders'>Filtrar encomendas por: </label>
        <select value={filterOption} name='filterOrders' onChange={(e) => handleFilterSelect(e)}>
          <option value=''>Todas</option>
          <option value='pending'>Pendentes</option>
          <option value='confirmed'>Confirmadas</option>
          <option value='paid'>Pago</option>
          <option value='delivery'>Proximas Entregas</option>
          <option value='takeAway'>Take Away</option>
          <option value='deliveryDate'>Data de entrega</option>
        </select>
      </div>
      {isLoading && <p>Loading...</p>}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order, index) => {
          return <ShopOrder key={index} order={order} />;
        })
      ) : (
        <p>0 encomendas para o filtro seleccionado</p>
      )}
      <div>
        <span onClick={() => navigate(-1)}>Voltar</span>
      </div>
    </div>
  );
};
