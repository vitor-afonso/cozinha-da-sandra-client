// jshint esversion:9

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

export const MenuBar = () => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <ul>
      {!isLoggedIn && (
        <>
          <li>
            <Link to='/'>
              <img src='' alt='Inicio' />
            </Link>
          </li>

          <li>
            <Link to='/doces'>
              <img src='' alt='Doces' />
            </Link>
          </li>

          <li>
            <Link to='/salgados'>
              <img src='' alt='Salgados' />
            </Link>
          </li>

          <li>
            <Link to='/signup'>
              <img src='' alt='Registrar' />
            </Link>
          </li>
          <li>
            <Link to='/login'>
              <img src='' alt='Entrar' />
            </Link>
          </li>
          <li>
            <Link to='/about'>
              <img src='' alt='Sobre mim' />
            </Link>
          </li>
        </>
      )}

      {isLoggedIn && user && (
        <>
          <li>
            <Link to='/'>
              <img src='' alt='Home' />
            </Link>
          </li>

          <li>
            <Link to='/doces'>
              <img src='' alt='Doces' />
            </Link>
          </li>

          <li>
            <Link to='/salgados'>
              <img src='' alt='Salgados' />
            </Link>
          </li>

          {user.userType === 'admin' && (
            <li>
              <Link to='/users'>
                <img src='' alt='Utilizadores' />
              </Link>
            </li>
          )}

          {user.userType === 'admin' && (
            <li>
              <Link to='/orders'>
                <img src='' alt='Encomendas' />
              </Link>
            </li>
          )}

          {user.userType === 'admin' && (
            <li>
              <Link to='/items/add'>
                <img src='' alt='Novo item' />
              </Link>
            </li>
          )}

          <li>
            <Link to={`/profile/${user._id}`}>
              <img src='' alt='Perfil' />
            </Link>
          </li>

          <li>
            <span onClick={() => logOutUser()}>
              <img src='' alt='Logout' />
            </span>
          </li>
        </>
      )}
    </ul>
  );
};
