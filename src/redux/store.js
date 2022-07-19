// jshint esversion:9

import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './features/items/itemsSlice';
import ordersReducer from './features/orders/ordersSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    orders: ordersReducer,
  },
});
