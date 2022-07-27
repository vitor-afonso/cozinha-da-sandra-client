// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateOrder } from '../api';
import { AuthContext } from '../context/auth.context';
import { deleteShopOrder, addNewShopOrder } from '../redux/features/orders/ordersSlice';
import { parseDateToEdit } from '../utils/app.utils';

export const EditOrderPage = () => {
  const { shopOrders } = useSelector((store) => store.orders);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [order, setOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [contact, setContact] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [isAddressNotVisible, setIsAddressNotVisible] = useState(true);
  const [requiredInput, setRequiredInput] = useState(false);
  const adminEffectRan = useRef(false);
  const addressRef = useRef();
  const submitForm = useRef();
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (adminEffectRan.current === false && orderId) {
      window.scrollTo(0, 0);

      let orderToEdit = shopOrders.find((item) => item._id === orderId);

      setOrder(orderToEdit);

      return () => {
        adminEffectRan.current = true;
      };
    }
  }, [orderId, shopOrders]);

  useEffect(() => {
    if (order) {
      setOrderDetails(order);
    }
  }, [order]);

  const setOrderDetails = (order) => {
    setContact(order.contact);
    setDeliveryDate(parseDateToEdit(order.deliveryDate));
    console.log('edit order parseDateToEdit deliveryDate:', parseDateToEdit(order.deliveryDate));
    setDeliveryMethod(order.deliveryMethod);

    if (order.deliveryMethod === 'delivery') {
      setIsAddressNotVisible(false);
      setFullAddress(order.address);
    }
    if (order.message !== '') {
      setMessage(order.message);
    }
  };

  const validateContact = (e) => {
    //regEx to prevent from typing letters and adding limit of 9 digits
    const re = /^[0-9]{0,9}$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setContact(e.target.value);
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
  };

  const clearInputs = () => {
    setContact('');
    setDeliveryDate('');
    setDeliveryMethod('');
    setFullAddress('');
    setMessage('');
  };

  const clearInputsAndGoBack = () => {
    clearInputs();
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contact || !user._id) {
      return;
    }
    if (deliveryMethod === 'delivery' && !fullAddress) {
      setErrorMessage('Por favor adicione morada para entrega.');
      return;
    }

    try {
      let requestBody = {
        deliveryDate: new Date(deliveryDate),
        contact,
        address: deliveryMethod === 'delivery' ? fullAddress : '',
        message,
        deliveryMethod,
      };

      let response = await updateOrder(requestBody, orderId);

      setSuccessMessage('Encomenda actualizada com sucesso.');

      // this will update the state with the updated order
      dispatch(deleteShopOrder({ id: orderId }));
      dispatch(addNewShopOrder(response.data));

      clearInputs();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      {order && !successMessage && (
        <>
          <h2>EditOrderPage</h2>
          <p>
            <b>Autor da encomenda:</b> {order.userId.username}
          </p>
          <form onSubmit={handleSubmit}>
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
                <input name='deliveryDate' type='datetime-local' required value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} min={new Date().toISOString().slice(0, -8)} />
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

            <div ref={addressRef} className={` ${isAddressNotVisible && 'order-form'}`}>
              <label htmlFor='fullAddress'>Morada</label>
              <div>
                <input name='fullAddress' type='text' required={requiredInput} value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder='Rua dos reis n 7' />
              </div>
            </div>

            <div>
              <label htmlFor='message'>Mensagem</label>
              <div>
                <textarea id='email-message' name='message' value={message} placeholder='Escreva aqui a sua mensagem...' onChange={(e) => setMessage(e.target.value)}></textarea>
              </div>
            </div>

            {errorMessage && <p>{errorMessage}</p>}

            <button type='submit' ref={submitForm} hidden onClick={(e) => handleSubmit(e)}>
              Actualizar
            </button>
          </form>
        </>
      )}

      {successMessage && <p>{successMessage}</p>}

      <div>
        <span onClick={clearInputsAndGoBack}>Voltar</span>

        {!successMessage && (
          <button type='button' onClick={() => submitForm.current.click()}>
            Actualizar
          </button>
        )}
      </div>
    </div>
  );
};
