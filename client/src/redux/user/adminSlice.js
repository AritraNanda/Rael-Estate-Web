import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentAdmin: null,
  error: null,
  loading: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Sign-in reducers
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Sign-out reducers
    signOutAdminStart: (state) => {
      state.loading = true;
    },
    signOutAdminSuccess: (state) => {
      state.currentAdmin = null;
      state.loading = false;
      state.error = null;
    },
    signOutAdminFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Update admin reducers
    updateAdminStart: (state) => {
      state.loading = true;
    },
    updateAdminSuccess: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateAdminFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutAdminStart,
  signOutAdminSuccess,
  signOutAdminFailure,
  updateAdminStart,
  updateAdminSuccess,
  updateAdminFailure,
} = adminSlice.actions;

export default adminSlice.reducer; 