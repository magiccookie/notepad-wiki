/*
 *
 * UserHome actions
 *
 */

import * as c from './constants';

export function deleteNote(id, index) {
  return { type: c.DELETE_NOTE, payload: id, index: index};
}

export function deleteSuccess(status) {
  console.log('Post deleted');
  return { type: 'REPORT', payload: status };
}

export function deleteError(err) {
  console.log('Post delete error');
  return { type: 'ERROR', payload: err };
}

export function getLatestPosts() {
  return { type: c.GET_LATEST_POSTS };
}

export function fetchSuccess(posts) {
  console.log('Posts fetched');
  return { type: c.PUT_LATEST_POSTS, payload: posts };
}

export function fetchError(posts) {
  console.log('Posts fetch error');
  return { type: 'ERROR' };
}
