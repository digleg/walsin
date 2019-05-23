/*
 *
 * AdminCppage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_CP_LIST,
  SET_CP_LIST,
  ADD_CP,
  DELETE_CP,
  EDIT_CP,
  CHG_SEARCH_TEXT,
  GET_GRP_LIST,
  SET_GRP_LIST,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getCpList() {
  return {
    type: GET_CP_LIST,
  };
}

export function setCpList(data) {
  return {
    type: SET_CP_LIST,
    data,
  };
}

export function addCp(data) {
  return {
    type: ADD_CP,
    data,
  };
}

export function deleteCp(data) {
  return {
    type: DELETE_CP,
    data,
  };
}

export function editCp(data) {
  return {
    type: EDIT_CP,
    data,
  };
}

export function chgSearchText(data) {
  return {
    type: CHG_SEARCH_TEXT,
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
