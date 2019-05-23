/*
 *
 * RolePage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ROLE_LIST,
  SET_ROLE_LIST,
  GET_FUNCTION_LIST,
  SET_FUNCTION_LIST,
  CHG_SEARCH_TEXT,
  GET_SRV_LIST,
  SET_SRV_LIST,
  ADD_ROLE,
  GET_GRP_LIST,
  SET_GRP_LIST,
  UPDATE_ROLE_BY_GRP,
  DELETE_ROLE,
  GET_FUNC_LIST_W_SEARCH,
  SET_FUNC_LIST_W_SEARCH,
  UPDATE_ROLE_BY_FUNC,
  REFRESH,
  UPDATE_FUNC,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getRoleList() {
  return {
    type: GET_ROLE_LIST,
  };
}

export function setRoleList(data) {
  return {
    type: SET_ROLE_LIST,
    data,
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

export function chgSearchText(data) {
  return {
    type: CHG_SEARCH_TEXT,
    data,
  };
}

export function getSrvList(data) {
  return {
    type: GET_SRV_LIST,
    data,
  };
}

export function setSvrList(data) {
  return {
    type: SET_SRV_LIST,
    data,
  };
}

export function addRole(data) {
  return {
    type: ADD_ROLE,
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

export function updateRoleByGrp(data) {
  return {
    type: UPDATE_ROLE_BY_GRP,
    data,
  };
}

export function deleteRole(data) {
  return {
    type: DELETE_ROLE,
    data,
  };
}

export function getFuncListWSearch(data) {
  return {
    type: GET_FUNC_LIST_W_SEARCH,
    data,
  };
}

export function setFuncListWSearch(data) {
  return {
    type: SET_FUNC_LIST_W_SEARCH,
    data,
  };
}

export function updateRoleByFunc(data) {
  return {
    type: UPDATE_ROLE_BY_FUNC,
    data,
  };
}

export function refresh(data) {
  return {
    type: REFRESH,
    data,
  };
}

export function updateFunc(data) {
  return {
    type: UPDATE_FUNC,
    data,
  };
}
