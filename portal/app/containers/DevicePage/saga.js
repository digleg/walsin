import { take, call, put, fork, takeEvery, cancel, cancelled } from 'redux-saga/effects';
import api from '../../utils/apiRequest';

import { sendingRequest, sendingRequestS, sendingRequestM } from '../App/actions';
import { GET_GW_LIST, GET_SENSOR_LIST, SET_DEV_BY_ADMIN, DEL_DEV_BY_ADMIN, EDIT_DEV_BY_ADMIN } from './constants';
import { getGwListResp, getSensorListResp, setErrMsg, setSuccMsg } from './actions';

// GET_GW_LIST
export function* getGwListFlow() {
  while (true) {
    yield take(GET_GW_LIST);
    yield put(sendingRequest(true));
    const resp = yield call(api.getGWList);
    if (resp.responseCode === '000') {
      yield put(getGwListResp(resp));
    }
    yield put(sendingRequest(false));
  }
}

// GET_SENSOR_LIST
export function* getSensorListFlow() {
  while (true) {
    yield take(GET_SENSOR_LIST);
    yield put(sendingRequestS(true));
    const resp = yield call(api.getSensorList);
    if (resp.responseCode === '000') {
      yield put(getSensorListResp(resp));
    }
    yield put(sendingRequestS(false));
  }
}

export function* setDevByAdminSaga(data) {
  try {
    yield put(sendingRequestM(true));
    const resp = yield call(api.addDevByAdmin, data.data);
    if (resp.responseCode === '000') {
      const respGWList = yield call(api.getGWList);
      if (respGWList.responseCode === '000') {
        yield put(getGwListResp(respGWList));
        yield put(setSuccMsg(resp.responseMsg));
      }
      const respSensorList = yield call(api.getSensorList);
      if (respSensorList.responseCode === '000') {
        yield put(getSensorListResp(respSensorList));
        yield put(setSuccMsg(resp.responseMsg));
      }
    } else if (resp.responseCode === '999') {
      yield put(setErrMsg(resp.responseMsg[0].msg));
    } else if (resp.responseCode === '401') {
      yield put(setErrMsg(resp.responseMsg));
    }
  } catch (error) {
    yield put(setErrMsg(error));
  } finally {
    yield put(sendingRequestM(false));
  }
}

export function* setDevByAdminFlow() {
  yield takeEvery(SET_DEV_BY_ADMIN, setDevByAdminSaga);
}

export function* delDevByAdminSaga(data) {
  const resp = yield call(api.delDevByAdmin, data.data);
  if (resp.responseCode === '000') {
    const respGWList = yield call(api.getGWList);
    if (respGWList.responseCode === '000') {
      yield put(getGwListResp(respGWList));
    }
    const respSensorList = yield call(api.getSensorList);
    if (respSensorList.responseCode === '000') {
      yield put(getSensorListResp(respSensorList));
    }
  }
}

export function* delDevByAdminFlow() {
  yield takeEvery(DEL_DEV_BY_ADMIN, delDevByAdminSaga);
}

export function* editDevByAdminSaga(data) {
  const resp = yield call(api.editDevByAdmin, data.data);
  if (resp.responseCode === '000') {
    const respGWList = yield call(api.getGWList);
    if (respGWList.responseCode === '000') {
      yield put(getGwListResp(respGWList));
    }
    const respSensorList = yield call(api.getSensorList);
    if (respSensorList.responseCode === '000') {
      yield put(getSensorListResp(respSensorList));
    }
  }
}

export function* editDevByAdminFlow() {
  yield takeEvery(EDIT_DEV_BY_ADMIN, editDevByAdminSaga);
}

export default function* rootSaga() {
  yield fork(getGwListFlow);
  yield fork(getSensorListFlow);
  yield fork(setDevByAdminFlow);
  yield fork(delDevByAdminFlow);
  yield fork(editDevByAdminFlow);
}
