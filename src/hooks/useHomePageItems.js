import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { APP, getHomePageItemsPerCategory } from '../utils/app.utils';

export default function useHomePageItems() {
  const { shopItems } = useSelector((store) => store.items);
  const [shopItemsDoces, setShopItemsDoces] = useState([]);
  const [shopItemsSalgados, setShopItemsSalgados] = useState([]);

  useEffect(() => {
    if (shopItems.length > 0) {
      const filteredDoces = getHomePageItemsPerCategory(shopItems, APP.categories.doces);
      const filteredSalgados = getHomePageItemsPerCategory(shopItems, APP.categories.salgados);
      setShopItemsDoces(filteredDoces);
      setShopItemsSalgados(filteredSalgados);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopItems]);

  return {
    shopItemsDoces,
    shopItemsSalgados,
  };
}
