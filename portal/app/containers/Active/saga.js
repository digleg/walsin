/* eslint-disable no-constant-condition */

import { take, call, put, fork } from 'redux-saga/effects';

import api from '../../utils/apiRequest';

import { CODE_ACTIVE } from './constants';
import { activeCodeResp } from './actions';

export function* activeFlow() {
  while (true) {
    const request = yield take(CODE_ACTIVE);
    const { d } = request.data;
    const resp = yield call(api.activeLoraGateway, d);
    yield put(activeCodeResp(resp));
  }
}

export default function* rootSaga() {
  yield fork(activeFlow);
}
