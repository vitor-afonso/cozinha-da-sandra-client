// jshint esversion:9

export const OrderInfo = ({
  formRef,
  isNotVisible,
  submitOrder,
  contact,
  validateContact,
  deliveryDate,
  setDeliveryDate,
  deliveryMethod,
  handleRadioClick,
  addressRef,
  isAddressNotVisible,
  requiredInput,
  addressStreet,
  setAddressStreet,
  addressCode,
  validateAddressCode,
  addressCity,
  setAddressCity,
  message,
  setMessage,
  errorMessage,
  navigate,
}) => {
  return (
    <div ref={formRef} className={` ${isNotVisible && 'order-form'}`}>
      <form onSubmit={submitOrder}>
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

          <button type='submit' onClick={(e) => submitOrder(e)}>
            Encomendar
          </button>
        </div>
      </form>
    </div>
  );
};
