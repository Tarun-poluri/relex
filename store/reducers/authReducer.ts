import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ email: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    loginFailure: (state, action: PayloadAction<string | null>) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = action.payload;
      state.isLoading = false;
    },
    rehydrateAuth: (state, action: PayloadAction<{ email: string } | null>) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload;
      } else {
        state.isLoggedIn = false;
        state.user = null;
      }
      state.isLoading = false;
    },
  },
});

export const { setLoading, loginSuccess, loginFailure, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
