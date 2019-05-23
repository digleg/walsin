/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */

import { call, fork, put, takeLatest } from 'redux-saga/effects';
import api from '../../utils/apiRequest';
import { GET_EVENT_LIST, GET_SENSOR_LIST_BY_FPORT, GET_REPORT_LIST } from './constants';
import { setEventList, setSensorListByfport, setFportList, errMsg } from './actions';
import { sendingRequestL } from '../App/actions';

export function* getEventListSaga(data) {
  yield put(sendingRequestL(true));
  const respEvtType = yield call(api.getEventType);
  if (respEvtType.responseCode === '000') {
    const fportList = [];
    for (let k = 0; k < respEvtType.data.length; k += 1) {
      fportList.push(respEvtType.data[k]._id);
    }
    yield put(setFportList(fportList));

    const eventListObj = {};
    for (let i = 0; i < respEvtType.data.length; i += 1) {
      const apiObj = {};
      if ('fport' in data.data) {
        apiObj.fport = data.data.fport;
      } else if (!('fport' in data.data)) {
        apiObj.fport = respEvtType.data[i]._id;
      }
      if ('limit' in data.data) {
        apiObj.limit = data.data.limit;
      }
      if ('pagi' in data.data) {
        apiObj.pagi = data.data.pagi[i];
      }
      if ('macAddr' in data.data) {
        if (data.data.macAddr !== null && data.data.macAddr !== '') {
          apiObj.macAddr = data.data.macAddr;
        }
      }
      if ('date' in data.data) {
        if (data.data.date[0] !== '' || data.data.date[1] !== '') {
          apiObj.date = data.data.date;
        }
      }
      if ('fileName' in data.data) {
        apiObj.fileName = data.data.fileName;
      }
      if ('search' in data.data) {
        apiObj.search = data.data.search;
      }
      const respEventList = yield call(api.getEventList, apiObj);
      eventListObj[respEvtType.data[i].showTitle] = respEventList;
      for (let j = 0; j < Object.keys(respEvtType.data[i]).length; j += 1) {
        eventListObj[respEvtType.data[i].showTitle][Object.keys(respEvtType.data[i])[j]] = Object.values(respEvtType.data[i])[j];
      }
    }
    yield put(setEventList(eventListObj));
  }
  yield put(sendingRequestL(false));
}

export function* getEventListFlow() {
  yield takeLatest(GET_EVENT_LIST, getEventListSaga);
}

export function* getSensorListByfportSaga(data) {
  const { tabValue } = data.data;
  const respEvtType = yield call(api.getEventType);
  if (respEvtType.responseCode === '000') {
    const fportList = [];
    for (let i = 0; i < respEvtType.data.length; i += 1) {
      fportList.push(respEvtType.data[i]._id);
    }
    const respSenList = yield call(api.getSensorByfport, fportList[tabValue]);
    if (respSenList.responseCode === '000') {
      yield put(setSensorListByfport(respSenList.mList));
    } else {
      yield put(setSensorListByfport([]));
    }
  }
}

export function* getSensorListByfportFlow() {
  yield takeLatest(GET_SENSOR_LIST_BY_FPORT, getSensorListByfportSaga);
}

export function* getReportListSaga(data) {
  const apiObj = {};
  const respEvtType = yield call(api.getEventType);
  if (respEvtType.responseCode === '000') {
    if ('tabValue' in data.data) {
      apiObj.fport = respEvtType.data[data.data.tabValue]._id;
    }
    if ('macAddr' in data.data) {
      if (data.data.macAddr !== null && data.data.macAddr !== '') {
        apiObj.macAddr = data.data.macAddr;
      }
    }
    if ('date' in data.data) {
      if (data.data.date[0] !== '' || data.data.date[1] !== '') {
        apiObj.date = data.data.date;
      }
    }
    if ('fileName' in data.data) {
      apiObj.fileName = data.data.fileName;
    }
    const rptCntResp = yield call(api.getReportCnt, apiObj);
    if (rptCntResp.total !== 0) {
      yield call(api.getReportList, apiObj);
    } else {
      yield put(errMsg('Find No Event Data to Report'));
    }
  }
}

export function* getReportListFlow() {
  yield takeLatest(GET_REPORT_LIST, getReportListSaga);
}

export default function* rootSaga() {
  yield fork(getEventListFlow);
  yield fork(getSensorListByfportFlow);
  yield fork(getReportListFlow);
}
