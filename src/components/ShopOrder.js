// jshint esversion:9

import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { parseDate } from '../utils/app.utils';

export function ShopOrder({ order, handleConfirmOrder }) {
  const { user } = useContext(AuthContext);
  const [createdAt, setCreatedAt] = useState('');
  const [deliveredAt, setDeliveredAt] = useState('');
  const [itemsQuantity, setItemsQuantity] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (order) {
      const itemsArray = getItemsQuantity(order);

      setItemsQuantity(itemsArray);
      setCreatedAt(parseDate(order.createdAt));
      setDeliveredAt(parseDate(order.deliveryDate));
    }
  }, [order]);

  const getItemsQuantity = (order) => {
    const items = {};
    const itemsArray = [];

    // creates the item(key) and updates the quantity(value) for each item
    order.items.forEach((item) => {
      items[item.name] = (items[item.name] || 0) + 1;
    });

    // creates a string from each property in the object to be added to the array
    for (let i in items) {
      itemsArray.push(`${i}: ${items[i]}`);
    }
    return itemsArray;
  };

  //fn compares dates to know if we can render confirm button
  const checkDeliveryDate = () => {
    const orderDeliveryDate = new Date(order.deliveryDate);
    const todaysDate = new Date();

    return orderDeliveryDate > todaysDate ? true : false;
  };

  const translateStatus = (status) => {
    if (status === 'pending') {
      return 'Pendente ';
    } else if (status === 'confirmed') {
      return 'Confirmado ';
    } else {
      return 'Rejeitado ';
    }
  };

  return (
    <div className='ShopOrder'>
      <p>
        <b>ID</b>: {order._id}
      </p>
      <p>
        <b>Utilizador:</b> {order.userId.username}
      </p>
      <p>
        <b>Telefone:</b> {order.contact}
      </p>
      {order.address && (
        <p>
          <b>Morada de entrega:</b> {order.address}
        </p>
      )}
      <p>
        <b>Data de criação:</b> {createdAt}
      </p>
      <p>
        <b>Data de entrega:</b> {deliveredAt}
      </p>
      <div>
        <p>
          <b>Status: </b> {translateStatus(order.orderStatus)}
          {location.pathname === '/orders' && (
            <Link to={`/send-email/orders/${order._id}`}>
              <span>Contactar cliente</span>
            </Link>
          )}
        </p>
        {order.orderStatus === 'pending' && <> {checkDeliveryDate() && location.pathname === '/orders' && <button onClick={() => handleConfirmOrder(order._id)}>Confirmar</button>} </>}
      </div>

      {order.message && (
        <p>
          <b>Mensagem:</b> {order.message}
        </p>
      )}

      <div>
        <b>Items:</b>
        {itemsQuantity.length > 0 &&
          itemsQuantity.map((item, index) => {
            return <span key={index}> {item}</span>;
          })}
      </div>
      <p>
        <b>Total:</b> {order.total}€
      </p>
      {user.userType === 'admin' && (
        <Link to={`/orders/edit/${order._id}`}>
          <span>Edit</span>
        </Link>
      )}
      <br />
      <hr />
    </div>
  );
}
