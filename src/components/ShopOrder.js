// jshint esversion:9

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { parseDate } from '../utils/app.utils';

export function ShopOrder({ order, handleConfirmOrder }) {
  const createdAt = parseDate(order.createdAt);
  const deliveredAt = parseDate(order.deliveryDate);
  const location = useLocation();

  //fn compares dates to know if we can render confirm button
  const checkDeliveryDate = () => {
    const orderDeliveryDate = new Date(order.deliveryDate);
    const todaysDate = new Date();

    return orderDeliveryDate > todaysDate ? true : false;
  };

  const translateStatus = (status) => {
    if (status === 'pending') {
      return 'Pendente';
    } else if (status === 'confirmed') {
      return 'Confirmado';
    } else {
      return 'Rejeitado';
    }
  };

  return (
    <div className='ShopOrder'>
      <p>
        <b>ID</b>: {order._id}
      </p>
      <p>Utilizador: {order.userId.username}</p>
      <p>Telefone: {order.contact}</p>
      {order.address && <p>Morada de entrega: {order.address}</p>}
      <p>Data de criação: {createdAt}</p>
      <p>Data de entrega: {deliveredAt}</p>
      <div>
        <p>Status: {translateStatus(order.orderStatus)}</p>

        {order.orderStatus === 'pending' && (
          <>
            {checkDeliveryDate() && location.pathname === '/orders' && <button onClick={() => handleConfirmOrder(order._id)}>Confirmar</button>}

            {location.pathname === '/orders' && (
              <Link to={`/send-email/orders/${order._id}`}>
                <span>Contactar cliente</span>
              </Link>
            )}
          </>
        )}
      </div>
      {order.message && <p>Mensagem: {order.message}</p>}
      <div>Items: {order.items.length > 0 && order.items.map((item) => <span key={item._id}> {item.name}, </span>)}</div>
      <p>Preço Total: {order.total}€</p>
      <br />
      <hr />
    </div>
  );
}
