// jshint esversion:9

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItem';

export const ItemDetailsPage = () => {
  const { shopItems } = useSelector((store) => store.items);

  const { itemId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {shopItems.length > 0 ? (
        shopItems.map((item) => {
          if (item._id === itemId) {
            return (
              <div className='ItemDetailsPage' key={item._id}>
                <h2>Detalhes - {item.name} </h2>
                <ShopItem {...item} />
              </div>
            );
          }
        })
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
