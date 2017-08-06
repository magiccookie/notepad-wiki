/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';

import {
  PUT_LATEST_POSTS,
} from './constants';

const initialState = fromJS({
  posts: [],
});

export function postsReducer(state = initialState, action) {
  switch (action.type) {
    case PUT_LATEST_POSTS:
      return state.set('posts', action.payload);
    default:
      return state;
  }
}

export default postsReducer;
