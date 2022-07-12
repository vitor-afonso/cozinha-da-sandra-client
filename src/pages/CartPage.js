// jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../api';
import { ShopItem } from '../components/ShopItem';
import { AuthContext } from '../context/auth.context';
import { clearCart } from '../redux/features/items/itemsSlice';

export const CartPage = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressCode, setAddressCode] = useState('');
  const [message, setMessage] = useState('');
  const { shopItems, cartItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const placeOrder = async () => {
    let fullAddress = [address, addressCity, addressCode];

    if (!contact || !user._id) {
      return;
    }

    let order = {
      deliveryDate,
      contact,
      address: fullAddress.join(' '),
      message,
      total: cartTotal,
      userId: user._id,
      items: cartItems,
    };

    let response = await createOrder(order);
    console.log('response from placeOrder =>', response.data);
  };
  return (
    <div>
      <p>CartPage</p>
      {cartItems.length > 0 && (
        <div>
          {shopItems.map((item) => {
            if (cartItems.includes(item._id)) {
              return <ShopItem key={item._id} {...item} />;
            }
          })}
        </div>
      )}
      {cartItems.length > 0 ? (
        <>
          <p>Total: {cartTotal.toFixed(2)}€</p>
          <button onClick={() => placeOrder()}>Encomendar</button>
          <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
        </>
      ) : (
        <p>Sem items no carrinho.</p>
      )}
    </div>
  );
};
