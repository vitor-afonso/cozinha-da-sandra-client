// jshint esversion:9

/* import { useEffect, useState } from 'react';
import { getOneOrder } from '../api';

export const OrderItems = ({ _id }) => {
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (_id) {
          let { data } = await getOneOrder(_id);
          console.log('first', data);
          setOrderItems(data.items);
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [_id]);

  return (
    <div>
      {orderItems.length > 0 &&
        orderItems.map((item) => {
          return (
            <>
              <h3>{item.name}</h3>
              <p>{item.amount}</p>
            </>
          );
        })}
    </div>
  );
}; */
