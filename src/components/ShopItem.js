// jshint esversion:9

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/features/items/itemsSlice';

export const ShopItem = ({ name, _id, imageUrl, price }) => {
  const dispatch = useDispatch();
  const { shopItems, isLoading } = useSelector((store) => store.items);
  return (
    <div className={`ShopItem`}>
      <div>
        <img src={imageUrl} alt={name} />
      </div>

      <div>
        <h3>{name}</h3>
        <p>{price}€</p>
      </div>

      <div>
        <button onClick={() => dispatch(addToCart({ id: _id }))}>Adicionar ao carrinho</button>
      </div>
    </div>
  );
};
