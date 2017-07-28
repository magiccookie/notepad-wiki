import { take, call, cancel, put, select, takeLatest } from 'redux-saga/effects';
import { requestAuth } from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';

import { AUTHORIZE } from '../../reducers/Auth/constants';
import { authSuccess, authError, wipeTmpCredits } from '../../reducers/Auth/actions';
import { makeSelectTmpCredits } from '../../reducers/Auth/selectors';

function* signIn() {
  const credits = yield select(makeSelectTmpCredits);

  try {
    const result = yield call(requestAuth, credits);
    console.log('Auth action fired');
    yield put(wipeTmpCredits());

    const token = JSON.stringify(result.get('token'));
    const payload = JSON.parse(atob(token.split('.')[1]));

    localStorage.setItem('token', token);

    yield put(authSuccess(payload));
  } catch (err) {
    yield put(authError(err));
  }
}

function* authData() {
  const watcher = yield takeLatest(AUTHORIZE, signIn);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  authData,
];
