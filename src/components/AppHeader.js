// jshint esversion:9

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuBar } from './MenuBar';

export const AppHeader = () => {
  const { cartAmount, isLoading } = useSelector((store) => store.items);
  console.log('items in cart: ', cartAmount);
  return (
    <div>
      <MenuBar />
      <div className='cart'>
        <Link to='/cart'>
          <span>Cart: {cartAmount}</span>
        </Link>
      </div>
    </div>
  );
};
