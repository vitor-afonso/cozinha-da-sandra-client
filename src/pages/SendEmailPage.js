// jshint esversion:9

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneOrder, sendEmail } from '../api';
import { ShopOrder } from '../components/ShopOrder';

export const SendEmailPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const from = 'cozinhadasandra22@gmail.com';
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (orderId) {
      try {
        (async () => {
          let order = await getOneOrder(orderId);
          setOrder(order.data);
          setTo(order.data.userId.email);
        })();
      } catch (error) {
        console.log(error.message);
        setErrorMessage('Não foi possivel obter email do destinatario na base de dados. Por favor introduza manualmente.');
      }
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = { from, to, subject, message };
      await sendEmail(requestBody);
      setSuccessMessage('Email enviado com sucesso.');
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Detalhes de encomenda</h2>

      {order && <ShopOrder order={order} />}

      <h2>Enviar Email</h2>

      {!successMessage && order && (
        <form onSubmit={handleSubmit}>
          <div>
            <p>De: A Cozinha da Sandra</p>
          </div>

          <div>
            <label htmlFor='receiver'>Para</label>

            <div>
              <input id='add-item-price' name='receiver' type='email' required value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor='subject'>Assunto</label>
            <div>
              <input id='add-item-price' name='subject' type='text' required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='Pedido de encomenda' />
            </div>
          </div>

          <div>
            <label htmlFor='message'>Mensagem</label>
            <div>
              <textarea id='email-message' name='message' required value={message} placeholder='Escreva aqui a sua mensagem...' onChange={(e) => setMessage(e.target.value)}></textarea>
            </div>
          </div>

          {errorMessage && <p>{errorMessage}</p>}

          <div>
            <div>
              <button type='button' onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
            <button type='submit'>Enviar</button>
          </div>
        </form>
      )}

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};
