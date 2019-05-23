/*
 *
 * FunctionPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_FUNCTION_LIST,
  SET_FUNCTION_LIST,
  GET_GRP_LIST,
  SET_GRP_LIST,
  ADD_FUNC,
  UPDATE_FUNC,
  DEL_FUNC,
  CHG_SEARCH_TEXT,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getFunctionList() {
  return {
    type: GET_FUNCTION_LIST,
  };
}

export function setFunctionList(data) {
  return {
    type: SET_FUNCTION_LIST,
    data,
  };
}

export function getGrpList(data) {
  return {
    type: GET_GRP_LIST,
    data,
  };
}

export function setGrpList(data) {
  return {
    type: SET_GRP_LIST,
    data,
  };
}

export function addFunc(data) {
  return {
    type: ADD_FUNC,
    data,
  };
}

export function updateFunc(data) {
  return {
    type: UPDATE_FUNC,
    data,
  };
}

export function delFunc(data) {
  return {
    type: DEL_FUNC,
    data,
  };
}

export function chgSearchText(data) {
  return {
    type: CHG_SEARCH_TEXT,
    data,
  };
}
