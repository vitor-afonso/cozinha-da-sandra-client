// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { ShopItem } from '../components/ShopItem/ShopItem';
import { AuthContext } from '../context/auth.context';
import { clearCart } from '../redux/features/items/itemsSlice';
import { updateShopOrder } from '../redux/features/orders/ordersSlice';
import { formatDate } from '../utils/app.utils';

export const CartPage = () => {
  const { shopItems, cartItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [contact, setContact] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressCode, setAddressCode] = useState('');
  const [message, setMessage] = useState('');

  const [isNotVisible, setIsNotVisible] = useState(true);
  const [isAddressNotVisible, setIsAddressNotVisible] = useState(true);

  const [requiredInput, setRequiredInput] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');

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
    //regEx to prevent from typing letters
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
    } else {
      setIsAddressNotVisible(true);
      setRequiredInput(false);
    }
    //console.log(e.target.value);
  };

  const placeOrder = async (e) => {
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
        total: cartTotal.toFixed(2),
        userId: user._id,
        items: cartItems,
      };

      let response = await createOrder(requestBody);

      setSuccessMessage('Encomenda criada com sucesso. Será contactado o mais brevemente possivel para confirmar a encomenda e receber os dados de pagamento.');
      dispatch(updateShopOrder(response.data));
      dispatch(clearCart());

      console.log('response from placeOrder =>', response.data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <p>CartPage</p>
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

              <div ref={formRef} className={` ${isNotVisible && 'order-form'}`}>
                <form onSubmit={placeOrder}>
                  <div>
                    <h2>Dados de entrega</h2>
                  </div>
                  <div>
                    <label htmlFor='contact'>Contacto</label>
                    <div>
                      <input name='contact' type='text' required value={contact} onChange={(e) => validateContact(e)} placeholder='912345678' />
                    </div>
                  </div>

                  <div>
                    <label htmlFor='deliveryDate'>Data & Hora de entrega</label>

                    <div>
                      <input name='deliveryDate' type='datetime-local' required value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                    </div>
                  </div>

                  <fieldset>
                    <legend>Entrega ou Take Away?</legend>
                    <div>
                      <label htmlFor='delivery'>Com Entrega</label>
                      <input type='radio' name='delivery' value='delivery' checked={deliveryMethod === 'delivery'} onChange={handleRadioClick} />
                    </div>
                    <div>
                      <label htmlFor='takeAway'>Take Away</label>
                      <input type='radio' name='takeAway' value='takeAway' checked={deliveryMethod === 'takeAway'} onChange={handleRadioClick} />
                    </div>
                  </fieldset>

                  <fieldset ref={addressRef} className={` ${isAddressNotVisible && 'order-form'}`}>
                    <legend>Morada</legend>
                    <div>
                      <label htmlFor='addressStreet'>Rua</label>
                      <div>
                        <input name='addressStreet' type='text' required={requiredInput} value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} placeholder='Rua dos reis n 7' />
                      </div>
                    </div>
                    <div>
                      <label htmlFor='addressCode'>Código Postal</label>
                      <div>
                        <input name='addressCode' type='text' required={requiredInput} value={addressCode} onChange={(e) => validateAddressCode(e)} placeholder='8800-123' />
                      </div>
                    </div>
                    <div>
                      <label htmlFor='addressCity'>Cidade</label>
                      <div>
                        <input name='addressCity' type='text' required={requiredInput} value={addressCity} onChange={(e) => setAddressCity(e.target.value)} placeholder='Tavira' />
                      </div>
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor='message'>Mensagem</label>
                    <div>
                      <textarea id='email-message' name='message' value={message} placeholder='Escreva aqui a sua mensagem...' onChange={(e) => setMessage(e.target.value)}></textarea>
                    </div>
                  </div>

                  {errorMessage && <p>{errorMessage}</p>}

                  <div>
                    <span onClick={() => navigate(-1)}>Back</span>

                    <button type='submit' onClick={() => placeOrder()}>
                      Encomendar
                    </button>
                  </div>
                </form>
              </div>

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
