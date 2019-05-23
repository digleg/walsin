/*
 *
 * EventPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_EVENT_LIST,
  SET_EVENT_LIST,
  GET_SENSOR_LIST_BY_FPORT,
  SET_SENSOR_LIST_BY_FPORT,
  GET_REPORT_LIST,
  ERR_MSG,
  SET_FPORT_LIST,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getEventList(data) {
  return {
    type: GET_EVENT_LIST,
    data,
  };
}

export function setEventList(data) {
  return {
    type: SET_EVENT_LIST,
    data,
  };
}

export function getSensorListByfport(data) {
  return {
    type: GET_SENSOR_LIST_BY_FPORT,
    data,
  };
}

export function setSensorListByfport(data) {
  return {
    type: SET_SENSOR_LIST_BY_FPORT,
    data,
  };
}

export function getReportList(data) {
  return {
    type: GET_REPORT_LIST,
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
