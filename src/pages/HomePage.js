// jshint esversion:9
import { AuthContext } from '../context/auth.context';
import { useEffect, useContext, useState, React } from 'react';
import { getAllItems } from '../api';

export const HomePage = () => {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let response = await getAllItems();

        setItems(response.data);
      } catch (error) {
        console.log('Ops! Algo correu mal ao carregar items na base de dados', error);
      }
    })();
  }, []);

  return (
    <div>
      {isLoggedIn ? <div>Hello {user.username}</div> : <div>Please log in</div>}
      {items &&
        items.map((item) => {
          return (
            <>
              <div>Name: {item.name}</div>
              <div>Price: {item.price}€</div>
            </>
          );
        })}
    </div>
  );
};
