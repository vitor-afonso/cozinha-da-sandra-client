// jshint esversion:9

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItem';

export const ItemDetailsPage = () => {
  const { shopItems } = useSelector((store) => store.items);
  const [shopItem, setShopItem] = useState(null);
  const { itemId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (itemId) {
      let oneItem = shopItems.find((item) => item._id === itemId);
      setShopItem(oneItem);
    }
  }, [itemId]);

  return (
    <div className='ItemDetailsPage'>
      {shopItem ? (
        <>
          <h2>Detalhes do Item</h2>
          <ShopItem {...shopItem} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
