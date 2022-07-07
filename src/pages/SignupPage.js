// jshint esversion:9

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = { email, password, username };
      await signup(requestBody);
      navigate('/login');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div>
      <div>
        <h2>Cria a tua conta</h2>
        <p>
          Já tens uma conta?
          <Link to='/login'>Faz Login</Link>
        </p>
      </div>

      <div>
        <form onSubmit={handleSignupSubmit}>
          <div>
            <label htmlFor='username'>Username</label>
            <div>
              <input id='username' name='username' type='text' autoComplete='current-username' required className='' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor='email'>Email</label>
            <div>
              <input id='email' name='email' type='email' autoComplete='email' required className='' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor='password'>Password</label>
            <div>
              <input id='password' name='password' type='password' autoComplete='current-password' required className='' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {errorMessage && <p>{errorMessage}</p>}

          <div>
            <button type='submit'>Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
