// jshint esversion:9

import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShopItem } from '../components/ShopItem/ShopItem';
import { AuthContext } from '../context/auth.context';

export const DocesPage = () => {
  const { shopItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <>
        <span onClick={() => navigate(-1)}>Voltar</span>

        {isLoggedIn && (
          <button>
            <Link to='/cart'>Ver Carrinho {cartTotal.toFixed(2)}€</Link>
          </button>
        )}
      </>
    </div>
  );
};
