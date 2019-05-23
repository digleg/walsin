/*
 *
 * Main actions
 *
 */

import { DEFAULT_ACTION, RENDER_MENU, MENU_LIST, SUBMENU_LIST, LOGOUT_REQUEST, SET_LOGIN_RESP_MSG, LOGIN_REQUEST } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function renderMenu(data) {
  return {
    type: RENDER_MENU,
    data,
  };
}

export function menuList(data) {
  return {
    type: MENU_LIST,
    data,
  };
}

export function subMenuList(data) {
  return {
    type: SUBMENU_LIST,
    data,
  };
}

export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function setLoginRespMsg(data) {
  return {
    type: SET_LOGIN_RESP_MSG,
    data,
  };
}

export function loginRequest(data) {
  return {
    type: LOGIN_REQUEST,
    data,
  };
}
