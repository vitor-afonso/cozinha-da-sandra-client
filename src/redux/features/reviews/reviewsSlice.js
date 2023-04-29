// jshint esversion:9

// eslint-disable-next-line no-unused-vars
import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { getAllReviews } from 'api';

const initialState = {
  shopReviews: [],
  averageRating: 0,
  numberOfReviews: 0,
  isLoading: true,
};

function calculateReviewsData(data) {
  const ratingTotal = data.reduce((accumulator, review) => accumulator + review.rating, 0);
  const averageRating = Math.round(ratingTotal / data.length / 0.5) * 0.5;
  const numberOfReviews = data.length;
  return { averageRating, numberOfReviews };
}

export const getShopReviews = createAsyncThunk('items/getShopReviews', async (dataFromComponent, thunkAPI) => {
  try {
    //console.log('optional data from component =>', dataFromComponent);
    //console.log('thunkAPI =>', thunkAPI); // contains valious methods
    //console.log('all states in the app through thunkAPI =>', thunkAPI.getState());

    //thunkAPI.dispatch(openModal()); //thunkAPI.dispatch would allow us to call an action from another feature

    const { data } = await getAllReviews();
    const { averageRating, numberOfReviews } = calculateReviewsData(data);
    // console.log('getShopReviews data in reviewsSlice', data);
    return { data, averageRating, numberOfReviews }; // we return a promise that is being handled by extraReducers in reviewsSlice
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message); // this would be handled by extraReducers getShopReviews.rejected in reviewsSlice
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    confirmReview: (state, { payload }) => {
      const oneReview = state.shopReviews.find((review) => review._id === payload.id);
      oneReview.status = 'confirmed';

      //we have to use current if want to see the current state or it returns [PROXY]
      //console.log('current shop reviews  =>', current(state).shopReviews);
    },
    addNewShopReview: (state, { payload }) => {
      state.shopReviews.unshift(payload);
      const { averageRating, numberOfReviews } = calculateReviewsData(state.shopReviews);
      state.averageRating = averageRating;
      state.numberOfReviews = numberOfReviews;
      //console.log('reviewsSlice - current shop reviews after adding new review =>', current(state).shopReviews);
    },
    deleteShopReview: (state, { payload }) => {
      state.shopReviews = state.shopReviews.filter((review) => review !== payload.id);
    },
    updateShopReviews: (state, { payload }) => {
      state.shopReviews = state.shopReviews.filter((review) => review._id !== payload._id);
      state.shopReviews.push(payload);
      //console.log('current shop reviews in updateShopReviews   =>', current(state).shopReviews);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShopReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShopReviews.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.shopReviews = payload.data.reverse();
        state.averageRating = payload.averageRating;
        state.numberOfReviews = payload.numberOfReviews;
      })
      .addCase(getShopReviews.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { confirmReview, deleteShopReview, confirmPayment, addNewShopReview, updateShopReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
