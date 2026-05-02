import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './types';

const initialState: AuthState = {
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; username: string }>,
    ) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.username = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
