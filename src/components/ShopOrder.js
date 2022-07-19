// jshint esversion:9

import React from 'react';
import { parseDate } from '../utils/app.utils';

export function ShopOrder({ order }) {
  const createdAt = parseDate(order.createdAt);
  const deliveredAt = parseDate(order.deliveryDate);

  return (
    <div className='ShopOrder'>
      <p>
        <b>Encomenda Nº</b>: {order._id}
      </p>
      <p>Utilizador: {order.userId.username}</p>
      <p>Telefone: {order.contact}</p>
      {order.address && <p>Morada de entrega: {order.address}</p>}
      <p>Data de criação: {createdAt}</p>
      <p>Data de entrega: {deliveredAt}</p>
      <p>Status: {order.orderStatus}</p>
      {order.message && <p>Mensagem: {order.message}</p>}
      <div>Items: {order.items.length > 0 && order.items.map((item) => <span key={item._id}> {item.name}, </span>)}</div>
      <p>Preço Total: {order.total}€</p>
      <br />
      <hr />
    </div>
  );
}
