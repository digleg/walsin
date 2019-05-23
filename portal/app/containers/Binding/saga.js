/* eslint-disable no-constant-condition */

import { take, call, put, fork } from 'redux-saga/effects';

import api from '../../utils/apiRequest';

import { CODE_BINDING } from './constants';
import { bindingCodeResp } from './actions';

export function* bindingFlow() {
  while (true) {
    const request = yield take(CODE_BINDING);
    const { d } = request.data;
    const resp = yield call(api.bindingLoraGateway, d);
    yield put(bindingCodeResp(resp));
  }
}

export default function* rootSaga() {
  yield fork(bindingFlow);
}
