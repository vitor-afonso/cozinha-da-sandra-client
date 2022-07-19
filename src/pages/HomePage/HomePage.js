// jshint esversion:9
import { AuthContext } from '../../context/auth.context';
import { useEffect, useContext } from 'react';

import { ShopItem } from '../../components/ShopItem/ShopItem';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const HomePage = () => {
  const { shopItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='HomePage'>
      {isLoggedIn ? <div>Hello {user.username}</div> : <div>Please log in</div>}
      {isLoading && <p>Loading...</p>}
      {shopItems.length !== 0 && (
        <div className='shop-items-container' data-testid='shop-items-container'>
          <div className='items-doces-container' data-testid='items-container'>
            {shopItems.map((item) => {
              if (item.category === 'doces') {
                return <ShopItem key={item._id} {...item} />;
              }
            })}
          </div>

          <hr />

          <div className='items-salgados-container' data-testid='items-container'>
            {shopItems.map((item) => {
              if (item.category === 'salgados') {
                return <ShopItem key={item._id} {...item} />;
              }
            })}
          </div>
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
