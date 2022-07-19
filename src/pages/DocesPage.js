// jshint esversion:9

import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItem';
import { AuthContext } from '../context/auth.context';

export const DocesPage = () => {
  const { shopItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn, user } = useContext(AuthContext);

  return (
    <div>
      <h2>DOCES</h2>
      {isLoading && <p>Loading...</p>}
      {shopItems.length !== 0 && (
        <div className='shop-items-doces-container'>
          {shopItems.map((item) => {
            if (item.category === 'doces') {
              return <ShopItem key={item._id} {...item} />;
            }
          })}
        </div>
      )}

      {isLoggedIn && (
        <button>
          <Link to='/cart'>Ver Carrinho {cartTotal.toFixed(2)}€</Link>
        </button>
      )}
    </div>
  );
};
