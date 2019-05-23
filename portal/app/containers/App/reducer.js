/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  SENDING_REQ,
  LOGIN_STATUS_CHANGE,
  MENU_OPENED,
  SENDING_REQUEST,
  MENU_LIST,
  SUB_MENU_LIST,
  SET_FUNCTION_LIST,
  SUBMENU_ADMIN_OPEN,
  SET_MENU_OPEN,
  SET_GRPS_LIST,
  SET_ROLE_LIST,
  SET_CP_LIST,
  SENDING_REQUEST_LARGE,
  SENDING_REQUEST_MEDIUM,
  SENDING_REQUEST_SMALL,
  SENDING_REQUEST_MAIN,
  LOGIN_RESP,
  GET_FOCUS_MENU,
  SET_URL,
  PLAN_FRESH,
} from './constants';

import { CHANGE_FORM } from '../LoginPage/constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  sendingReq: false,
  sendingRequset: false,
  sendingReqL: false,
  sendingReqM: false,
  sendingReqS: false,
  sendingReqMain: false,
  loggedIn: false,
  menuOpened: false,
  formState: { account: '', username: '', pw: '' },
  currentlySending: false,
  subMenuAdminOpen: false,
  setMenuOpen: [],
  grpsList: {},
  roleList: {},
  cpList: {},
  loginResp: {},
  focusMenu: 'DASHBOARD',
  url: '',
  refreshPlan: false,
});

let flag = false;

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_REPOS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case LOAD_REPOS_SUCCESS:
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_REPOS_ERROR:
      return state.set('error', action.error).set('loading', false);
    case SENDING_REQ:
      return state.set('sendingReq', action.data);
    case LOGIN_STATUS_CHANGE:
      return state.set('loggedIn', action.status);
    case MENU_OPENED:
      return state.set('menuOpened', action.opened);
    case CHANGE_FORM:
      return state.set('formState', action.newFormState);
    case SENDING_REQUEST:
      return state.set('currentlySending', action.sending);
    case SENDING_REQUEST_LARGE:
      return state.set('sendingReqL', action.sending);
    case SENDING_REQUEST_MEDIUM:
      return state.set('sendingReqM', action.sending);
    case SENDING_REQUEST_SMALL:
      return state.set('sendingReqS', action.sending);
    case SENDING_REQUEST_MAIN:
      return state.set('sendingReqMain', action.sending);
    case MENU_LIST:
      return state.set('menuList', action.data);
    case SUB_MENU_LIST:
      return state.set('subMenuList', action.data);
    case SET_FUNCTION_LIST:
      return state.set('setFunctionList', action.data);
    case SUBMENU_ADMIN_OPEN:
      return state.set('subMenuAdminOpen', action.data);
    case SET_MENU_OPEN:
      if (action.src === 'saga' && flag === false) {
        flag = true;
        return state.set('setMenuOpen', action.data);
      }
      if (action.src === 'mainIndex') {
        return state.set('setMenuOpen', action.data);
      }
      return state;
    case SET_GRPS_LIST:
      return state.set('grpsList', action.data);
    case SET_ROLE_LIST:
      return state.set('roleList', action.data);
    case SET_CP_LIST:
      return state.set('cpList', action.data);
    case LOGIN_RESP:
      return state.set('loginResp', action.data);
    case GET_FOCUS_MENU:
      return state.set('focusMenu', action.data);
    case SET_URL:
      return state.set('url', action.data);
    case PLAN_FRESH:
      return state.set('refreshPlan', action.data);
    default:
      return state;
  }
}

export default appReducer;
