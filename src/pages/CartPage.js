import { OrderInfo } from './../components/OrderInfo';
// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { ShopItem } from '../components/ShopItem/ShopItemCard';
import { AuthContext } from '../context/auth.context';
import { clearCart, handleAddedDeliveryFee } from '../redux/features/items/itemsSlice';
import { addNewShopOrder } from '../redux/features/orders/ordersSlice';
import { updateShopUser } from '../redux/features/users/usersSlice';

export const CartPage = () => {
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, hasDeliveryDiscount, amountForFreeDelivery, addedDeliveryFee } = useSelector((store) => store.items);
  const { shopOrders } = useSelector((store) => store.orders);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [contact, setContact] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressCode, setAddressCode] = useState('');
  const [message, setMessage] = useState('');

  const [isNotVisible, setIsNotVisible] = useState(true);
  const [isAddressNotVisible, setIsAddressNotVisible] = useState(true);

  const [requiredInput, setRequiredInput] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef();
  const addressRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAddressNotVisible(true);
  }, []);

  const toggleForm = () => {
    setIsNotVisible(!isNotVisible);
  };

  const validateContact = (e) => {
    //regEx to prevent from typing letters and adding limit of 9 digits
    const re = /^[0-9]{0,14}$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setContact(e.target.value);
    }
  };

  const validateAddressCode = (e) => {
    const re = /^[0-9]{0,4}(?:-[0-9]{0,3})?$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setAddressCode(e.target.value);
    }
  };

  const handleRadioClick = (e) => {
    setDeliveryMethod(e.target.value);
    if (e.target.value === 'delivery') {
      setIsAddressNotVisible(false);
      setRequiredInput(true);
      dispatch(handleAddedDeliveryFee({ deliveryMethod: e.target.value }));
    }
    if (e.target.value === 'takeAway') {
      setIsAddressNotVisible(true);
      setRequiredInput(false);
      dispatch(handleAddedDeliveryFee({ deliveryMethod: e.target.value }));
    }

    //console.log(e.target.value);
  };

  const checkIfHaveDiscount = () => {
    if ((deliveryMethod === 'delivery' && cartTotal > amountForFreeDelivery) || hasDeliveryDiscount) {
      return true;
    }
    return false;
  };

  const updateStoreData = (data) => {
    let orderItems = [];
    shopItems.forEach((item) => {
      if (data.orderResponse.items.includes(item._id)) {
        for (let i = 0; i < item.amount; i++) {
          orderItems.push(item);
        }
      }
    });
    let newOrder = { ...data.orderResponse, items: orderItems, userId: data.updatedUser };

    dispatch(addNewShopOrder(newOrder));
    dispatch(updateShopUser(data.updatedUser));
    dispatch(clearCart());
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    try {
      let fullAddress;

      if (deliveryMethod === 'delivery') {
        fullAddress = [addressStreet, addressCode, addressCity];
      }

      let requestBody = {
        deliveryDate: new Date(deliveryDate),
        contact,
        address: fullAddress ? fullAddress.join(' ') : '',
        message,
        deliveryMethod,
        deliveryFee: addedDeliveryFee ? orderDeliveryFee : 0,
        amountForFreeDelivery: amountForFreeDelivery,
        deliveryDiscount: checkIfHaveDiscount(),
        items: cartItems,
        userId: user._id,
        total: cartTotal.toFixed(2),
      };

      //console.log('requestBody to create order: ', requestBody);

      let { data } = await createOrder(requestBody);

      setSuccessMessage(
        'Pedido criado com sucesso. Será contactado o mais brevemente possivel para confirmar o pedido e receber os dados de pagamento. Encontre os detalhes do seu pedido no seu perfil.'
      );

      // here we do manual populate of the order.items and order.userId so that we can have all data avaiable dynamically in the shopOrders to be used in profilePage without having to make a API call
      updateStoreData(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <p>Carrinho</p>
      {!successMessage && (
        <>
          {cartItems.length > 0 ? (
            <>
              <div>
                {shopItems.map((item) => {
                  if (cartItems.includes(item._id)) {
                    return <ShopItem key={item._id} {...item} deliveryMethod={deliveryMethod} />;
                  }
                })}
              </div>

              {deliveryMethod === 'delivery' && (
                <div>
                  {hasDeliveryDiscount || (cartTotal > amountForFreeDelivery && deliveryMethod === 'delivery') ? (
                    <p>
                      Taxa de entrega: <span style={{ textDecoration: 'line-through' }}>{orderDeliveryFee}€</span>
                    </p>
                  ) : (
                    <p>Taxa de entrega: {orderDeliveryFee}€</p>
                  )}
                </div>
              )}

              <div>
                <p>Total: {addedDeliveryFee && cartTotal < amountForFreeDelivery ? (cartTotal + orderDeliveryFee).toFixed(2) : cartTotal.toFixed(2)}€</p>
                {isNotVisible && <button onClick={() => toggleForm()}>Encomendar</button>}
                <button onClick={() => dispatch(clearCart())}>Limpar Carrinho</button>
              </div>

              <OrderInfo
                formRef={formRef}
                isNotVisible={isNotVisible}
                submitOrder={submitOrder}
                contact={contact}
                validateContact={validateContact}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                deliveryMethod={deliveryMethod}
                handleRadioClick={handleRadioClick}
                addressRef={addressRef}
                isAddressNotVisible={isAddressNotVisible}
                requiredInput={requiredInput}
                addressStreet={addressStreet}
                setAddressStreet={setAddressStreet}
                addressCode={addressCode}
                validateAddressCode={validateAddressCode}
                addressCity={addressCity}
                setAddressCity={setAddressCity}
                message={message}
                setMessage={setMessage}
                errorMessage={errorMessage}
                navigate={navigate}
              />
            </>
          ) : (
            <p>Sem items no carrinho.</p>
          )}
        </>
      )}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};
