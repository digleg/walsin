/*
 *
 * AlertPage actions
 *
 */

import { DEFAULT_ACTION, GET_ALERT_LIST, SET_FPORT_LIST, ADD_ALERT_LIST, DEL_ALERT_LIST, SET_ALERT_LIST, SET_ALERT_LIST_BY_FPORT, ERR_MSG, GET_ALERT_LIST_WITH_FPORT } from './constants';

export function getAlertList(data) {
  return {
    type: GET_ALERT_LIST,
    data,
  };
}

export function getAlertListWithFport(data) {
  return {
    type: GET_ALERT_LIST_WITH_FPORT,
    data,
  };
}

export function errMsg(data) {
  return {
    type: ERR_MSG,
    data,
  };
}

export function setFportList(data) {
  return {
    type: SET_FPORT_LIST,
    data,
  };
}

export function addAlertList(data) {
  return {
    type: ADD_ALERT_LIST,
    data,
  };
}

export function delAlertList(data) {
  return {
    type: DEL_ALERT_LIST,
    data,
  };
}

export function setAlertList(data) {
  return {
    type: SET_ALERT_LIST,
    data,
  };
}

export function setAlertListByFport(data) {
  return {
    type: SET_ALERT_LIST_BY_FPORT,
    data,
  };
}
export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
