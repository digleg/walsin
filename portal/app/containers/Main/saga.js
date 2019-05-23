import { put, fork, call, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { setMenuOpen, sendingRequestMain, loginStatusChange, getFocusMenu, loginResp } from '../App/actions';
import { logoutSuccessMsg } from '../LoginPage/actions';
import api from '../../utils/apiRequest';

import { RENDER_MENU, LOGOUT_REQUEST, LOGIN_REQUEST } from './constants';

import {
  getAuthToken,
  setFormState,
  getFormState,
  setLocaleSetting,
  getUsername,
  getPassword,
  setAuthToken,
  setRole,
  setLoginStatus,
} from '../../utils/storageUtility';
import { menuList, setLoginRespMsg } from './actions';

const delay = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

function* menuProcess(services, grpUrlList) {
  const menuItem = [];
  // const subMenuItem = [];
  const subMenuOpen = [];
  for (let index = 0; index < services.length; index += 1) {
    if (services[index].grpId !== null && grpUrlList[index] !== null) {
      if (grpUrlList[index].func[0].parentId === -1) {
        menuItem.push([services[index].grpName, grpUrlList[index].func[0].functionUrl, grpUrlList[index].func[0].parentId, false]);
        subMenuOpen.push(undefined);
      } else {
        const funcLength = grpUrlList[index].func.length;
        const subMenuTmp = [];
        for (let index1 = 0; index1 < funcLength; index1 += 1) {
          subMenuTmp.push([grpUrlList[index].func[index1].functionName, grpUrlList[index].func[index1].functionUrl]);
        }
        menuItem.push([services[index].grpName, subMenuTmp, grpUrlList[index].func[0].parentId, false]);
        subMenuOpen.push(false);
      }
    }
  }

  yield put(menuList(menuItem));
  yield put(setMenuOpen(subMenuOpen, 'saga'));
  yield put(sendingRequestMain(false));
}

export function* mainSaga() {
  yield put(sendingRequestMain(true));
  const { services } = getFormState();
  const grpIdList = [];
  for (let i = 0; i < services.length; i += 1) {
    grpIdList.push(services[i].grpId);
  }
  const grpUrlList = [];
  for (let i = 0; i < grpIdList.length; i += 1) {
    const respUrl = yield call(api.getMenuItem, grpIdList[i]);
    yield call(delay, 100);
    if (respUrl.responseCode === '000') {
      grpUrlList.push(respUrl);
    } else if (respUrl.responseCode === '401') {
      yield put(setLoginRespMsg(respUrl.responseMsg));
      // the getMenu from Id failed
    } else if (respUrl.responseCode === '404') {
      grpUrlList.push(null);
    }
  }
  yield call(menuProcess, services, grpUrlList);
  // yield put(sendingReq(false));
}

export function* mainFlow() {
  yield takeLatest(RENDER_MENU, mainSaga);
}

export function* logoutSaga() {
  const token = getAuthToken();
  const resp = yield call(api.logout, token);
  if (resp.responseCode === '000') {
    yield put(loginStatusChange(false));
    setFormState('');
    setLocaleSetting(null);
    yield put(logoutSuccessMsg(true));
    yield put(getFocusMenu('DASHBOARD'));
    yield put(push('/'));
  } else {
    //
  }
}

export function* logoutFlow() {
  yield takeLatest(LOGOUT_REQUEST, logoutSaga);
}

function* loginSaga() {
  const resp = yield call(api.login, getUsername(), getPassword(), '0');
  if (resp.responseCode === '000') {
    setFormState(resp);
    yield put(loginResp(resp));
    yield put(loginStatusChange(true));
    setLoginStatus(true);
    yield call(setRole, resp.role);
    yield call(setAuthToken, resp.authToken);
  }
}

export function* loginFlow() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
}

export default function* rootSaga() {
  yield fork(mainFlow);
  yield fork(logoutFlow);
  yield fork(loginFlow);
}
