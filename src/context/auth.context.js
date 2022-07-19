// jshint esversion:9
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/features/items/itemsSlice';
import { verify } from './../api';

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // <= used to check if we already verify
  const [user, setUser] = useState(null);
  const storeToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  const dispatch = useDispatch();

  const authenticateUser = async () => {
    // Get the stored token from the localStorage

    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        // We must send the JWT token in the request's "Authorization" Headers
        let response = await verify(storedToken);

        // If the server verifies that JWT token is valid
        const user = response.data;
        // Update state variables
        setIsLoggedIn(true);
        setIsLoading(false);
        setUser(user);
      } catch (error) {
        // If the server sends an error response (invalid token)
        // Update state variables
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
      }
    } else {
      // If the token is not available (or is removed)
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem('authToken');
  };

  const logOutUser = () => {
    // To log out the user, remove the token
    removeToken();
    dispatch(clearCart());
    // and update the state variables
    authenticateUser();
  };

  //checks if theres any valid token in localStore in case user is returning after having closed the page
  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
