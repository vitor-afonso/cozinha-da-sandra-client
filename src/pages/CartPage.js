// jshint esversion:9

import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/features/items/itemsSlice';

export const CartPage = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <p>CartPage</p>
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
    </div>
  );
};
