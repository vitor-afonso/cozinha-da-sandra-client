// jshint esversion:9

import { ShopOrder } from './../components/ShopOrder';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateOrder } from '../api';
import { confirmOrder } from '../redux/features/orders/ordersSlice';

export const OrdersPage = () => {
  const { shopOrders, isLoading } = useSelector((store) => store.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConfirmOrder = async (orderId) => {
    try {
      let requestBody = { orderStatus: 'confirmed' };

      await updateOrder(requestBody, orderId);

      dispatch(confirmOrder({ id: orderId }));
    } catch (error) {
      console.log('Ops, Something went wrong while trying to confirm order =>', error);
    }
  };

  return (
    <div>
      <h2>Encomendas</h2>
      {isLoading && <p>Loading...</p>}
      {shopOrders.length > 0 &&
        shopOrders.map((order) => {
          return <ShopOrder key={order._id} order={order} handleConfirmOrder={handleConfirmOrder} />;
        })}
    </div>
  );
};
