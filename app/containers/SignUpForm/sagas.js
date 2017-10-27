import { take, call, cancel, put, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import * as c from './constants';
import * as r from '../../utils/request';
import * as a from './actions';

export function* signupTask(action) {
  const credentials = action.payload;

  try {
    const result = yield call(r.signup, credentials);
    yield put(a.signupSuccess(result));
  } catch (err) {
    yield put(a.signupError(err));
  }
}

function* signupWatcher() {
  const watcher = yield takeLatest(c.SIGNUP, signupTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  signupWatcher,
];
