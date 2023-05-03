// jshint esversion:9

// eslint-disable-next-line no-unused-vars
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getAllOrders, getUserOrders } from 'api';

const initialState = {
  shopOrders: [],
  isLoading: true,
};

export const getShopOrders = createAsyncThunk('items/getShopOrders', async (userId, thunkAPI) => {
  try {
    //console.log('optional data from component =>', userId);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());

    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const { data } = userId ? await getUserOrders(userId) : await getAllOrders();
    // console.log('getShopOrders data in ordersSlice', data);
    return data; // we return a promise that is being handled by extraReducers in ordersSlice
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message); // this would be handled by extraReducers getShopOrders.rejected in ordersSlice
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
      //console.log('current shop orders  =>', current(state).shopOrders);
    },
    confirmDelivered: (state, { payload }) => {
      const oneOrder = state.shopOrders.find((order) => order._id === payload.id);
      oneOrder.delivered = true;
    },
    confirmPayment: (state, { payload }) => {
      const oneOrder = state.shopOrders.find((order) => order._id === payload.id);
      oneOrder.paid = true;

      //we have to use current if want to see the current state or it returns [PROXY]
      //console.log('current shop orders  =>', current(state).shopOrders);
    },
    addNewShopOrder: (state, { payload }) => {
      state.shopOrders.push(payload);
      //console.log('ordersSlice - current shop orders after adding new order =>', current(state).shopOrders);
    },
    rejectOrder: (state, { payload }) => {
      const oneOrder = state.shopOrders.find((order) => order._id === payload.id);
      oneOrder.orderStatus = 'rejected';
    },
    deleteShopOrder: (state, { payload }) => {
      state.shopOrders = state.shopOrders.filter((item) => item !== payload.id);
    },
    updateShopOrder: (state, { payload }) => {
      state.shopOrders = state.shopOrders.filter((item) => item._id !== payload._id);
      state.shopOrders.push(payload);
      //console.log('current shop orders in updateShopOrder   =>', current(state).shopOrders);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShopOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShopOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shopOrders = action.payload;
      })
      .addCase(getShopOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { confirmDelivered, confirmOrder, rejectOrder, deleteShopOrder, confirmPayment, addNewShopOrder, updateShopOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
