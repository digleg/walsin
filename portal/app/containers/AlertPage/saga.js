// import { take, call, put, select } from 'redux-saga/effects';

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */
import { call, fork, put, takeLatest } from 'redux-saga/effects';
import api from '../../utils/apiRequest';
import { GET_ALERT_LIST, ADD_ALERT_LIST, DEL_ALERT_LIST, GET_ALERT_LIST_WITH_FPORT } from './constants';
import { setFportList, setAlertList, setAlertListByFport, errMsg } from './actions';

export function* getAlertListSaga(data) {
  console.log('getAlertListSaga data:', data);

  const apiObj = {};
  if ('fport' in data.data) {
    apiObj.fport = data.data.fport;
  }
  if ('limit' in data.data) {
    apiObj.limit = data.data.limit;
  }
  if ('page' in data.data) {
    apiObj.page = data.data.page;
  }
  if ('paginate' in data.data) {
    apiObj.paginate = data.data.paginate;
  }
  if ('sort' in data.data) {
    apiObj.sort = data.data.sort;
  }
  console.log('apiObj:', apiObj);

  const queryAlertList = yield call(api.getAlertList, apiObj);
  console.log('queryAlertList:', queryAlertList);

  if (queryAlertList.responseCode === '000' && queryAlertList.total !== 0) {
    const alertList = {};
    for (let k = 0; k < queryAlertList.data.length; k += 1) {
      alertList[k] = queryAlertList.data[k];
    }
    const alertInfo = {
      alertList: alertList,
      alertListTotal: queryAlertList.total,
    };
    yield put(setAlertList(alertInfo));
  } else {
    yield put(errMsg('Find No Alert Rules to Report'));
  }
}

export function* getAlertListFlow() {
  yield takeLatest(GET_ALERT_LIST, getAlertListSaga);
}

export function* addAlertListSaga(data) {
  console.log('addAlertListSaga data : ', data);
  const respAddAlertList = yield call(api.addAlertList, data.data);
  console.log('respAddAlertList: ', respAddAlertList);
  if (respAddAlertList.responseCode === '000') {
    const queryAlertList = yield call(api.getAlertList, {});
    console.log('queryAlertList:', queryAlertList);
    if (queryAlertList.responseCode === '000' && queryAlertList.total !== 0) {
      const alertList = {};
      for (let k = 0; k < queryAlertList.data.length; k += 1) {
        alertList[k] = queryAlertList.data[k];
      }
      const alertInfo = {
        alertList: alertList,
        alertListTotal: queryAlertList.total,
      };
      yield put(setAlertList(alertInfo));
    } else {
      yield put(errMsg('Find No Alert Rules to Report'));
    }
  }
}

export function* addAlertListFlow() {
  yield takeLatest(ADD_ALERT_LIST, addAlertListSaga);
}

export function* delAlertListSaga(data) {
  console.log('delAlertListSaga data : ', data);

  const respDelAlertList = yield call(api.delAlertList, data.data.id);
  console.log('respDelAlertList: ', respDelAlertList);

  const queryAlertList = yield call(api.getAlertList, {});
  console.log('queryAlertList:', queryAlertList);
  if (queryAlertList.responseCode === '000' && queryAlertList.total !== 0) {
    const alertList = {};
    for (let k = 0; k < queryAlertList.data.length; k += 1) {
      alertList[k] = queryAlertList.data[k];
    }
    const alertInfo = {
      alertList: alertList,
      alertListTotal: queryAlertList.total,
    };
    yield put(setAlertList(alertInfo));
  } else {
    yield put(setAlertList({}));
    // yield put(errMsg('Find No Alert Rules to Report'));
  }
}

export function* delAlertListFlow() {
  yield takeLatest(DEL_ALERT_LIST, delAlertListSaga);
}

export function* getAlertListWithFportSaga(data) {
  console.log('getAlertListWithFportSaga:', data);
  const apiObj = {};
  if (data.data.fport === undefined) {
    return;
  }
  apiObj.fport = data.data.fport;
  console.log('apiObj:', apiObj);
  const queryAlertList = yield call(api.getAlertList, apiObj);
  console.log('queryAlertList:', queryAlertList);
  if (queryAlertList.responseCode === '000') {
    const alertList = {};
    for (let k = 0; k < queryAlertList.data.length; k += 1) {
      alertList[k] = queryAlertList.data[k];
    }
    const alertInfo = {
      alertList: alertList,
      alertListTotal: queryAlertList.total,
    };
    console.log('alertInfo:', alertInfo);
    // yield put(setAlertListByFport(alertInfo));
    yield put(setAlertList(alertInfo));
  } else {
    yield put(errMsg('Find No Alert Rules to Report'));
  }
}

export function* getAlertListWithFportFlow() {
  yield takeLatest(GET_ALERT_LIST_WITH_FPORT, getAlertListWithFportSaga);
}

export default function* rootSaga() {
  yield fork(getAlertListFlow);
  yield fork(addAlertListFlow);
  yield fork(delAlertListFlow);
  yield fork(getAlertListWithFportFlow);
}
