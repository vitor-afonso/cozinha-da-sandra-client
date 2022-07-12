// jshint esversion:9

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { AuthContext } from '../context/auth.context';

export const LoginPage = () => {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = { email, password };

      let response = await login(requestBody);

      // console.log('JWT token', response.data.authToken);

      storeToken(response.data.authToken);

      // Verify the token by sending a request
      // to the server's JWT validation endpoint.
      authenticateUser();

      navigate('/');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h2>Login</h2>
          <p>
            Novo na Cozinha da Sandra?
            <Link to='/signup'> Registra-te </Link>
            <br />
            <small>
              <Link to='/forgot'>Esqueceste a password?</Link>
            </small>
          </p>
        </div>
      </div>

      <form onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor='email'>Email address</label>
          <div>
            <input id='email' name='email' type='email' autoComplete='email' required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor='password'>Password</label>
          <div>
            <input id='password' name='password' type='password' autoComplete='current-password' required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        {errorMessage && <p>{errorMessage}</p>}

        <div>
          <button type='submit'>Login</button>
        </div>
      </form>
    </div>
  );
};
