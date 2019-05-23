import { take, call, put, fork, takeLatest } from 'redux-saga/effects';

import api from '../../../utils/apiRequest';

import { sendingRequestM } from '../../App/actions';

import { GET_EXP_GRP_LIST, ADD_EXP_GRP, UPDATE_EXP_GRP, DELETE_EXP_GRP } from './constants';

import { setExpGrpList } from './actions';

export function* userListFlow() {
  while (true) {
    yield take(GET_EXP_GRP_LIST);
    yield put(sendingRequestM(true));
    const resp = yield call(api.getExpGrpList);
    if (resp.responseCode === '000') {
      yield put(setExpGrpList(resp));
    }
    yield put(sendingRequestM(false));
  }
}

export function* addExpGrpSaga(data) {
  const { textExpGrpName } = data.data;
  const resp = yield call(api.addExpGrp, textExpGrpName);
  if (resp.responseCode === '000') {
    yield put(sendingRequestM(true));
    const respFunc = yield call(api.getExpGrpList);
    if (respFunc.responseCode === '000') {
      yield put(setExpGrpList(respFunc));
    }
    yield put(sendingRequestM(false));
  }
}

export function* addExpGrpFlow() {
  yield takeLatest(ADD_EXP_GRP, addExpGrpSaga);
}

export function* updateExpGrpSaga(data) {
  const { textExpGrpName, textExpGrpId } = data.data;
  const resp = yield call(api.updateExpGrp, textExpGrpName, textExpGrpId);
  if (resp.responseCode === '000') {
    yield put(sendingRequestM(true));
    const respFunc = yield call(api.getExpGrpList);
    if (respFunc.responseCode === '000') {
      yield put(setExpGrpList(respFunc));
    }
    yield put(sendingRequestM(false));
  }
}

export function* updateExpGrpFlow() {
  yield takeLatest(UPDATE_EXP_GRP, updateExpGrpSaga);
}

export function* deleteExpGrpSaga(data) {
  const { textExpGrpId } = data.data;
  const resp = yield call(api.deleteExpGrp, textExpGrpId);
  if (resp.responseCode === '000') {
    yield put(sendingRequestM(true));
    const respFunc = yield call(api.getExpGrpList);
    if (respFunc.responseCode === '000') {
      yield put(setExpGrpList(respFunc));
    }
    yield put(sendingRequestM(false));
  }
}

export function* deleteExpGrpFlow() {
  yield takeLatest(DELETE_EXP_GRP, deleteExpGrpSaga);
}

export default function* rootSaga() {
  yield fork(userListFlow);
  yield fork(addExpGrpFlow);
  yield fork(updateExpGrpFlow);
  yield fork(deleteExpGrpFlow);
}
