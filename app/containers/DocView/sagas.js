import { take, call, cancel, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import * as c from './constants'

import {
  getNoteByName,
  fetchSuccess,
  fetchError,
} from './actions';

import { fetchNote } from 'utils/request';

function* fetchNoteTask(action) {
  const token = localStorage.getItem('jwt-token');
  const noteName = action.payload;

  if (token) {
    try {
      const result = yield call(fetchNote, noteName, token);
      yield put(fetchSuccess(result));
    } catch (err) {
      yield put(fetchError(err));
    }
  }
}

function* getNoteWatcher() {
  const watcher = yield takeLatest(c.GET_NOTE, fetchNoteTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  getNoteWatcher,
];
