import { createSelector } from 'reselect';

const selectAuthState = (state) => state.get('auth');

export const makeSelectAuthState = createSelector(
  selectAuthState,
  (auth) => auth.get('authState')
);
