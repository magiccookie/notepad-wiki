/*
 *
 * Auth reducer
 *
 */

import { fromJS } from 'immutable';

import {
  AUTHORIZE,
  WIPE_TMP_CREDITS,
  CHANGE_AUTH_STATE,
  WIPE_AUTH_STATE,
} from './constants';

const emptyProfile = { username: "" };

const initialState = fromJS({
  loggedIn: false,
  profile: emptyProfile,
  tmp_auth_credits: {},
});

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHORIZE:
      return state.set('tmp_auth_credits', action.payload);
    case WIPE_TMP_CREDITS:
      return state.set('tmp_auth_credits', {});
    case CHANGE_AUTH_STATE:
      return state.set('loggedIn', action.payload.loggedIn)
                  .set('profile', action.payload.profile);
    case WIPE_AUTH_STATE:
      return state.set('loggedIn', false)
                  .set('profile', emptyProfile);
    default:
      return state;
  }
}
