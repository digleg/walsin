/*
 *
 * UserPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_USER_LIST,
  SET_USER_LIST,
  CHG_SEARCH_TEXT,
  SENDIND_SEARCH_REQUEST,
  UPDATE_USER_STATUS,
  ADD_USR,
  GET_USER_LIST_FETCH,
  DEL_USR,
  SET_ERROR_MSG,
  ADD_SUCCESS_RESP,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getUserList() {
  return {
    type: GET_USER_LIST,
  };
}

export function setUserList(data) {
  return {
    type: SET_USER_LIST,
    data,
  };
}

export function chgSearchText(data) {
  return {
    type: CHG_SEARCH_TEXT,
    data,
  };
}

export function sendingSearchRequest(data) {
  return {
    type: SENDIND_SEARCH_REQUEST,
    data,
  };
}

export function updateUserStatus(data) {
  return {
    type: UPDATE_USER_STATUS,
    data,
  };
}

export function addUsr(data) {
  return {
    type: ADD_USR,
    data,
  };
}

// export function addUsr(data) {
//   return {
//     type: ADD_USR,
//     data,
//   };
// }

export function getUserListFetch(data) {
  return {
    type: GET_USER_LIST_FETCH,
    data,
  };
}

export function delUsr(data) {
  return {
    type: DEL_USR,
    data,
  };
}

export function setErrorMsg(data) {
  return {
    type: SET_ERROR_MSG,
    data,
  };
}

export function addSuccessResp(data) {
  return {
    type: ADD_SUCCESS_RESP,
    data,
  };
}
