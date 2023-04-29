// jshint esversion:9

import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from 'redux/features/items/itemsSlice';
import ordersReducer from 'redux/features/orders/ordersSlice';
import reviewsReducer from 'redux/features/reviews/reviewsSlice';
import usersReducer from 'redux/features/users/usersSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    orders: ordersReducer,
    users: usersReducer,
    reviews: reviewsReducer,
  },
});
