/*
 *
 * SystemPage actions
 *
 */

import { DEFAULT_ACTION, GET_SYS_LIST, SET_SYS_LIST } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getSysList() {
  return {
    type: GET_SYS_LIST,
  };
}

export function setSysList(data) {
  return {
    type: SET_SYS_LIST,
    data,
  };
}
