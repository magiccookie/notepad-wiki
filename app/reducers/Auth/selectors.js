import { createSelector } from 'reselect';

const selectAuthState = (state) => state.get('auth');

export const makeSelectLoggedIn = createSelector(
  selectAuthState,
  (auth) => auth.get('loggedIn')
);

export const makeSelectProfile = createSelector(
  selectAuthState,
  (auth) => auth.get('profile')
);
