/*
 *
 * RoboticPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_ROBOTIC_LIST,
  SET_ROBOTIC_LIST,
  GET_SCRIPT_LIST,
  SET_SCRIPT_LIST,
  UPLOAD_RASCRIPT,
  DELETE_RA_SCRIPT,
  EDIT_RA_SCRIPT,
  UPDATE_RA_SCRIPT,
  GET_EXEC_HISTORY,
  SET_EXEC_HISTORY,
  SET_DATE,
  SET_ALL,
  SET_SCRIPT_LIST_RESP_MSG,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getRoboticList() {
  return {
    type: GET_ROBOTIC_LIST,
  };
}

export function setRoboticList(data) {
  return {
    type: SET_ROBOTIC_LIST,
    data,
  };
}

export function getScriptList() {
  return {
    type: GET_SCRIPT_LIST,
  };
}

export function setScriptList(data) {
  return {
    type: SET_SCRIPT_LIST,
    data,
  };
}

export function uploadRAScript(data) {
  return {
    type: UPLOAD_RASCRIPT,
    data,
  };
}

export function deleteRAScript(data) {
  return {
    type: DELETE_RA_SCRIPT,
    data,
  };
}

export function editRAScript(data) {
  return {
    type: EDIT_RA_SCRIPT,
    data,
  };
}

export function updateRAScript(data) {
  return {
    type: UPDATE_RA_SCRIPT,
    data,
  };
}

export function getExecHistory(data) {
  return {
    type: GET_EXEC_HISTORY,
    data,
  };
}

export function setExecHistoryList(data) {
  return {
    type: SET_EXEC_HISTORY,
    data,
  };
}

export function setDate(data) {
  return {
    type: SET_DATE,
    data,
  };
}

export function setAll(data) {
  return {
    type: SET_ALL,
    data,
  };
}

export function setScriptListRespMsg(data) {
  return {
    type: SET_SCRIPT_LIST_RESP_MSG,
    data,
  };
}
