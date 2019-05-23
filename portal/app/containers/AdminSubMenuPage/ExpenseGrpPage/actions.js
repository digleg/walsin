/*
 *
 * ExpenseGrpPage actions
 *
 */

import { DEFAULT_ACTION, GET_EXP_GRP_LIST, SET_EXP_GRP_LIST, ADD_EXP_GRP, UPDATE_EXP_GRP, DELETE_EXP_GRP } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getExpGrpList() {
  return {
    type: GET_EXP_GRP_LIST,
  };
}

export function setExpGrpList(data) {
  return {
    type: SET_EXP_GRP_LIST,
    data,
  };
}

export function addExpGrp(data) {
  return {
    type: ADD_EXP_GRP,
    data,
  };
}

export function updateExpGrp(data) {
  return {
    type: UPDATE_EXP_GRP,
    data,
  };
}

export function deleteExpGrp(data) {
  return {
    type: DELETE_EXP_GRP,
    data,
  };
}
