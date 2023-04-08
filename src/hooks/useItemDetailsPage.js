import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function useItemDetailsPage() {
  const { shopItems, isLoading } = useSelector((store) => store.items);
  const [oneItem, setOneItem] = useState(null);
  const { itemId } = useParams();

  useEffect(() => {
    if (itemId) {
      let itemToDisplay = shopItems.find((item) => item._id === itemId);
      setOneItem(itemToDisplay);
    }
  }, [itemId, shopItems]);
  return { oneItem, isLoading };
}
