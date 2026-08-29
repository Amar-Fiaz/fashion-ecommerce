import { createSlice } from "@reduxjs/toolkit";

// Customer auth state. accessToken is intentionally in-memory only
// (not localStorage), per ARCHITECTURE.md Section 5's security
// posture - it's lost on a hard refresh by design, and restored via
// a silent refresh using the httpOnly refreshToken cookie.
const initialState = {
  user: null,
  accessToken: null,
  authChecked: false, // becomes true once the initial silent-refresh attempt completes (success or fail)
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
    },
    setAuthChecked(state) {
      state.authChecked = true;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;