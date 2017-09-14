/*
 *
 * Auth reducer
 *
 */

import { fromJS } from 'immutable';

import * as c from './constants';

const emptyProfile = { username: "" };

const initialState = fromJS({
  loggedIn: false,
  profile: emptyProfile,
});

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case c.CHANGE_AUTH_STATE:
      return state.set('loggedIn', action.payload.loggedIn)
                  .set('profile', action.payload.profile);
    case c.WIPE_AUTH_STATE:
      return state.set('loggedIn', false)
                  .set('profile', emptyProfile);
    default:
      return state;
  }
}
