import { call, takeLatest, fork, put } from 'redux-saga/effects';
import { GET_SYS_LIST } from './constants';
import { setSysList } from './actions';
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

export default function* rootSaga() {
  yield fork(getSysListFlow);
}
