/*
 *
 * signUp reducer
 *
 */

import { fromJS } from 'immutable';
import * as c from './constants';

const initialState = fromJS({});

function signUpReducer(state = initialState, action) {
  switch (action.type) {
    case c.SIGNUP:
      return state;
    default:
      return state;
  }
}

export default signUpReducer;
