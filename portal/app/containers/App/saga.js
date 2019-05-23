// eslint-disable
/* eslint-disable no-constant-condition */

import { put, take, fork, call, takeLatest } from 'redux-saga/effects';
import api from '../../utils/apiRequest';

import { LOGOUT_REQUEST, GLOBAL_DATA } from './constants';
import { loginStatusChange, sendingRequest, setFunctionList } from './actions';

import { logoutSuccessMsg } from '../LoginPage/actions';

import { renderMenu } from '../Main/actions';

import { getAuthToken, removeAuthToken, removeElectDataTmp, removeRole } from '../../utils/storageUtility';

export function* logoutSaga() {
  const token = getAuthToken();
  const resp = yield call(api.logout, token);
  if (resp.responseCode === '000') {
    yield put(loginStatusChange(false));
    yield call(removeAuthToken);
    yield call(removeElectDataTmp);
    yield call(removeRole);
    yield put(renderMenu({}));
    yield put(logoutSuccessMsg(resp.responseMsg));
  } else {
    //
  }
}

export function* logoutFlow() {
  yield takeLatest(LOGOUT_REQUEST, logoutSaga);
}

export function* globalDataFlow() {
  while (true) {
    yield put(sendingRequest(true));
    yield take(GLOBAL_DATA);
    const resp = yield call(api.getFunctionList);
    // const { functions } = getFormState();
    if (resp.responseCode === '000') {
      yield put(setFunctionList(resp));
    }
    yield put(sendingRequest(false));
  }
}

// GLOBAL_DATA
// GET_GRPS_LIST

export default function* rootSaga() {
  yield fork(logoutFlow);
  yield fork(globalDataFlow);
}
