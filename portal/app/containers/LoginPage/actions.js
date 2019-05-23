/*
 *
 * LoginPage actions
 *
 */

import { DEFAULT_ACTION, LOGIN_REQUEST, LOGIN_STATUS_CHANGE, CHANGE_FORM, LOGIN_ERROR, LOGOUT_SUCCESS_MSG } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loginRequest(data) {
  return {
    type: LOGIN_REQUEST,
    data,
  };
}

export function loginStatusChange(status) {
  return {
    type: LOGIN_STATUS_CHANGE,
    status,
  };
}

export function changeForm(newFormState) {
  return { type: CHANGE_FORM, newFormState };
}

export function loginError(data) {
  return {
    type: LOGIN_ERROR,
    data,
  };
}

export function logoutSuccessMsg(data) {
  return {
    type: LOGOUT_SUCCESS_MSG,
    data,
  };
}
