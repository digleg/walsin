import { call, put, takeLatest, fork } from 'redux-saga/effects';
import { GET_CP_LIST, ADD_CP, DELETE_CP, EDIT_CP, CHG_SEARCH_TEXT, GET_GRP_LIST } from './constants';
import { setCpList, setGrpList } from './actions';
import { sendingRequestM } from '../../App/actions';
import api from '../../../utils/apiRequest';

export function* getCpListSaga() {
  yield put(sendingRequestM(true));
  const resp = yield call(api.getCpList);
  if (resp.responseCode === '000') {
    yield put(setCpList(resp));
    yield put(sendingRequestM(false));
  }
}

export function* getCpListFlow() {
  yield takeLatest(GET_CP_LIST, getCpListSaga);
}

export function* addCpSaga(data) {
  const { textCpName, grpId } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.addCp, textCpName);
  let index = 0;
  if (resp.responseCode === '000') {
    const respCpList = yield call(api.getCpList);
    for (let i = 0; i < respCpList.cps.length; i += 1) {
      if (respCpList.cps[i].cpName === textCpName) {
        index = i;
      }
    }
    const grpsArr = [];
    for (let j = 0; j < grpId.length; j += 1) {
      grpsArr.push({ id: grpId[j] });
    }
    const respFinalList = yield call(api.updateGrpbyCp, respCpList.cps[index].cpId, grpsArr);
    if (respFinalList.responseCode === '000') {
      const respCpListFinal = yield call(api.getCpList);
      if (respCpListFinal.responseCode === '000') {
        yield put(setCpList(respCpListFinal));
        yield put(sendingRequestM(false));
      }
    }
  }
}

export function* addCpFlow() {
  yield takeLatest(ADD_CP, addCpSaga);
}

export function* deleteCpSaga(data) {
  yield put(sendingRequestM(true));
  const resp = yield call(api.deleteCp, data.data);
  if (resp.responseCode === '000') {
    const respCpList = yield call(api.getCpList);
    if (respCpList.responseCode === '000') {
      yield put(setCpList(respCpList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* deleteCpFlow() {
  yield takeLatest(DELETE_CP, deleteCpSaga);
}

export function* editCpSaga(data) {
  const { cpId, textCpName, grpId } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.editCp, cpId, textCpName);
  const grpsArr = [];
  for (let j = 0; j < grpId.length; j += 1) {
    grpsArr.push({ id: grpId[j] });
  }

  const respUpdateGrpId = yield call(api.updateGrpbyCp, cpId, grpsArr);
  if (resp.responseCode === '000' && respUpdateGrpId.responseCode === '000') {
    const respCpList = yield call(api.getCpList);
    if (respCpList.responseCode === '000') {
      yield put(setCpList(respCpList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* editCpFlow() {
  yield takeLatest(EDIT_CP, editCpSaga);
}

export function* searchSaga(resp) {
  const { data } = resp;
  yield put(sendingRequestM(true));
  const respSearch = yield call(api.searchCpList, data);
  if (respSearch.responseCode === '000') {
    yield put(setCpList(respSearch));
  }
  yield put(sendingRequestM(false));
}

export function* searchFlow() {
  yield takeLatest(CHG_SEARCH_TEXT, searchSaga);
}

export function* getGrpListSaga() {
  yield put(sendingRequestM(true));
  const resp = yield call(api.getGrpList);
  if (resp.responseCode === '000') {
    yield put(setGrpList(resp));
    yield put(sendingRequestM(false));
  }
}

export function* getGrpListFlow() {
  yield takeLatest(GET_GRP_LIST, getGrpListSaga);
}

export default function* rootSaga() {
  yield fork(getCpListFlow);
  yield fork(addCpFlow);
  yield fork(deleteCpFlow);
  yield fork(editCpFlow);
  yield fork(searchFlow);
  yield fork(getGrpListSaga);
}
