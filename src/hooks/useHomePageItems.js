import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useHomePageItems() {
  const { shopItems } = useSelector((store) => store.items);
  const [shopItemsDoces, setShopItemsDoces] = useState([]);
  const [shopItemsSalgados, setShopItemsSalgados] = useState([]);

  const categories = {
    doces: 'doces',
    salgados: 'salgados',
  };

  useEffect(() => {
    let docesCount = 0;
    let salgadosCount = 0;

    if (shopItems.length > 0) {
      const filteredDoces = shopItems.filter((item) => {
        if (docesCount < 3 && item.category === categories.doces) {
          docesCount++;
          return item;
        }
        return null;
      });

      const filteredSalgados = shopItems.filter((item) => {
        if (salgadosCount < 3 && item.category === categories.salgados) {
          salgadosCount++;
          return item;
        }
        return null;
      });
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
