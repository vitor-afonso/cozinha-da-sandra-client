// jshint esversion:9

import { ShopOrder } from './../components/ShopOrder';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

export const OrdersPage = () => {
  const { shopOrders, isLoading } = useSelector((store) => store.orders);

  useEffect(() => {
    window.scrollTo(0, 0);
    //provavelmente vou ter que fazer refresh à pagina
    //para que os detalhes dos items apareçam
    //quando o admin submeter uma nova encomenda
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
