/* eslint-disable no-constant-condition */

import { put, call, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import api from '../../utils/apiRequest';

import { LOGIN_REQUEST } from './constants';
import { loginStatusChange, loginResp, getFocusMenu } from '../App/actions';
import { loginSuccess } from '../DashboardIioT/actions';
import { loginError } from './actions';
import { setAuthToken, setRole, setFormState, setLoginStatus, setUsername, setPassword } from '../../utils/storageUtility';

function* loginSaga(request) {
  const { username, password } = request.data;
  setUsername(username);
  setPassword(password);
  const resp = yield call(api.login, username, password, '0');
  if (resp.responseCode === '000') {
    setFormState(resp);
    yield put(loginResp(resp));
    yield put(loginStatusChange(true));
    yield put(loginSuccess(true));
    setLoginStatus(true);
    yield call(setRole, resp.role);
    yield call(setAuthToken, resp.authToken);
    yield put(push('/dashboard'));
    yield put(getFocusMenu('DASHBOARD'));
  } else {
    yield put(loginError({ status: true, msg: resp.responseMsg }));
  }
}

export default function* rootSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
}
