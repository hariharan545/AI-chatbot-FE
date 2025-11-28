import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    googleLoginRequested(state) {
      state.loading = true;
    },
    googleLoginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
    },
    googleLoginFailure(state) {
      state.loading = false;
    },
    meRequested(state) {
      state.loading = true;
    },
    meLoaded(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;


