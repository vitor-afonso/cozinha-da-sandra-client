// jshint esversion:9

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../api';

export const ResetPage = () => {
  const [successMessage, setSuccessMessage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== newPassword2) {
      setErrorMessage('Por favor insira a mesma password nos 2 campos.');
      return;
    }

    try {
      const requestBody = { password: newPassword };

      await resetPassword(requestBody, userId);

      setSuccessMessage('A sua palavra pass foi actualizada com sucesso.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };
  return (
    <div>
      <h2>Repor password</h2>

      {!successMessage && (
        <>
          <div>
            <p>Por favor digite a sua nova password</p>
          </div>

          <form onSubmit={handleResetSubmit}>
            <div>
              <label htmlFor='password'>Nova Password</label>
              <div>
                <input id='new-password' name='password' type='password' autoComplete='current-password' required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </div>

            <div>
              <label htmlFor='password'>Repita Nova Password</label>
              <div>
                <input id='new-password-2' name='password-2' type='password' autoComplete='current-password' required value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} />
              </div>
            </div>

            {errorMessage && <p>{errorMessage}</p>}

            <div>
              <button type='submit'>Repor</button>
            </div>
          </form>
        </>
      )}

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};
