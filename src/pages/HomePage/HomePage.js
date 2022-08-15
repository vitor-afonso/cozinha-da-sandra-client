// jshint esversion:9
import { AuthContext } from '../../context/auth.context';
import { useEffect, useContext, useState } from 'react';

import { ShopItem } from '../../components/ShopItem/ShopItem';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

export const HomePage = () => {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn, user } = useContext(AuthContext);
  const [shopItemsDoces, setShopItemsDoces] = useState([]);
  const [shopItemsSalgados, setShopItemsSalgados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // To limit the number of items to 3 per categorry
  useEffect(() => {
    let docesCount = 0;
    let salgadosCount = 0;

    if (shopItems.length > 0) {
      const filteredDoces = shopItems.filter((item) => {
        if (docesCount < 3 && item.category === 'doces') {
          docesCount++;
          return item;
        }
      });

      const filteredSalgados = shopItems.filter((item) => {
        if (salgadosCount < 3 && item.category === 'salgados') {
          salgadosCount++;
          return item;
        }
      });
      setShopItemsDoces(filteredDoces);
      setShopItemsSalgados(filteredSalgados);
    }
  }, [shopItems]);

  return (
    <div className='HomePage'>
      {isLoggedIn ? <div>Hello {user.username}</div> : <div>Please log in</div>}
      {isLoading && <p>Loading...</p>}

      {shopItemsDoces.length > 0 && shopItemsSalgados.length > 0 && (
        <div className='shop-items-container' data-testid='shop-items-container'>
          <div className='items-doces-container' data-testid='items-container'>
            {shopItemsDoces.map((item) => {
              if (item.category === 'doces') {
                return <ShopItem key={item._id} {...item} />;
              }
            })}
          </div>

          <Button variant='outlined' onClick={() => navigate('/doces')}>
            Ver mais...
          </Button>

          <hr />

          <div className='items-salgados-container' data-testid='items-container'>
            {shopItemsSalgados.map((item) => {
              if (item.category === 'salgados') {
                return <ShopItem key={item._id} {...item} />;
              }
            })}
          </div>
          <Button variant='outlined' sx={{ marginBottom: '55px' }} onClick={() => navigate('/salgados')}>
            Ver mais...
          </Button>
        </div>
      )}
    </div>
  );
};
