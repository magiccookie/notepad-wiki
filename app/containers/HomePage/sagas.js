import { take, call, cancel, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { GET_LATEST_POSTS } from './constants';

import {
  fetchSuccess,
  fetchError,
} from './actions';

import { fetchPosts } from 'utils/request';

function* fetchPostsTask() {
  const token = localStorage.getItem('jwt-token');

  try {
    const result = yield call(fetchPosts, token);
    yield put(fetchSuccess(result));
  } catch (err) {
    yield put(fetchError(err));
  }
}

function* fetchPostsWatcher() {
  const watcher = yield takeLatest(GET_LATEST_POSTS, fetchPostsTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  fetchPostsWatcher,
];
