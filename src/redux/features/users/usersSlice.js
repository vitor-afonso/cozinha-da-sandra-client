// jshint esversion:9

import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getAllUsers } from '../../../api';

const initialState = {
  shopUsers: [],
  isLoading: true,
};

export const getShopUsers = createAsyncThunk('users/getShopUsers', async (dataFromComponent, thunkAPI) => {
  try {
    //console.log('optional data from component =>', dataFromComponent);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());
    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const { data } = await getAllUsers();
    console.log('getShopUsers data in usersSlice', data);
    return data; // we return a promise that is being handled by extraReducers in usersSlice
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message); // this would be handled by extraReducers getShopUsers.rejected in usersSlice
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {
    [getShopUsers.pending]: (state) => {
      state.isLoading = true;
    },
    [getShopUsers.fulfilled]: (state, action) => {
      //console.log('action on fulfilled', action);
      state.isLoading = false;
      state.shopUsers = action.payload;
    },
    [getShopUsers.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const {} = usersSlice.actions;
export default usersSlice.reducer;
