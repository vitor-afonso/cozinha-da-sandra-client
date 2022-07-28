import { OrderInfo } from './../components/OrderInfo';
// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { ShopItem } from '../components/ShopItem/ShopItem';
import { AuthContext } from '../context/auth.context';
import { addDeliveryFee, clearCart, removeDeliveryFee } from '../redux/features/items/itemsSlice';
import { addNewShopOrder } from '../redux/features/orders/ordersSlice';

export const CartPage = () => {
  const { shopItems, cartItems, cartTotal, orderDeliveryFee, hasDeliveryDiscount } = useSelector((store) => store.items);
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
    const re = /^[0-9]{0,9}$/;

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
      dispatch(addDeliveryFee());
    } else {
      setIsAddressNotVisible(true);
      setRequiredInput(false);
      dispatch(removeDeliveryFee());
    }
    //console.log(e.target.value);
  };

  const submitOrder = async (e) => {
    // to prevent from throwing error on preventDefault
    e.preventDefault();
    /* if (e && e.preventDefault) {
    } */

    if (!contact || !user._id) {
      return;
    }
    if (!deliveryMethod) {
      setErrorMessage('Por favor escolha um metodo de entrega.');
      return;
    }

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
        deliveryFee: deliveryMethod === 'delivery' ? orderDeliveryFee : 0,
        deliveryDiscount: hasDeliveryDiscount,
        total: cartTotal.toFixed(2),
        userId: user._id,
        items: cartItems,
      };

      let response = await createOrder(requestBody);

      setSuccessMessage(
        'Encomenda criada com sucesso. Será contactado o mais brevemente possivel para confirmar a encomenda e receber os dados de pagamento. Encontre os detalhes da sua encomenda no seu perfil.'
      );
      dispatch(addNewShopOrder(response.data));
      dispatch(clearCart());

      console.log('response from submitOrder =>', response.data);
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
                    return <ShopItem key={item._id} {...item} />;
                  }
                })}
              </div>

              {deliveryMethod === 'delivery' && (
                <div>
                  {hasDeliveryDiscount ? (
                    <p>
                      Taxa de entrega: <span style={{ textDecoration: 'line-through' }}>{orderDeliveryFee}€</span>
                    </p>
                  ) : (
                    <p>Taxa de entrega: {orderDeliveryFee}€</p>
                  )}
                </div>
              )}

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

              <div>
                <p>Total: {cartTotal.toFixed(2)}€</p>
                {isNotVisible && <button onClick={() => toggleForm()}>Encomendar</button>}
                <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
              </div>
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
