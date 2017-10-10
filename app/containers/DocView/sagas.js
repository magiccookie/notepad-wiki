import { delay } from 'redux-saga';
import { take, call, cancel, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { push } from 'react-router-redux';

import * as c from './constants'
import * as a from './actions';
import * as s from './selectors';
import * as r from 'utils/request';

function* fetchNoteTask(action) {
  const token = localStorage.getItem('jwt-token');
  const noteName = action.payload;

  if (token) {
    try {
      const result = yield call(r.fetchNote, noteName, token);
      yield put(a.fetchSuccess(result));
    } catch (err) {
      yield put(a.fetchError(err));
    }
  }
}

function* modifyNoteTask() {
  // debounce by 500ms
  const interval = 500;
  yield call(delay, interval);

  const token = localStorage.getItem('jwt-token');
  const note = yield select(s.selectActiveNote);

  if (token) {
    try {
      const result = yield call(r.modifyNote, note, token);
      yield put(a.modifySuccess(result));
    } catch (err) {
      yield put(a.modifyError(err));
    }
  }
}

function* saveNoteTask() {
  const token = localStorage.getItem('jwt-token');
  const note = yield select(s.selectCreatedNote);

  if (token) {
    try {
      const result = yield call(r.createNote, note, token);
      yield put(a.createSuccess(result));
      yield put(push('/')); // hack due to https://github.com/ReactTraining/react-router/issues/4578
      yield put(push(`/note/${note.get("name")}/`));
    } catch (err) {
      yield put(a.createError(err));
    }
  }
}

function* errorTask() {
  yield put(push('/'));
}

function* resetTask() {
  yield put(a.resetState());
}

function* getNoteWatcher() {
  const watcher = yield takeLatest(c.GET_NOTE, fetchNoteTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* modifyNoteWatcher() {
  const watcher = yield takeLatest([c.UPDATE_ACTIVE_NOTE_CONTENT, c.UPDATE_ACTIVE_NOTE_HEADER], modifyNoteTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* saveNoteWatcher() {
  const watcher = yield takeLatest(c.SAVE_NOTE, saveNoteTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* errorWatcher() {
  const watcher = yield takeLatest(c.FETCH_NOTE_ERROR, errorTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* resetWatcher() {
  const watcher = yield takeLatest(LOCATION_CHANGE, resetTask);
  yield take(LOCATION_CHANGE);
  yield call(delay, 10); // silly hack
  yield cancel(watcher);
}

export default [
  getNoteWatcher,
  modifyNoteWatcher,
  saveNoteWatcher,
  errorWatcher,
  resetWatcher,
];
