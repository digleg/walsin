import { call, takeLatest, fork, put } from 'redux-saga/effects';
import { GET_SYS_LIST, ADD_SYS, EDIT_SYS, DELETE_SYS, CHG_SEARCH_TEXT } from './constants';
import { setSysList, errorMsg } from './actions';
import { sendingRequestM } from '../../App/actions';
import api from '../../../utils/apiRequest';

export function* getSysListSaga() {
  yield put(sendingRequestM(true));
  const resp = yield call(api.getSysList);
  if (resp.responseCode === '000') {
    yield put(setSysList(resp));
  }
  yield put(sendingRequestM(false));
}

export function* getSysListFlow() {
  yield takeLatest(GET_SYS_LIST, getSysListSaga);
}

export function* addSysSaga(data) {
  const { textSysName, textSysDesc, textSysValue, textSysType } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.addSys, textSysName, textSysDesc, textSysValue, textSysType);
  if (resp.responseCode === '000') {
    const respSysList = yield call(api.getSysList);
    if (respSysList.responseCode === '000') {
      yield put(setSysList(respSysList));
      yield put(sendingRequestM(false));
    }
  } else if (resp.responseCode === '401') {
    yield put(errorMsg(resp.responseMsg));
    yield put(sendingRequestM(false));
  }
}

export function* addSysFlow() {
  yield takeLatest(ADD_SYS, addSysSaga);
}

export function* editSysSaga(data) {
  const { textSysName, textSysDesc, textSysValue, textSysType } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.editSys, textSysName, textSysDesc, textSysValue, textSysType);
  if (resp.responseCode === '000') {
    const respSysList = yield call(api.getSysList);
    if (respSysList.responseCode === '000') {
      yield put(setSysList(respSysList));
      yield put(sendingRequestM(false));
    }
  } else if (resp.responseCode === '401') {
    yield put(errorMsg(resp.responseMsg));
    yield put(sendingRequestM(false));
  }
}

export function* editSysFlow() {
  yield takeLatest(EDIT_SYS, editSysSaga);
}

export function* deleteSysSaga(data) {
  yield put(sendingRequestM(true));
  const resp = yield call(api.deleteSys, data.data);
  if (resp.responseCode === '000') {
    const respSysList = yield call(api.getSysList);
    if (respSysList.responseCode === '000') {
      yield put(setSysList(respSysList));
      yield put(sendingRequestM(false));
    }
  } else if (resp.responseCode === '401' || resp.responseCode === '999') {
    yield put(errorMsg(resp.responseMsg));
    yield put(sendingRequestM(false));
  }
}

export function* deleteSysFlow() {
  yield takeLatest(DELETE_SYS, deleteSysSaga);
}

export function* searchSaga(resp) {
  const { data } = resp;
  yield put(sendingRequestM(true));
  const respSearch = yield call(api.searchSysList, data);
  if (respSearch.responseCode === '000') {
    yield put(setSysList(respSearch));
    yield put(sendingRequestM(false));
  }
}

export function* searchFlow() {
  yield takeLatest(CHG_SEARCH_TEXT, searchSaga);
}

export default function* rootSaga() {
  yield fork(getSysListFlow);
  yield fork(addSysFlow);
  yield fork(editSysFlow);
  yield fork(deleteSysFlow);
  yield fork(searchFlow);
}
