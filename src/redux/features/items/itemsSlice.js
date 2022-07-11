// jshint esversion:9

import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getItems } from '../../../api';

const initialState = {
  shopItems: [],
  cartItems: [],
  cartAmount: 0,
  cartTotal: 0,
  isLoading: true,
};

export const getShopItems = createAsyncThunk('items/getShopItems', async (dataFromComponent, thunkAPI) => {
  try {
    //console.log('optional data from component =>', dataFromComponent);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());
    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const res = await getItems();
    return res.data; // we return a promise that is being handled by extraReducers in itemsSlice
  } catch (error) {
    //return thunkAPI.rejectWithValue(error.response); // this would be handled by extraReducers getShopItems.rejected in itemsSlice

    return thunkAPI.rejectWithValue('Something went wrong...'); // this is being handled by extraReducers getShopItems.rejected in itemsSlice
  }
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const itemToAdd = state.shopItems.find((item) => item._id === payload.id);

      state.cartItems.push(itemToAdd);
      state.cartAmount++;
      state.cartTotal += itemToAdd.price;

      //we have to use current to be able to see the current state or it returns [PROXY]
      //console.log('item to add  =>', current(cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartAmount = 0;
      state.cartTotal = 0;
      //console.log('state.cartItems =>', current(state));
    },

    removeFromCart: (state, { payload }) => {
      if (state.cartAmount === 0) {
        return;
      }
      const itemToRemove = state.shopItems.find((item) => item._id === payload.id);
      state.cartItems = state.cartItems.filter((item) => item._id !== payload.id);
      state.cartAmount--;
      state.cartTotal -= itemToRemove.price;
      console.log('state.cartItems after removed item', current(state));
    },

    increaseItemAmount: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item._id === payload._id);
      cartItem.amount += 1;
    },
    decreaseItemAmount: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount -= 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.cartAmount = amount;
      state.cartTotal = total;
    },
  },
  extraReducers: {
    [getShopItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getShopItems.fulfilled]: (state, action) => {
      /* console.log(action); */
      state.isLoading = false;
      state.shopItems = action.payload;
    },
    [getShopItems.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { clearCart, addToCart, removeFromCart, increaseItemAmount } = itemsSlice.actions;
export default itemsSlice.reducer;
