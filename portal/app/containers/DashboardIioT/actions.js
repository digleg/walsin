/*
 *
 * DashboardIioT actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_LAYOUT_LIST,
  SET_LAYOUT_LIST,
  SET_MQTT_CTL,
  GET_LAYOUT_DATA_LIST,
  SET_LAYOUT_DATA_LIST,
  SET_LAYOUT_LIST_INDEX,
  SET_UPLOAD_PLAN,
  GET_UPLOAD_PLAN_LIST,
  SET_UPLOAD_PLAN_LIST,
  GET_EVENT_TYPE,
  SET_EVENT_TYPE,
  GET_SENSOR_LIST_BY_PORT,
  SET_SENSOR_LIST_BY_PORT,
  GET_DATA_FIELD,
  SET_DATA_FIELD,
  GET_PREVIEW_GRAPH,
  SET_PREV_DATA,
  SET_DASHBOARD_DL,
  GET_LAYOUT_DATA_W_SEARCH,
  SET_LAYOUT_DATA_W_SEARCH,
  LOGIN_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getLayoutList() {
  return {
    type: GET_LAYOUT_LIST,
  };
}

export function setLayoutList(data) {
  return {
    type: SET_LAYOUT_LIST,
    data,
  };
}

export function setLayoutListIndex(data) {
  return {
    type: SET_LAYOUT_LIST_INDEX,
    data,
  };
}

export function setMqttCtl(data) {
  return {
    type: SET_MQTT_CTL,
    data,
  };
}

export function getLayoutDataList(data) {
  return {
    type: GET_LAYOUT_DATA_LIST,
    data,
  };
}

export function setLayoutDataList(data) {
  return {
    type: SET_LAYOUT_DATA_LIST,
    data,
  };
}

export function setUploadPlan(data) {
  return {
    type: SET_UPLOAD_PLAN,
    data,
  };
}

export function getUploadPlanList() {
  return {
    type: GET_UPLOAD_PLAN_LIST,
  };
}

export function setUploadPlanList(data) {
  return {
    type: SET_UPLOAD_PLAN_LIST,
    data,
  };
}

export function getEventType() {
  return {
    type: GET_EVENT_TYPE,
  };
}

export function setEventType(data) {
  return {
    type: SET_EVENT_TYPE,
    data,
  };
}

export function getSensorListByfport(data) {
  return {
    type: GET_SENSOR_LIST_BY_PORT,
    data,
  };
}

export function setSensorListByPort(data) {
  return {
    type: SET_SENSOR_LIST_BY_PORT,
    data,
  };
}

export function getDataField(data) {
  return {
    type: GET_DATA_FIELD,
    data,
  };
}

export function setDataField(data) {
  return {
    type: SET_DATA_FIELD,
    data,
  };
}

export function getPreviewGraph(data) {
  return {
    type: GET_PREVIEW_GRAPH,
    data,
  };
}

export function setPrevData(data) {
  return {
    type: SET_PREV_DATA,
    data,
  };
}

export function setDashboardDL(data) {
  return {
    type: SET_DASHBOARD_DL,
    data,
  };
}

export function getLayoutDataListWSearch(data) {
  return {
    type: GET_LAYOUT_DATA_W_SEARCH,
    data,
  };
}

export function setLayoutDataWSearch(data) {
  return {
    type: SET_LAYOUT_DATA_W_SEARCH,
    data,
  };
}

export function loginSuccess(data) {
  return {
    type: LOGIN_SUCCESS,
    data,
  };
}
