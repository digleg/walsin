import { take, call, put, fork, takeLatest } from 'redux-saga/effects';

import api from '../../../utils/apiRequest';

import { getTripleDES } from '../../../utils/tripleDES';

import { sendingRequestM } from '../../App/actions';

import { GET_FUNCTION_LIST, GET_GRP_LIST, ADD_FUNC, UPDATE_FUNC, DEL_FUNC, CHG_SEARCH_TEXT } from './constants';

import { setFunctionList, setGrpList } from './actions';

export function* functionListFlow() {
  while (true) {
    yield take(GET_FUNCTION_LIST);
    yield put(sendingRequestM(true));
    const resp = yield call(api.getFunctionList);
    if (resp.responseCode === '000') {
      yield put(setFunctionList(resp));
    }
    yield put(sendingRequestM(false));
  }
}

export function* grpListSaga() {
  const resp = yield call(api.getGrpList);
  if (resp.responseCode === '000') {
    yield put(setGrpList(resp.grps));
  }
}

export function* grpListFlow() {
  yield takeLatest(GET_GRP_LIST, grpListSaga);
}

export function* addFuncSaga(data) {
  const { textFuncName, textFuncUrl, selGrpId, selHidFlg, selParentId } = data.data;
  const resp = yield call(api.addFunc, textFuncName, textFuncUrl, selGrpId, selHidFlg, selParentId);
  if (resp.responseCode === '000') {
    yield put(sendingRequestM(true));
    const respFunc = yield call(api.getFunctionList);
    if (respFunc.responseCode === '000') {
      yield put(setFunctionList(respFunc));
    }
    yield put(sendingRequestM(false));
  }
}

export function* addFuncFlow() {
  yield takeLatest(ADD_FUNC, addFuncSaga);
}

export function* updateFuncSaga(data) {
  const { textFuncName, textFuncUrl, selGrpId, selHidFlg, funcId, selParentId } = data.data;
  const resp = yield call(api.updateFunc, textFuncName, textFuncUrl, selGrpId, selHidFlg, funcId, selParentId);
  if (resp.responseCode === '000') {
    yield put(sendingRequestM(true));
    const respFunc = yield call(api.getFunctionList);
    if (respFunc.responseCode === '000') {
      yield put(setFunctionList(respFunc));
    }
    yield put(sendingRequestM(false));
  }
}

export function* updateFuncFlow() {
  yield takeLatest(UPDATE_FUNC, updateFuncSaga);
}

export function* delFuncSaga(data) {
  const { functionId } = data.data;
  const resp = yield call(api.delFunc, functionId);
  if (resp.responseCode === '000') {
    yield put(sendingRequestM(true));
    const respFunc = yield call(api.getFunctionList);
    if (respFunc.responseCode === '000') {
      yield put(setFunctionList(respFunc));
    }
    yield put(sendingRequestM(false));
  }
}

export function* delFuncFlow() {
  yield takeLatest(DEL_FUNC, delFuncSaga);
}

export function* searchSaga(resp) {
  const { data } = resp;
  const encryptedData = getTripleDES(data);
  yield put(sendingRequestM(true));
  const respSearch = yield call(api.getFunctionListSearch, encryptedData);
  if (respSearch.responseCode === '000') {
    yield put(setFunctionList(respSearch));
    yield put(sendingRequestM(false));
  }
}

export function* searchFlow() {
  yield takeLatest(CHG_SEARCH_TEXT, searchSaga);
}

export default function* rootSaga() {
  yield fork(functionListFlow);
  yield fork(grpListFlow);
  yield fork(addFuncFlow);
  yield fork(updateFuncFlow);
  yield fork(delFuncFlow);
  yield fork(searchFlow);
}
