/*
 *
 * SystemPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SYS_LIST,
  SET_SYS_LIST,
  ADD_SYS,
  ERROR_MSG,
  EDIT_SYS,
  DELETE_SYS,
  CHG_SEARCH_TEXT,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getSysList() {
  return {
    type: GET_SYS_LIST,
  };
}

export function setSysList(data) {
  return {
    type: SET_SYS_LIST,
    data,
  };
}

export function addSys(data) {
  return {
    type: ADD_SYS,
    data,
  };
}

export function errorMsg(data) {
  return {
    type: ERROR_MSG,
    data,
  };
}

export function editSys(data) {
  return {
    type: EDIT_SYS,
    data,
  };
}

export function deleteSys(data) {
  return {
    type: DELETE_SYS,
    data,
  };
}

export function chgSearchText(data) {
  return {
    type: CHG_SEARCH_TEXT,
    data,
  };
}
