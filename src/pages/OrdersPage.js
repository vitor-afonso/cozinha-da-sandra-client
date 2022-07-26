// jshint esversion:9

import { ShopOrder } from './../components/ShopOrder';

import { useEffect, useRef, useState } from 'react';

import { getAllOrders } from '../api';
import { useNavigate } from 'react-router-dom';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const adminEffectRan = useRef(false);

  useEffect(() => {
    if (adminEffectRan.current === false) {
      window.scrollTo(0, 0);

      (async () => {
        try {
          let { data } = await getAllOrders();
          setOrders(data);
        } catch (error) {
          console.log(error);
        }
      })();

      return () => {
        adminEffectRan.current = true;
      };
    }
  }, []);

  return (
    <div>
      <h2>Encomendas</h2>
      {orders.length === 0 && <p>Loading...</p>}
      {orders.length > 0 &&
        orders.map((order, index) => {
          return <ShopOrder key={index} order={order} />;
        })}
      <div>
        <span onClick={() => navigate(-1)}>Voltar</span>
      </div>
    </div>
  );
};
