/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  LOAD_REPOS,
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS_ERROR,
  SENDING_REQ,
  LOGIN_STATUS_CHANGE,
  MENU_OPENED,
  LOGOUT_REQUEST,
  SENDING_REQUEST,
  MENU_LIST,
  SUB_MENU_LIST,
  GLOBAL_DATA,
  SET_FUNCTION_LIST,
  SUBMENU_ADMIN_OPEN,
  SET_MENU_OPEN,
  GET_GRPS_LIST,
  SET_GRPS_LIST,
  GET_ROLE_LIST,
  SET_ROLE_LIST,
  GET_CP_LIST,
  SET_CP_LIST,
  SENDING_REQUEST_LARGE,
  SENDING_REQUEST_MEDIUM,
  SENDING_REQUEST_SMALL,
  SENDING_REQUEST_MAIN,
  LOGIN_RESP,
  GET_FOCUS_MENU,
  SET_URL,
  PLAN_FRESH,
  LOGIN_REQUEST,
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadRepos() {
  return {
    type: LOAD_REPOS,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function reposLoaded(repos, username) {
  return {
    type: LOAD_REPOS_SUCCESS,
    repos,
    username,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function repoLoadingError(error) {
  return {
    type: LOAD_REPOS_ERROR,
    error,
  };
}

export function sendingReq(data) {
  return { type: SENDING_REQ, data };
}

export function loginStatusChange(status) {
  return {
    type: LOGIN_STATUS_CHANGE,
    status,
  };
}

export function menuOpened(opened: boolean) {
  return { type: MENU_OPENED, opened };
}

export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function sendingRequest(sending: boolean) {
  return { type: SENDING_REQUEST, sending };
}

export function sendingRequestL(sending: boolean) {
  return { type: SENDING_REQUEST_LARGE, sending };
}

export function sendingRequestM(sending: boolean) {
  return { type: SENDING_REQUEST_MEDIUM, sending };
}

export function sendingRequestS(sending: boolean) {
  return { type: SENDING_REQUEST_SMALL, sending };
}

export function sendingRequestMain(sending: boolean) {
  return { type: SENDING_REQUEST_MAIN, sending };
}

export function menuList(data) {
  return { type: MENU_LIST, data };
}

export function subMenuList(data) {
  return { type: SUB_MENU_LIST, data };
}

// globle data
export function globalData() {
  return {
    type: GLOBAL_DATA,
  };
}

export function setFunctionList(data) {
  return {
    type: SET_FUNCTION_LIST,
    data,
  };
}

export function subMenuAdminOpen(data) {
  return {
    type: SUBMENU_ADMIN_OPEN,
    data,
  };
}

export function setMenuOpen(data, src) {
  return {
    type: SET_MENU_OPEN,
    data,
    src,
  };
}

export function getGrpsList() {
  return {
    type: GET_GRPS_LIST,
  };
}

export function setExpGrpList(data) {
  return {
    type: SET_GRPS_LIST,
    data,
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

export function getCpList() {
  return {
    type: GET_CP_LIST,
  };
}

export function setCpList(data) {
  return {
    type: SET_CP_LIST,
    data,
  };
}

export function loginResp(data) {
  return {
    type: LOGIN_RESP,
    data,
  };
}

export function getFocusMenu(data) {
  return {
    type: GET_FOCUS_MENU,
    data,
  };
}

export function setUrl(data) {
  return {
    type: SET_URL,
    data,
  };
}

export function planRefresh(data) {
  return {
    type: PLAN_FRESH,
    data,
  };
}
