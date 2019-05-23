/*
 *
 * DevicePage actions
 *
 */
import {
  DEFAULT_ACTION,
  GET_GW_LIST,
  GET_GW_LIST_RESP,
  GET_SENSOR_LIST,
  GET_SENSOR_LIST_RESP,
  SET_DEV_BY_ADMIN,
  DEL_DEV_BY_ADMIN,
  GET_CP_LIST,
  GET_USER_LIST,
  EDIT_DEV_BY_ADMIN,
  SET_ERR_MSG,
  SET_SUCC_MSG,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getGwList() {
  return {
    type: GET_GW_LIST,
  };
}

export function getGwListResp(data) {
  return {
    type: GET_GW_LIST_RESP,
    data,
  };
}

export function getSensorList(data) {
  return {
    type: GET_SENSOR_LIST,
    data,
  };
}

export function getSensorListResp(data) {
  return {
    type: GET_SENSOR_LIST_RESP,
    data,
  };
}

export function setDevByAdmin(data) {
  return {
    type: SET_DEV_BY_ADMIN,
    data,
  };
}

export function delDevByAdmin(data) {
  return {
    type: DEL_DEV_BY_ADMIN,
    data,
  };
}

export function getCpList(data) {
  return {
    type: GET_CP_LIST,
    data,
  };
}

export function getUserList(data) {
  return {
    type: GET_USER_LIST,
    data,
  };
}

export function editDevByAdmin(data) {
  return {
    type: EDIT_DEV_BY_ADMIN,
    data,
  };
}

export function setErrMsg(data) {
  return {
    type: SET_ERR_MSG,
    data,
  };
}

export function setSuccMsg(data) {
  return {
    type: SET_SUCC_MSG,
    data,
  };
}
