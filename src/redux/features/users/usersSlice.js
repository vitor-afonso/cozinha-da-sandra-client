// jshint esversion:9

// eslint-disable-next-line no-unused-vars
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getAllUsers, getOneUser } from 'api';

const initialState = {
  shopUsers: [],
  isLoading: true,
};

export const getShopUsers = createAsyncThunk('users/getShopUsers', async (userId, thunkAPI) => {
  try {
    //console.log('optional data from component =>', userId);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());
    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const { data } = userId ? await getOneUser(userId) : await getAllUsers();

    return userId ? [data] : data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message); // this would be handled by extraReducers getShopUsers.rejected in usersSlice
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateShopUser: (state, { payload }) => {
      state.shopUsers = state.shopUsers.filter((item) => item._id !== payload._id);
      state.shopUsers.push(payload);
      //console.log('current shop users in updateShopUser   =>', current(state).shopUsers);
    },
    deleteShopUser: (state, { payload }) => {
      state.shopUsers = state.shopUsers.filter((user) => user._id !== payload._id);
      state.shopUsers.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShopUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShopUsers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.shopUsers = payload;
      })
      .addCase(getShopUsers.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { updateShopUser, deleteShopUser } = usersSlice.actions;
export default usersSlice.reducer;
