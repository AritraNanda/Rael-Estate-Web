import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSeller: null,
  error: null,
  loading: false,
  subscription: null,
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    // Sign-in reducers
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentSeller = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Sign-out reducers
    signOutSellerStart: (state) => {
      state.loading = true;
    },
    signOutSellerSuccess: (state) => {
      state.currentSeller = null;
      state.subscription = null;
      state.loading = false;
      state.error = null;
    },
    signOutSellerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Update seller reducers
    updateSellerStart: (state) => {
      state.loading = true;
    },
    updateSellerSuccess: (state, action) => {
      state.currentSeller = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateSellerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Delete seller reducers
    deleteSellerStart: (state) => {
      state.loading = true;
    },
    deleteSellerSuccess: (state) => {
      state.currentSeller = null;
      state.subscription = null;
      state.loading = false;
      state.error = null;
    },
    deleteSellerFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Subscription reducers
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    clearSubscription: (state) => {
      state.subscription = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSellerStart,
  signOutSellerSuccess,
  signOutSellerFailure,
  updateSellerStart,
  updateSellerSuccess,
  updateSellerFailure,
  deleteSellerStart,
  deleteSellerSuccess,
  deleteSellerFailure,
  setSubscription,
  clearSubscription,
} = sellerSlice.actions;

export default sellerSlice.reducer;