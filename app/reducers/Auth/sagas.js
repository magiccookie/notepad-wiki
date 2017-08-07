import { take, call, cancel, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';

import {
  AUTHORIZE,
  CHECK_AUTH,
  LOG_OUT,
} from '../../reducers/Auth/constants';

import {
  authSuccess,
  authError,
  wipeTmpCredits,
  wipeAuthState,
} from '../../reducers/Auth/actions';
import { push } from 'react-router-redux';

import {
  makeSelectTmpCredits,
  makeSelectLoggedIn,
} from '../../reducers/Auth/selectors';

import {
  requestAuth,
  requestCheckUser,
} from 'utils/request';

function* authWithCredits() {
  const credits = yield select(makeSelectTmpCredits);

  try {
    const result = yield call(requestAuth, credits);
    console.log('Auth action fired');
    yield put(wipeTmpCredits());

    const token = result.get('token');
    const payload = fromJS(JSON.parse(atob(token.split('.')[1])));
    yield put(authSuccess(payload));

    localStorage.setItem('jwt-token', token);

  } catch (err) {
    yield put(authError(err));
  }
}

function* authWithToken() {
  const loggedIn = yield select(makeSelectLoggedIn);

  if (!loggedIn) {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      try {
        const result = yield call(requestCheckUser, token);
        console.log('result ', result);
        const payload = result;
        yield put(authSuccess(payload));
      } catch (err) {
        yield put(authError(err));
      }
    }
  }
}

function* authLogOut() {
  if (localStorage.getItem('jwt-token')) {
    localStorage.removeItem('jwt-token');
  }

  yield put(wipeAuthState());
  yield put(push('/'));
}

function* signIn() {
  const watcher = yield takeLatest(AUTHORIZE, authWithCredits);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* logOut() {
  const watcher = yield takeLatest(LOG_OUT, authLogOut);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

function* checkAuth() {
  const watcher = yield takeLatest(CHECK_AUTH, authWithToken);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  signIn,
  logOut,
  checkAuth,
];
