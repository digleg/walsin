/*
 *
 * UrlPage actions
 *
 */

import { DEFAULT_ACTION, SET_URL } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function setUrl(data) {
  return {
    type: SET_URL,
    data,
  };
}
