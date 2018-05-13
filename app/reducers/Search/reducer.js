import { fromJS } from 'immutable';

import * as c from './constants';

const initialState = fromJS({
  results: [],
});

export function searchReducer(state = initialState, action) {
  switch (action.type) {
    case c.SEARCH_SUCCESS:
      return state.set('results', action.payload);
    case c.SEARCH_ERROR:
      return initialState;
    default:
      return state;
  }
}
