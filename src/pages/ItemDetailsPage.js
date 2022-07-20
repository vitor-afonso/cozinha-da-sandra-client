// jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItem';
import { AuthContext } from '../context/auth.context';

export const ItemDetailsPage = () => {
  const { shopItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn, user } = useContext(AuthContext);
  const [shopItem, setShopItem] = useState(null);
  const { itemId } = useParams();

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false && itemId !== '') {
      let oneItem = shopItems.find((item) => item._id === itemId);
      setShopItem(oneItem);
      return () => {
        effectRan.current = true;
      };
      console.log('item id detail page', oneItem);
    }
  }, [itemId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='ItemDetailsPage'>
      <h2>Details Page</h2>
      {shopItem && <ShopItem {...shopItem} />}
    </div>
  );
};
