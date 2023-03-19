import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { APP, getHomePageCategoryItems } from '../utils/app.utils';

export default function useHomePageItems() {
  const { shopItems } = useSelector((store) => store.items);
  const [docesData, setDocesData] = useState(null);
  const [salgadosData, setSalgadosData] = useState(null);

  useEffect(() => {
    if (shopItems.length > 0) {
      const filteredDoces = getHomePageCategoryItems(shopItems, APP.categories.doces);
      const filteredSalgados = getHomePageCategoryItems(shopItems, APP.categories.salgados);
      setDocesData({ categoryItems: filteredDoces, categoryName: APP.categories.doces });
      setSalgadosData({ categoryItems: filteredSalgados, categoryName: APP.categories.salgados });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopItems]);

  return {
    docesData,
    salgadosData,
  };
}
