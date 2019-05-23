/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const DEFAULT_LOCALE = 'en';
export const SENDING_REQ = 'app/App/SENDING_REQ';

export const LOGIN_REQUEST = 'app/App/LOGIN_REQUEST';
export const LOGIN_STATUS_CHANGE = 'app/App/LOGIN_STATUS_CHANGE';
export const MENU_OPENED = 'app/App/MENU_OPENED';
export const LOGOUT_REQUEST = 'app/App/LOGOUT_REQUEST';
export const SENDING_REQUEST = 'app/App/SENDING_REQUEST';
export const MENU_LIST = 'app/App/MENU_LIST';
export const SUB_MENU_LIST = 'app/App/SUB_MENU_LIST';

// globle data
export const GLOBAL_DATA = 'app/App/GLOBAL_DATA';
export const SET_FUNCTION_LIST = 'app/App/SET_FUNCTION_LIST';
export const SUBMENU_ADMIN_OPEN = 'app/App/SUBMENU_ADMIN_OPEN';
export const SET_MENU_OPEN = 'app/App/SET_MENU_OPEN';
export const GET_GRPS_LIST = 'app/App/GET_GRPS_LIST';
export const SET_GRPS_LIST = 'app/App/SET_GRPS_LIST';
export const GET_ROLE_LIST = 'app/App/GET_ROLE_LIST';
export const SET_ROLE_LIST = 'app/App/SET_ROLE_LIST';
export const GET_CP_LIST = 'app/App/GET_CP_LIST';
export const SET_CP_LIST = 'app/App/SET_CP_LIST';

// request
export const SENDING_REQUEST_LARGE = 'app/App/SENDING_REQUEST_LARGE';
export const SENDING_REQUEST_MEDIUM = 'app/App/SENDING_REQUEST_MEDIUM';
export const SENDING_REQUEST_SMALL = 'app/App/SENDING_REQUEST_SMALL';
export const SENDING_REQUEST_MAIN = 'app/App/SENDING_REQUEST_MAIN';

export const LOGIN_RESP = 'app/App/LOGIN_RESP';

// menu
export const GET_FOCUS_MENU = 'app/App/GET_FOCUS_MENU';

// urlPage
export const SET_URL = 'app/App/SET_URL';

// for dashboard plan
export const PLAN_FRESH = 'app/App/PLAN_FRESH';
