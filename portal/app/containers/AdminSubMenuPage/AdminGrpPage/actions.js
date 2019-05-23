/*
 *
 * AdminGrpPage actions
 *
 */

import { DEFAULT_ACTION, GET_GRP_LIST, SET_GRP_LIST, ADD_GRP, EDIT_GRP, DELETE_GRP, CHG_SEARCH_TEXT } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getGrpList() {
  return {
    type: GET_GRP_LIST,
  };
}

export function setGrpList(data) {
  return {
    type: SET_GRP_LIST,
    data,
  };
}

export function addGrp(data) {
  return {
    type: ADD_GRP,
    data,
  };
}

export function editGrp(data) {
  return {
    type: EDIT_GRP,
    data,
  };
}

export function deleteGrp(data) {
  return {
    type: DELETE_GRP,
    data,
  };
}

export function chgSearchText(data) {
  return {
    type: CHG_SEARCH_TEXT,
    data,
  };
}
