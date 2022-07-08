// jshint esversion:9
import { AuthContext } from '../context/auth.context';
import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShopItems } from '../redux/features/items/itemsSlice';

export const HomePage = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { shopItems, isLoading } = useSelector((store) => store.items);

  useEffect(() => {
    dispatch(getShopItems('example of optional data'));
  }, []);

  return (
    <div>
      {isLoggedIn ? <div>Hello {user.username}</div> : <div>Please log in</div>}
      {!isLoading &&
        shopItems.length !== 0 &&
        shopItems.map((item) => {
          return (
            <div key={item._id}>
              <div>Nome do doce: {item.name}</div>
              <div>Price: {item.price}€</div>
            </div>
          );
        })}
    </div>
  );
};
