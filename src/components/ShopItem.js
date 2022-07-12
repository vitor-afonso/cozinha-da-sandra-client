// jshint esversion:9

import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { addToCart, decreaseItemAmount, increaseItemAmount, removeFromCart, clearCart } from '../redux/features/items/itemsSlice';

export const ShopItem = ({ name, _id, imageUrl, price, amount }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store) => store.items);

  const handleDecrease = () => {
    if (amount === 1) {
      dispatch(clearCart());
      return;
    }
    dispatch(decreaseItemAmount({ id: _id }));
  };

  return (
    <div className={`ShopItem`}>
      <div>
        <Link to={`/items/${_id}`}>
          <img src={imageUrl} alt={name} />
        </Link>
      </div>

      <div>
        <Link to={`/items/${_id}`}>
          <h3>{name}</h3>
        </Link>
        <p>{price}€</p>
      </div>

      {!isLoggedIn && (
        <div>
          <Link to='/login'>
            <span>Adicionar ao carrinho</span>
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <div>
          {cartItems.includes(_id) && (
            <>
              <button onClick={() => dispatch(increaseItemAmount({ id: _id }))}>increase</button>
              <p>{amount}</p>
              <button onClick={() => handleDecrease()}>decrease</button>
            </>
          )}
          <br />
          {!cartItems.includes(_id) && <button onClick={() => dispatch(addToCart({ id: _id }))}>Adicionar ao carrinho</button>}
          {cartItems.includes(_id) && <button onClick={() => dispatch(removeFromCart({ id: _id }))}>Remover do carrinho</button>}
        </div>
      )}
    </div>
  );
};
