/*
 *
 * Auth actions
 *
 */

import {
  AUTHORIZE,
  WIPE_TMP_CREDITS,
  CHANGE_AUTH_STATE,
  WIPE_AUTH_STATE,
} from './constants';

export function Authorize(tmpCredits) {
  return {
    type: AUTHORIZE,
    payload: tmpCredits,
  };
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
  return { type: WIPE_AUTH_STATE };
}

export function wipeTmpCredits() {
  return { type: WIPE_TMP_CREDITS };
}

export function wipeAuthState() {
  return { type: WIPE_AUTH_STATE };
}
