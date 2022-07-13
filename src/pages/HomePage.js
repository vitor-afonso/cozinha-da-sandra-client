// jshint esversion:9
import { AuthContext } from '../context/auth.context';
import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { ShopItem } from '../components/ShopItem/ShopItem';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { shopItems, cartTotal, isLoading } = useSelector((store) => store.items);
  const { isLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {isLoggedIn ? <div>Hello {user.username}</div> : <div>Please log in</div>}
      {!isLoading &&
        shopItems.length !== 0 &&
        shopItems.map((item) => {
          return <ShopItem key={item._id} {...item} />;
        })}
      {isLoading && <p>Loading...</p>}

      {isLoggedIn && (
        <button>
          <Link to='/cart'>Ver Carrinho {cartTotal.toFixed(2)}€</Link>
        </button>
      )}
    </div>
  );
};
