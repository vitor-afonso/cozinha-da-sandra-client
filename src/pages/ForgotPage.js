// jshint esversion:9

import { useState } from 'react';
import { forgotPassword } from '../api';

export const ForgotPage = () => {
  //get email to check match
  //call to api and send email with link to resetPage
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [email, setEmail] = useState('');

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = { email };

      let response = await forgotPassword(requestBody);

      setSuccessMessage(`Email com link para repor palavra pass enviado para ${email}.`);
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };
  return (
    <div>
      <h2>Esqueceu password</h2>

      {!successMessage && (
        <>
          <div>
            <p>Por favor digite o seu email</p>
          </div>

          <form onSubmit={handleForgotSubmit}>
            <div>
              <label htmlFor='email'>Email</label>
              <div>
                <input id='email' name='email' type='email' autoComplete='email' required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {errorMessage && <p>{errorMessage}</p>}

            <div>
              <button type='submit'>Enviar</button>
            </div>
          </form>
        </>
      )}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};
