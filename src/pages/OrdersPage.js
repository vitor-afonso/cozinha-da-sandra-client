// jshint esversion:9

import { ShopOrder } from './../components/ShopOrder';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

// jshint esversion:9
export const OrdersPage = () => {
  const { shopOrders, isLoading } = useSelector((store) => store.orders);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <h2>Encomendas</h2>
      {isLoading && <p>Loading...</p>}
      {shopOrders.length > 0 &&
        shopOrders.map((order) => {
          return <ShopOrder key={order._id} order={order} />;
        })}
    </div>
  );
};
