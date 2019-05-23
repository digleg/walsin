import { call, takeLatest, fork, put } from 'redux-saga/effects';
import { GET_GRP_LIST, ADD_GRP, EDIT_GRP, DELETE_GRP, CHG_SEARCH_TEXT } from './constants';
import { setGrpList } from './actions';
import { sendingRequestM } from '../../App/actions';
import api from '../../../utils/apiRequest';

export function* getGrpListSaga() {
  yield put(sendingRequestM(true));
  const resp = yield call(api.getGrpList);
  if (resp.responseCode === '000') {
    yield put(setGrpList(resp));
  }
  yield put(sendingRequestM(false));
}

export function* getGrpListFlow() {
  yield takeLatest(GET_GRP_LIST, getGrpListSaga);
}

export function* addGrpSaga(data) {
  const { textGrpName } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.addGrp, textGrpName);
  if (resp.responseCode === '000') {
    const respGrpList = yield call(api.getGrpList);
    if (respGrpList.responseCode === '000') {
      yield put(setGrpList(respGrpList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* addGrpFlow() {
  yield takeLatest(ADD_GRP, addGrpSaga);
}

export function* editGrpSaga(data) {
  const { textGrpName, grpId } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.editGrp, textGrpName, grpId);
  if (resp.responseCode === '000') {
    const respGrpList = yield call(api.getGrpList);
    if (respGrpList.responseCode === '000') {
      yield put(setGrpList(respGrpList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* editGrpFlow() {
  yield takeLatest(EDIT_GRP, editGrpSaga);
}

export function* deleteGrpSaga(data) {
  const { grpId } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.deleteGrp, grpId);
  if (resp.responseCode === '000' || resp.responseCode === '999') {
    const respGrpList = yield call(api.getGrpList);
    if (respGrpList.responseCode === '000') {
      yield put(setGrpList(respGrpList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* deleteGrpFlow() {
  yield takeLatest(DELETE_GRP, deleteGrpSaga);
}

export function* searchSaga(resp) {
  const { data } = resp;
  yield put(sendingRequestM(true));
  const respSearch = yield call(api.searchGrpList, data);
  if (respSearch.responseCode === '000') {
    yield put(setGrpList(respSearch));
  }
  yield put(sendingRequestM(false));
}

export function* searchFlow() {
  yield takeLatest(CHG_SEARCH_TEXT, searchSaga);
}

export default function* rootSaga() {
  yield fork(getGrpListFlow);
  yield fork(addGrpFlow);
  yield fork(editGrpFlow);
  yield fork(deleteGrpFlow);
  yield fork(searchFlow);
}
