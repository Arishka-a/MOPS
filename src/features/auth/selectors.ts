import type { RootState } from '../../app/store';

export const selectAuthToken = (state: RootState): string | null =>
  state.auth.token;

export const selectAuthUsername = (state: RootState): string | null =>
  state.auth.username;

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.token !== null;
