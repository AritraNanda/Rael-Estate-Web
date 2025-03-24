import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStaff: null,
  error: null,
  loading: false,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    // Sign-in reducers
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentStaff = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Sign-out reducers
    signOutStaffStart: (state) => {
      state.loading = true;
    },
    signOutStaffSuccess: (state) => {
      state.currentStaff = null;
      state.loading = false;
      state.error = null;
    },
    signOutStaffFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Update staff reducers
    updateStaffStart: (state) => {
      state.loading = true;
    },
    updateStaffSuccess: (state, action) => {
      state.currentStaff = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateStaffFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutStaffStart,
  signOutStaffSuccess,
  signOutStaffFailure,
  updateStaffStart,
  updateStaffSuccess,
  updateStaffFailure,
} = staffSlice.actions;

export default staffSlice.reducer; 