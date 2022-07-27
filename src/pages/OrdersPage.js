// jshint esversion:9

import { ShopOrder } from './../components/ShopOrder';

import { useEffect, useRef, useState } from 'react';

import { getAllOrders } from '../api';
import { useNavigate } from 'react-router-dom';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterOption, setFilterOption] = useState('');

  const navigate = useNavigate();
  const adminEffectRan = useRef(false);

  useEffect(() => {
    if (adminEffectRan.current === false) {
      window.scrollTo(0, 0);

      (async () => {
        try {
          let { data } = await getAllOrders();
          setOrders(data);
          setFilteredOrders(data);
        } catch (error) {
          console.log(error);
        }
      })();

      return () => {
        adminEffectRan.current = true;
      };
    }
  }, []);

  const handleFilterSelect = (e) => {
    setFilterOption(e.target.value);
    filterOrders(e.target.value);
  };

  const filterOrders = (filterOption) => {
    switch (filterOption) {
      case 'paid':
        let paidOrders = orders.filter((order) => {
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
        let deliveryOrders = orders.filter((order) => {
          if (order.deliveryMethod === 'delivery' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        setFilteredOrders(deliveryOrders);
        break;
      case 'takeAway':
        let takeAwayOrders = orders.filter((order) => {
          if (order.deliveryMethod === 'takeAway' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        setFilteredOrders(takeAwayOrders);
        break;
      case 'pending':
        let pendingOrders = orders.filter((order) => {
          if (order.orderStatus === 'pending' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        setFilteredOrders(pendingOrders);
        break;
      case 'confirmed':
        let confirmedOrders = orders.filter((order) => {
          if (order.orderStatus === 'confirmed' && new Date(order.deliveryDate) > new Date()) {
            return order;
          }
        });
        setFilteredOrders(confirmedOrders);
        break;
      case 'deliveryDate':
        let sortedOrders = orders.sort((a, b) => {
          return new Date(a.deliveryDate) - new Date(b.deliveryDate);
        });
        setFilteredOrders(sortedOrders);
        break;
      default:
        let allOrders = orders.sort((a, b) => {
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
      {orders.length === 0 && <p>Loading...</p>}
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
