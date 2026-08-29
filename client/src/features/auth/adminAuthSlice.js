import { createSlice } from "@reduxjs/toolkit";

// Separate Redux slice for admin auth state, mirroring the backend's
// structural separation - never shares state with authSlice.
const initialState = {
  user: null,
  accessToken: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearAdminCredentials(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setAdminCredentials, clearAdminCredentials } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;