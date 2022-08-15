// jshint esversion:9

import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItemCard';
import { AuthContext } from '../context/auth.context';

export const SalgadosPage = () => {
  const { shopItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <h2>SALGADOS</h2>
      {isLoading && <p>Loading...</p>}
      {shopItems.length !== 0 && (
        <div className='shop-items-doces-container'>
          {shopItems.map((item) => {
            if (item.category === 'salgados') {
              return <ShopItem key={item._id} {...item} />;
            }
          })}
        </div>
      )}

      <>
        <span onClick={() => navigate(-1)}>Voltar</span>
      </>
    </div>
  );
};
