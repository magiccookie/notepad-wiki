/*
 *
 * UserHome reducer
 *
 */

import { fromJS } from 'immutable';

import * as c from './constants';

const initialState = fromJS({
  posts: [],
});

export function postsReducer(state = initialState, action) {
  switch (action.type) {
    case c.PUT_LATEST_POSTS:
      return state.set('posts', action.payload);
    case c.DELETE_NOTE:
      return state.set('posts', state.get('posts').delete(action.index));
    default:
      return state;
  }
}

export default postsReducer;
