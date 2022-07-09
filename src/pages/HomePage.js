// jshint esversion:9
import { AuthContext } from '../context/auth.context';
import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShopItems } from '../redux/features/items/itemsSlice';
import { ShopItem } from '../components/ShopItem';

export const HomePage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn, user } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getShopItems('example of optional data'));
  }, []);

  return (
    <div>
      {isLoggedIn ? <div>Hello {user.username}</div> : <div>Please log in</div>}
      {!isLoading &&
        shopItems.length !== 0 &&
        shopItems.map((item) => {
          return <ShopItem key={item._id} {...item} />;
        })}
    </div>
  );
};
