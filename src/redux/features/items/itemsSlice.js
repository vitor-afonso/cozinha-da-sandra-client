// jshint esversion:9

import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getAllActiveItems } from '../../../api';

const initialState = {
  shopItems: [],
  cartItems: [],
  cartAmount: 0,
  cartTotal: 0,
  orderDeliveryFee: 2.99,
  addedDeliveryFee: false,
  hasDeliveryDiscount: true, //change this to give discount or not to all placed orders
  isLoading: true,
};

export const getShopItems = createAsyncThunk('items/getShopItems', async (dataFromComponent, thunkAPI) => {
  try {
    //console.log('optional data from component =>', dataFromComponent);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());
    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const { data } = await getAllActiveItems();
    console.log('getShopItems data in itemsSlice', data);
    return data; // we return a promise that is being handled by extraReducers in itemsSlice
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
      const shopItem = state.shopItems.find((item) => item._id === payload.id);

      state.cartItems.push(shopItem._id);
      state.cartAmount++;
      state.cartTotal += shopItem.price;

      //we have to use current if want to see the current state or it returns [PROXY]
      //console.log('adding to cart items  =>', current(state).cartItems);
    },

    clearCart: (state) => {
      state.shopItems.forEach((item) => (item.amount = 1));
      state.cartItems = [];
      state.cartAmount = 0;
      state.cartTotal = 0;
      //console.log('state.cartItems =>', current(state));
    },

    removeFromCart: (state, { payload }) => {
      //removes all of same itemId from cartItems
      const itemToRemove = state.shopItems.find((item) => item._id === payload.id);

      if (itemToRemove) {
        state.cartItems = state.cartItems.filter((item) => item !== payload.id);

        state.cartAmount -= itemToRemove.amount;
        state.cartTotal -= itemToRemove.price * itemToRemove.amount;
        itemToRemove.amount = 1;
      }

      //console.log('state.cartItems after removed item', current(state));
    },

    increaseItemAmount: (state, { payload }) => {
      const shopItem = state.shopItems.find((item) => item._id === payload.id);

      shopItem.amount++;
    },
    decreaseItemAmount: (state, { payload }) => {
      //decreases quantity and removes one itemId from cartItems
      const shopItem = state.shopItems.find((item) => item._id === payload.id);
      const itemIndex = state.cartItems.indexOf(shopItem._id);
      state.cartItems.splice(itemIndex, 1);

      shopItem.amount--;
      state.cartAmount--;
      state.cartTotal -= shopItem.price;
    },

    addDeliveryFee: (state) => {
      if (state.hasDeliveryDiscount) {
        state.addedDeliveryFee = true;
        return;
      }
      if (!state.addedDeliveryFee) {
        state.cartTotal += state.orderDeliveryFee;
        state.addedDeliveryFee = true;
      }
    },

    removeDeliveryFee: (state) => {
      if (state.hasDeliveryDiscount) {
        state.addedDeliveryFee = false;
        return;
      }
      if (state.addedDeliveryFee) {
        state.cartTotal -= state.orderDeliveryFee;
        state.addedDeliveryFee = false;
      }
    },

    addNewShopItem: (state, { payload }) => {
      state.shopItems.push(payload);
      //console.log('current shop orders  =>', current(state).shopOrders);
    },
  },
  extraReducers: {
    [getShopItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getShopItems.fulfilled]: (state, action) => {
      //console.log('action on fulfilled', action);
      state.isLoading = false;
      state.shopItems = action.payload;
    },
    [getShopItems.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { clearCart, addToCart, removeFromCart, increaseItemAmount, decreaseItemAmount, addNewShopItem, addDeliveryFee, removeDeliveryFee } = itemsSlice.actions;
export default itemsSlice.reducer;
