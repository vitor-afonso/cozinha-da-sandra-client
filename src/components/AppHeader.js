// jshint esversion:9

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuBar } from './MenuBar';

export const AppHeader = () => {
  const { cartAmount, isLoading } = useSelector((store) => store.items);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <MenuBar />
      <h2>Cozinha da Sandra</h2>
      <div className='cart'>
        <Link to='/cart'>
          <span>Cart: {cartAmount}</span>
        </Link>
      </div>
    </div>
  );
};
