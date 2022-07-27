// jshint esversion:9

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MenuBar } from './MenuBar';

export const AppHeader = () => {
  const { cartAmount } = useSelector((store) => store.items);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <MenuBar />
      <h2>A Cozinha da Sandra</h2>
      <div className='cart'>
        <Link to='/cart'>
          <span>Carrinho: {cartAmount}</span>
        </Link>
      </div>
    </div>
  );
};
