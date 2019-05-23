import { take, call, put, fork, takeLatest } from 'redux-saga/effects';

import api from '../../../utils/apiRequest';

// import { getTripleDES } from '../../../utils/tripleDES';

import { sendingRequest, sendingRequestS } from '../../App/actions';

import {
  GET_ROLE_LIST,
  GET_FUNCTION_LIST,
  ADD_ROLE,
  GET_GRP_LIST,
  UPDATE_ROLE_BY_GRP,
  DELETE_ROLE,
  CHG_SEARCH_TEXT,
  GET_FUNC_LIST_W_SEARCH,
  UPDATE_ROLE_BY_FUNC,
  UPDATE_FUNC,
} from './constants';

import { setRoleList, setFunctionList, setGrpList, setFuncListWSearch, refresh } from './actions';

// import { getFormState } from '../../../utils/storageUtility';

export function* roleListFlow() {
  // eslint-disable-next-line
  while (true) {
    yield take(GET_ROLE_LIST);
    yield put(sendingRequest(true));
    const resp = yield call(api.getRoleList);
    if (resp.responseCode === '000') {
      yield put(setRoleList(resp));
    }
    yield put(sendingRequest(false));
  }
}

export function* searchSaga(resp) {
  const { data } = resp;
  yield put(sendingRequest(true));
  const respSearch = yield call(api.getRoleListSearch, data);
  if (respSearch.responseCode === '000') {
    yield put(setRoleList(respSearch));
    yield put(sendingRequest(false));
  }
}

export function* searchFlow() {
  yield takeLatest(CHG_SEARCH_TEXT, searchSaga);
}

export function* functionListFlow() {
  yield put(sendingRequest(true));
  yield take(GET_FUNCTION_LIST);
  const resp = yield call(api.getFunctionList);
  if (resp.responseCode === '000') {
    yield put(setFunctionList(resp.funcs));
  }
  yield put(sendingRequest(false));
}

export function* addRoleSaga(data) {
  const { selDataLevel, textRoleName, grpId } = data.data;
  yield put(sendingRequest(true));
  const respAddRole = yield call(api.addRole, selDataLevel, textRoleName);
  let index = 0;
  if (respAddRole.responseCode === '000') {
    // Update Role By Group Start
    const resp = yield call(api.getRoleList);
    for (let i = 0; i < resp.roles.length; i += 1) {
      if (resp.roles[i].roleName === textRoleName) {
        index = i;
      }
    }
    const grpsArr = [];
    for (let j = 0; j < grpId.length; j += 1) {
      grpsArr.push({ id: grpId[j], sortId: j + 1, createFlg: 1, updateFlg: 1, deleteFlg: 1 });
    }
    const respUpdate = yield call(api.updateRoleByGrp, resp.roles[index].roleId, grpsArr, 'GRole');
    if (respUpdate.responseCode === '000') {
      const respGet = yield call(api.getRoleList);
      if (respGet.responseCode === '000') {
        yield put(setRoleList(respGet));
        yield put(sendingRequest(false));
      }
    }
  }
}

export function* addRoleFlow() {
  yield takeLatest(ADD_ROLE, addRoleSaga);
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

export function* updateRoleByGrpSaga(data) {
  const resp = yield call(api.updateRoleByGrp, data.data.catId, data.data.grps, data.data.type);
  if (resp.responseCode === '000') {
    yield put(sendingRequest(true));
    const respRole = yield call(api.getRoleList);
    if (respRole.responseCode === '000') {
      yield put(setRoleList(respRole));
    }
    yield put(sendingRequest(false));
  }
}

export function* updateRoleByGrpFlow() {
  yield takeLatest(UPDATE_ROLE_BY_GRP, updateRoleByGrpSaga);
}

export function* deleteRoleSaga(data) {
  const { delRoleId } = data.data;
  const resp = yield call(api.deleteRole, delRoleId);
  if (resp.responseCode === '000') {
    yield put(sendingRequest(true));
    const respRole = yield call(api.getRoleList);
    if (respRole.responseCode === '000') {
      yield put(setRoleList(respRole));
    }
    yield put(sendingRequest(false));
  }
}

export function* deleteRoleFlow() {
  yield takeLatest(DELETE_ROLE, deleteRoleSaga);
}

const comparer = otherArray => {
  // eslint-disable-next-line
  return function(current) {
    return (
      // eslint-disable-next-line
      otherArray.filter(function(other) {
        return other.functionId === current.functionId && other.functionName === current.functionName;
      }).length === 0
    );
  };
};

export function* getFuncListWSearchSaga(data) {
  yield put(sendingRequestS(true));
  const { roleId, funcList } = data.data;
  const resp = yield call(api.getFunctionListSearch, roleId);
  if (resp.responseCode === '000' && funcList !== undefined) {
    const funcListWSearch = resp.funcs;
    const onlyInA = funcList.filter(comparer(funcListWSearch));
    yield put(setFuncListWSearch({ funcListWSearch, funcListWOSearch: onlyInA }));
  }
  yield put(sendingRequestS(false));
}

export function* getFuncListWSearchFlow() {
  yield takeLatest(GET_FUNC_LIST_W_SEARCH, getFuncListWSearchSaga);
}

export function* updateRoleByFuncSaga(data) {
  yield put(sendingRequestS(true));
  const resp = yield call(api.updateRoleByFunc, data.data.catId, data.data.func, data.data.type);
  if (resp.responseCode === '000') {
    yield put(refresh(true));
  }
  yield put(sendingRequestS(false));
}

export function* updateRoleByFuncFlow() {
  yield takeLatest(UPDATE_ROLE_BY_FUNC, updateRoleByFuncSaga);
}

export function* updateFuncSaga(data) {
  const { funcId, funcName, funcUrl, parentId, sortId, grpId, hiddenFlg } = data.data;
  const resp = yield call(api.updateFuncinRole, funcId, funcName, funcUrl, parentId, sortId, grpId, hiddenFlg);
  if (resp.responseCode === '000') {
    const respFunc = yield call(api.getFunctionList);
    if (respFunc.responseCode === '000') {
      yield put(setFunctionList(respFunc));
    }
  }
}

export function* updateFuncFlow() {
  yield takeLatest(UPDATE_FUNC, updateFuncSaga);
}

export default function* rootSaga() {
  yield fork(roleListFlow);
  yield fork(functionListFlow);
  yield fork(searchFlow);
  // yield fork(getSrvListFlow);
  yield fork(addRoleFlow);
  yield fork(grpListFlow);
  yield fork(updateRoleByGrpFlow);
  yield fork(deleteRoleFlow);
  yield fork(getFuncListWSearchFlow);
  yield fork(updateRoleByFuncFlow);
  yield fork(updateFuncFlow);
}
