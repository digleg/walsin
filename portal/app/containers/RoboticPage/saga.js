import { call, takeLatest, fork, put } from 'redux-saga/effects';
import {
  GET_ROBOTIC_LIST,
  GET_SCRIPT_LIST,
  UPLOAD_RASCRIPT,
  DELETE_RA_SCRIPT,
  EDIT_RA_SCRIPT,
  UPDATE_RA_SCRIPT,
  GET_EXEC_HISTORY,
} from './constants';
import { setRoboticList, setScriptList, setExecHistoryList, setDate, setAll, setScriptListRespMsg } from './actions';
import api from '../../utils/apiRequest';
import { sendingRequestS, sendingRequestM } from '../App/actions';

import dateArr from './dateArr';

export function* getRoboticListSaga() {
  yield put(sendingRequestM(true));
  const resp = yield call(api.getRoboticList);
  if (resp.responseCode === '000') {
    yield put(setRoboticList(resp));
    yield put(sendingRequestM(false));
  }
}

export function* getRoboticListFlow() {
  yield takeLatest(GET_ROBOTIC_LIST, getRoboticListSaga);
}

export function* getScriptListSaga() {
  yield put(sendingRequestM(true));
  const resp = yield call(api.getScriptList);
  if (resp.responseCode === '000') {
    yield put(setScriptList(resp));
    yield put(sendingRequestM(false));
  } else if (resp.responseCode === '404') {
    // responseMsg : "no exist data"
    yield put(setScriptListRespMsg(resp.responseMsg));
    yield put(sendingRequestM(false));
  }
}

export function* getScriptListFlow() {
  yield takeLatest(GET_SCRIPT_LIST, getScriptListSaga);
}

export function* uploadRAScriptSaga(data) {
  const { file, textName, textDesc, textVersion } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.uploadRAScript, file, textName, textDesc, textVersion);
  if (resp.responseCode === '000') {
    const respScriptList = yield call(api.getScriptList);
    if (respScriptList.responseCode === '000') {
      yield put(setScriptList(respScriptList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* uploadRAScriptFlow() {
  yield takeLatest(UPLOAD_RASCRIPT, uploadRAScriptSaga);
}

export function* deleteRAScriptSaga(data) {
  const { id } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.deleteRAScript, id);
  if (resp.responseCode === '000') {
    const respScriptList = yield call(api.getScriptList);
    if (respScriptList.responseCode === '000') {
      yield put(setScriptList(respScriptList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* deleteRAScriptFlow() {
  yield takeLatest(DELETE_RA_SCRIPT, deleteRAScriptSaga);
}

export function* editRAScriptSaga(data) {
  const { id, file, textName, textDesc, textVersion } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.editRAScript, id, file, textName, textDesc, textVersion);
  if (resp.responseCode === '000') {
    const respScriptList = yield call(api.getScriptList);
    if (respScriptList.responseCode === '000') {
      yield put(setScriptList(respScriptList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* editRAScriptFlow() {
  yield takeLatest(EDIT_RA_SCRIPT, editRAScriptSaga);
}

export function* updateRAScriptSaga(data) {
  const { RAId, scriptId } = data.data;
  yield put(sendingRequestM(true));
  const resp = yield call(api.updateRAScript, RAId, scriptId);
  if (resp.responseCode === '000') {
    const respRoboticList = yield call(api.getRoboticList);
    if (respRoboticList.responseCode === '000') {
      yield put(setRoboticList(respRoboticList));
      yield put(sendingRequestM(false));
    }
  }
}

export function* updateRAScriptFlow() {
  yield takeLatest(UPDATE_RA_SCRIPT, updateRAScriptSaga);
}

export function* getExecHistorySaga(data) {
  const { qTime, skip } = data.data;
  yield put(sendingRequestS(true));
  let resp = yield call(api.getExecHistory, 'RoboticArm', 'B827EB815AB4', 'status', qTime, 5, skip);
  let index;
  for (index = 0; index < dateArr.length; index += 1) {
    if (dateArr[index] === qTime) {
      break;
    }
  }
  while (resp.responseCode === '404') {
    index -= 1;
    resp = yield call(api.getExecHistory, 'RoboticArm', 'B827EB815AB4', 'status', dateArr[index], 5, skip);
  }
  if (resp.responseCode === '000') {
    const respAll = yield call(api.getExecHistory, 'RoboticArm', 'B827EB815AB4', 'status', dateArr[index], 1000, 0);
    yield put(setExecHistoryList(resp));
    yield put(setDate(dateArr[index]));
    yield put(setAll(respAll.eList.length));
    yield put(sendingRequestS(false));
  }
}

export function* getExecHistoryFlow() {
  yield takeLatest(GET_EXEC_HISTORY, getExecHistorySaga);
}

// GET_EXEC_HISTORY

export default function* rootSaga() {
  yield fork(getRoboticListFlow);
  yield fork(getScriptListFlow);
  yield fork(uploadRAScriptFlow);
  yield fork(deleteRAScriptFlow);
  yield fork(editRAScriptFlow);
  yield fork(getExecHistoryFlow);
}
