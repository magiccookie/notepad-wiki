/*
 *
 * Auth actions
 *
 */

import {
  AUTHORIZE,
  CHANGE_AUTH_STATE,
  WIPE_AUTH_STATE,
  CHECK_AUTH,
  LOG_OUT,
  UNAUTHORIZED
} from './constants';

export function Authorize(authCredits) {
  return {
    type: AUTHORIZE,
    payload: authCredits,
  };
}

export function checkAuth() {
  return { type: CHECK_AUTH };
}

export function logOut() {
  return { type: LOG_OUT };
}

export function changeAuthState(authState) {
  return {
    type: CHANGE_AUTH_STATE,
    payload: authState,
  };
}

export function authSuccess(authState) {
  console.log('Login success: ', authState);
  return {
    type: CHANGE_AUTH_STATE,
    payload: { loggedIn: true, profile: authState },
  };
}

export function authError(err) {
  console.log('Login error: ', err);
  return { type: UNAUTHORIZED };
}

export function wipeAuthState() {
  return { type: WIPE_AUTH_STATE };
}
