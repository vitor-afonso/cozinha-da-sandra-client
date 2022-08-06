// jshint esversion:9

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { sendEmail, updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { confirmOrder, confirmPayment } from '../redux/features/orders/ordersSlice';
import { getItemsPrice, getItemsQuantity, parseDateToShow } from '../utils/app.utils';

export function ShopOrder({ order }) {
  const { user } = useContext(AuthContext);
  const [createdAt, setCreatedAt] = useState('');
  const [deliveredAt, setDeliveredAt] = useState('');
  const [itemsQuantity, setItemsQuantity] = useState([]);
  const [itemsPrice, setItemsPrice] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (order) {
      const itemsQuantityArray = getItemsQuantity(order);
      const itemsPriceArray = getItemsPrice(order);

      setItemsQuantity(itemsQuantityArray);
      setItemsPrice(itemsPriceArray);
      setCreatedAt(parseDateToShow(order.createdAt));
      setDeliveredAt(parseDateToShow(order.deliveryDate));
    }
  }, [order]);

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

  const handleConfirmOrder = async () => {
    try {
      let requestBody = { orderStatus: 'confirmed' };

      let confirmationEmail = {
        from: 'cozinhadasandra22@gmail.com',
        to: order.userId.email,
        subject: 'Encomenda confirmada',
        message: `
        A sua encomenda com o ID: ${order._id} foi confirmada para o dia ${deliveredAt}. Por favor indique o ID da sua encomenda ao efectuar pagamento via MB WAY para o numero de telefone 9********.
        Pode ver todos os detalhes da sua encomenda na sua pagina de perfil.
    
        Com os melhores cumprimentos,
    
        A Cozinha da Sandra
        `,
      };

      (async () => {
        await Promise.all([updateOrder(requestBody, order._id), sendEmail(confirmationEmail)]);
        dispatch(confirmOrder({ id: order._id }));
      })();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      let requestBody = { paid: true };

      await updateOrder(requestBody, order._id);

      dispatch(confirmPayment({ id: order._id }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTotal = () => {
    if (order.deliveryDiscount) {
      return order.total;
    }

    if (order.total < order.amountForFreeDelivery && order.deliveryMethod === 'delivery') {
      return order.total + order.deliveryFee;
    }
    return order.total;
  };

  return (
    <div className='ShopOrder'>
      <p>
        <b>ID</b>: {order._id}
      </p>
      {user.userType === 'admin' && (
        <Link to={`/profile/edit/${order.userId._id}`}>
          <b>Utilizador:</b> {order.userId.username}
        </Link>
      )}
      <p>
        <b>Telefone:</b> {order.contact}
      </p>
      <p>
        <b>Data de criação:</b> {createdAt}
      </p>
      <p>
        <b>Data de entrega:</b> {deliveredAt}
      </p>
      <p>
        <b>Metodo de entrega:</b> {order.deliveryMethod === 'delivery' ? 'Entrega' : 'Take Away'}
      </p>
      {order.address && (
        <p>
          <b>Morada de entrega:</b> {order.address}
        </p>
      )}
      <div>
        <p>
          <b>Status: </b> {translateStatus(order.orderStatus)}
        </p>
        {order.orderStatus === 'pending' && <> {checkDeliveryDate() && location.pathname === '/orders' && <button onClick={handleConfirmOrder}>Confirmar</button>} </>}
      </div>

      {order.message && (
        <p>
          <b>Mensagem:</b> {order.message}
        </p>
      )}

      <div>
        <b>Items Quantidade: </b>
        {itemsQuantity.length > 0 &&
          itemsQuantity.map((item, index) => {
            return (
              <span key={index}>
                {item}
                <br />
              </span>
            );
          })}
      </div>
      <br />

      <div>
        <b>Items Preço: </b>
        {itemsPrice.length > 0 &&
          itemsPrice.map((item, index) => {
            return (
              <span key={index}>
                {item}€
                <br />
              </span>
            );
          })}
      </div>

      {order.deliveryMethod === 'delivery' && (
        <>
          {order.deliveryDiscount ? (
            <p>
              <b>Taxa de entrega:</b> <span style={{ textDecoration: 'line-through' }}>{order.deliveryFee}€</span> 0€
            </p>
          ) : (
            <p>
              <b>Taxa de entrega:</b> {order.deliveryFee}€
            </p>
          )}
        </>
      )}

      <div>
        <p>
          <b>Pago: </b> {order.paid ? 'Sim' : 'Não'}
        </p>
        {!order.paid && user.userType === 'admin' && <button onClick={() => handleConfirmPayment(order._id)}>Confirmar</button>}
      </div>
      <p>
        <b>Total:</b> {getTotal()}€
      </p>
      {user.userType === 'admin' && (
        <Link to={`/orders/edit/${order._id}`}>
          <span>Editar </span>
        </Link>
      )}
      {location.pathname === '/orders' && (
        <Link to={`/send-email/orders/${order._id}`}>
          <span>Contactar </span>
        </Link>
      )}
      <br />
      <hr />
    </div>
  );
}
