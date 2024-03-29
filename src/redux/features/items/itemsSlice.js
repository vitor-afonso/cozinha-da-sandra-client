// jshint esversion:9

// eslint-disable-next-line no-unused-vars
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getAllActiveItems } from 'api';

const initialState = {
  shopItems: [],
  cartItems: [],
  cartAmount: 0,
  cartTotal: 0,
  isOrderForDelivery: false,
  orderDeliveryFee: null,
  isFreeDeliveryForAll: false, //<= to give free delivery to all new orders
  amountForFreeDelivery: null,
  percentageDiscount: null,
  settingsId: null,
  isLoading: true,
};

export const getShopItems = createAsyncThunk('items/getShopItems', async (dataFromComponent, thunkAPI) => {
  try {
    //console.log('optional data from component =>', dataFromComponent);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());
    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const { data } = await getAllActiveItems();
    // console.log('getShopItems data in itemsSlice', data);
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
      //console.log('cartTotal after adding item to cart', current(state).cartTotal);

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

      //console.log('state.cartItems after removed item', current(state.cartItems));
    },

    increaseItemAmount: (state, { payload }) => {
      const shopItem = state.shopItems.find((item) => item._id === payload.id);
      shopItem.amount++;
    },
    setItemAmount: (state, { payload }) => {
      const shopItem = state.shopItems.find((item) => item._id === payload.id);
      shopItem.amount = payload.amount;
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
    addNewShopItem: (state, { payload }) => {
      state.shopItems.push(payload);
      //console.log('current shop orders  =>', current(state).shopOrders);
    },
    updateShopItem: (state, { payload }) => {
      state.shopItems = state.shopItems.filter((item) => item._id !== payload._id);
      state.shopItems.push(payload);
      //console.log('current shop items in updateShopItem  =>', current(state).shopItems);
    },
    updateAppInitialSettings: (state, { payload }) => {
      state.orderDeliveryFee = payload.deliveryFee;
      state.amountForFreeDelivery = payload.minForFreeDelivery;
      state.isFreeDeliveryForAll = payload.isFreeDeliveryForAll;
      state.percentageDiscount = payload.discount;
    },
    removeShopItem: (state, { payload }) => {
      state.shopItems = state.shopItems.filter((item) => item._id !== payload.id);

      //console.log('current shop items in updateShopItem  =>', current(state).shopItems);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShopItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShopItems.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.shopItems = payload.items;

        //update shop settings values
        state.orderDeliveryFee = payload.generalData.deliveryFee;
        state.amountForFreeDelivery = payload.generalData.minForFreeDelivery;
        state.isFreeDeliveryForAll = payload.generalData.isFreeDeliveryForAll;
        state.percentageDiscount = payload.generalData.discount;
        state.settingsId = payload.generalData._id;
      })
      .addCase(getShopItems.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { updateAppInitialSettings, clearCart, addToCart, removeFromCart, increaseItemAmount, decreaseItemAmount, setItemAmount, addNewShopItem, updateShopItem, removeShopItem } =
  itemsSlice.actions;
export default itemsSlice.reducer;
