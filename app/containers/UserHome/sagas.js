import { take, call, cancel, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import * as c from './constants';
import * as a from './actions';
import * as r from 'utils/request';

function* fetchPostsTask() {
  const token = localStorage.getItem('jwt-token');

  if (token) {
    try {
      const result = yield call(r.fetchPosts, token);
      yield put(a.fetchSuccess(result));
    } catch (err) {
      yield put(a.fetchError(err));
    }
  }
}

function* deleteNoteTask(action) {
  const token = localStorage.getItem('jwt-token');
  const id = action.payload.get("id");

  if (token) {
    try {
      const result = yield call(r.deleteNote, id, token);
      yield put(a.deleteSuccess(result));
    } catch (err) {
      yield put(a.deleteError(err));
    }
  }
}

function* fetchPostsWatcher() {
  const watcher = yield takeLatest(c.GET_LATEST_POSTS, fetchPostsTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* deleteNoteWatcher() {
  const watcher = yield takeLatest(c.DELETE_NOTE, deleteNoteTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  fetchPostsWatcher,
  deleteNoteWatcher,
];
