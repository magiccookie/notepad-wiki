import { take, call, cancel, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { push } from 'react-router-redux';

import { fromJS } from 'immutable';

import * as c from './constants';
import * as a from './actions';
import * as s from './selectors';
import * as r from 'utils/request';

function* authWithCredits(action) {
  const credits = action.payload;

  try {
    const result = yield call(r.requestAuth, credits);

    const token = result.get('token');
    const payload = fromJS(JSON.parse(atob(token.split('.')[1])));
    yield put(a.authSuccess(payload));

    localStorage.setItem('jwt-token', token);

  } catch (err) {
    yield put(a.authError(err));
  }
}

function* authWithToken() {
  const loggedIn = yield select(s.makeSelectLoggedIn);

  if (!loggedIn) {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      try {
        const result = yield call(r.requestCheckUser, token);
        console.log('result ', result);
        const payload = result;
        yield put(a.authSuccess(payload));
      } catch (err) {
        yield put(a.authError(err));
      }
    }
  }
}

function* authLogOut() {
  if (localStorage.getItem('jwt-token')) {
    localStorage.removeItem('jwt-token');
  }

  yield put(a.wipeAuthState());
  yield put(push('/'));
}

function* unauthorizedTask() {
  if (localStorage.getItem('jwt-token')) {
    localStorage.removeItem('jwt-token');
  }

  yield put(a.wipeAuthState());
  yield put(push('/login/'));
}

function* signIn() {
  const watcher = yield takeLatest(c.AUTHORIZE, authWithCredits);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* logOut() {
  const watcher = yield takeLatest(c.LOG_OUT, authLogOut);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* checkAuth() {
  const watcher = yield takeLatest(c.CHECK_AUTH, authWithToken);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* Unauthorized() {
  const watcher = yield takeLatest(c.UNAUTHORIZED, unauthorizedTask);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  signIn,
  logOut,
  checkAuth,
  Unauthorized,
];
