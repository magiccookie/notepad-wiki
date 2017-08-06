/*
 *
 * HomePage actions
 *
 */

import {
  GET_LATEST_POSTS,
  PUT_LATEST_POSTS,
} from './constants';

export function getLatestPosts() {
  return { type: GET_LATEST_POSTS };
}

export function fetchSuccess(posts) {
  console.log('Posts fetched');
  return {
    type: PUT_LATEST_POSTS,
    payload: posts
  };
}

export function fetchError(posts) {
  console.log('Posts fetch error');
  return ;
}
