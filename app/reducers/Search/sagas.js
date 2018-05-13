import { take, call, cancel, put, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { fromJS } from 'immutable';

import * as c from './constants';
import * as a from './actions';
import * as r from 'utils/request';

function* searchTask(action) {
  const queryString = action.payload;
  const token = localStorage.getItem('jwt-token');

  try {
    const result = yield call(r.searchNotes,
                              queryString,
                              token);
    yield put(a.searchSuccess(result));

  } catch (err) {
    yield put(a.searchError(err));
  }
}


function* searchWatcher() {
  const watcher = yield takeLatest(c.SEARCH,
                                   searchTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


export default [
  searchWatcher,
];
