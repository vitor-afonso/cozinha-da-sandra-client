// jshint esversion:9

import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getAllOrders } from '../../../api';

const initialState = {
  shopOrders: [],
  isLoading: true,
};

export const getShopOrders = createAsyncThunk('items/getShopOrders', async (dataFromComponent, thunkAPI) => {
  try {
    //console.log('optional data from component =>', dataFromComponent);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());
    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const { data } = await getAllOrders();
    console.log('getShopOrders data in ordersSlice', data);
    return data; // we return a promise that is being handled by extraReducers in ordersSlice
  } catch (error) {
    //return thunkAPI.rejectWithValue(error.response); // this would be handled by extraReducers getShopOrders.rejected in ordersSlice

    return thunkAPI.rejectWithValue('Something went wrong getting orders'); // this is being handled by extraReducers getShopOrders.rejected in ordersSlice
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    confirmOrder: (state, { payload }) => {
      const oneOrder = state.shopOrders.find((order) => order._id === payload.id);
      oneOrder.orderStatus = 'confirmed';

      //we have to use current if want to see the current state or it returns [PROXY]
      console.log('current shop orders  =>', current(state).shopOrders);
    },
    rejectOrder: (state, { payload }) => {
      const oneOrder = state.shopOrders.find((order) => order._id === payload.id);
      oneOrder.orderStatus = 'rejected';
    },
    deleteOrder: (state, { payload }) => {
      const oneOrder = state.shopOrders.find((order) => order._id === payload.id);
      oneOrder.deleted = true;
    },
  },
  extraReducers: {
    [getShopOrders.pending]: (state) => {
      state.isLoading = true;
    },
    [getShopOrders.fulfilled]: (state, action) => {
      //console.log('action on fulfilled', action);
      state.isLoading = false;
      state.shopOrders = action.payload;
    },
    [getShopOrders.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { confirmOrder, rejectOrder, deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
