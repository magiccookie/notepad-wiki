import * as c from './constants';

export function signup(credentials) {
  return { type: c.SIGNUP, payload: credentials };
}

export function signupSuccess() {
  return { type: "REPORT", payload: "Signup success" };
}

export function signupError(err) {
  return { type: "ERROR", payload: err };
}
