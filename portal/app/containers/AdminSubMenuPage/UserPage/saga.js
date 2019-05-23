import { take, call, put, fork, takeLatest, takeEvery } from 'redux-saga/effects';

import api from '../../../utils/apiRequest';

import { getTripleDES } from '../../../utils/tripleDES';

import { sendingRequest, setExpGrpList, setRoleList, setCpList } from '../../App/actions';

import { GET_GRPS_LIST, GET_ROLE_LIST, GET_CP_LIST } from '../../App/constants';

import {
  GET_USER_LIST,
  CHG_SEARCH_TEXT,
  UPDATE_USER_STATUS,
  ADD_USR,
  GET_USER_LIST_REFRESH,
  GET_USER_LIST_FETCH,
  DEL_USR,
} from './constants';

import { setUserList, sendingSearchRequest, setErrorMsg, addSuccessResp } from './actions';

export function* userListFlow() {
  yield put(sendingRequest(true));
  yield take(GET_USER_LIST);
  const resp = yield call(api.getUserList);
  if (resp.responseCode === '000') {
    yield put(setUserList(resp));
  }
  yield put(sendingRequest(false));
}

export function* userListFetchSaga() {
  yield put(sendingRequest(true));
  const resp = yield call(api.getUserList);
  if (resp.responseCode === '000') {
    yield put(setUserList(resp));
  }
  yield put(sendingRequest(false));
}

export function* userListFetchFlow() {
  yield takeEvery(GET_USER_LIST_FETCH, userListFetchSaga);
}

export function* userListRefreshFlow() {
  yield put(sendingRequest(true));
  yield take(GET_USER_LIST_REFRESH);
  const resp = yield call(api.getUserList);
  if (resp.responseCode === '000') {
    yield put(setUserList(resp));
  }
  yield put(sendingRequest(false));
}

export function* searchSaga(resp) {
  yield put(sendingSearchRequest(true));
  const { data } = resp;
  const encryptedData = getTripleDES(data);
  const respSearch = yield call(api.searchUserList, encryptedData);
  if (respSearch.responseCode === '000') {
    yield put(setUserList(respSearch));
  } else if (respSearch.responseCode === '404') {
    yield put(setUserList(respSearch.responseMsg));
  }
  yield put(sendingSearchRequest(false));
}

export function* searchFlow() {
  yield takeLatest(CHG_SEARCH_TEXT, searchSaga);
}

export function* updateUserStatusSaga(data) {
  yield put(sendingSearchRequest(true));

  const { userId, cpId, roleId, userBlockFlag, textPw } = data.data;
  const respUpdate = yield call(api.updateUserStatus, userId, cpId, roleId, userBlockFlag, textPw);
  if (respUpdate.responseCode === '000') {
    const resp = yield call(api.getUserList);
    yield put(setUserList(resp));
  }
  yield put(sendingSearchRequest(false));
}

export function* updateUserStatusFlow() {
  yield takeLatest(UPDATE_USER_STATUS, updateUserStatusSaga);
}

export function* grpsListFlow() {
  yield take(GET_GRPS_LIST);
  const resp = yield call(api.getExpGrpList);
  if (resp.responseCode === '000') {
    yield put(setExpGrpList(resp));
  }
}

export function* roleListFlow() {
  yield take(GET_ROLE_LIST);
  const resp = yield call(api.getRoleList);
  if (resp.responseCode === '000') {
    yield put(setRoleList(resp));
  }
}

export function* cpListFlow() {
  yield take(GET_CP_LIST);
  const resp = yield call(api.getCpList);
  if (resp.responseCode === '000') {
    yield put(setCpList(resp));
  }
}

export function* addUsrFlow() {
  while (true) {
    const data = yield take(ADD_USR);
    yield put(sendingRequest(true));
    const { textName, textEmail, textPw, selGender, selCp, roleId, selBlock } = data.data;
    const resp = yield call(api.addUsr, textName, textEmail, textPw, selGender, selCp, roleId, selBlock);
    if (resp.responseCode === '000') {
      const respUsrList = yield call(api.getUserList);
      if (respUsrList.responseCode === '000') {
        yield put(setUserList(respUsrList));
        yield put(addSuccessResp(true));
      }
    } else if (resp.responseCode === '404') {
      yield put(setErrorMsg(resp.responseMsg));
    }
    yield put(sendingRequest(false));
  }
}

export function* delUsrFlow() {
  while (true) {
    const data = yield take(DEL_USR);
    const userId = data.data;
    const resp = yield call(api.delUsr, userId);
    if (resp.responseCode === '000') {
      yield put(sendingRequest(true));
      const respList = yield call(api.getUserList);
      if (respList.responseCode === '000') {
        yield put(setUserList(respList));
      }
      yield put(sendingRequest(false));
    }
  }
}

export default function* rootSaga() {
  yield fork(userListFlow);
  yield fork(searchFlow);
  yield fork(updateUserStatusFlow);
  yield fork(grpsListFlow);
  yield fork(roleListFlow);
  yield fork(cpListFlow);
  yield fork(addUsrFlow);
  yield fork(userListRefreshFlow);
  yield fork(userListFetchFlow);
  yield fork(delUsrFlow);
}
