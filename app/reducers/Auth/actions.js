/*
 *
 * Auth actions
 *
 */

import * as c from './constants';

export function Authorize(authCredits) {
  return {
    type: c.AUTHORIZE,
    payload: authCredits,
  };
}

export function checkAuth() {
  return { type: c.CHECK_AUTH };
}

export function logOut() {
  return { type: c.LOG_OUT };
}

export function changeAuthState(authState) {
  return {
    type: c.CHANGE_AUTH_STATE,
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
  return { type: c.UNAUTHORIZED };
}

export function wipeAuthState() {
  return { type: c.WIPE_AUTH_STATE };
}
