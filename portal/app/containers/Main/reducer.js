/*
 *
 * Main reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MENU_LIST, SUBMENU_LIST, SET_LOGIN_RESP_MSG } from './constants';

const initialState = fromJS({
  menuList: [],
  subMenuList: [],
  loginRespMsg: null,
});

function mainReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MENU_LIST:
      return state.set('menuList', action.data);
    case SUBMENU_LIST:
      return state.set('subMenuList', action.data);
    case SET_LOGIN_RESP_MSG:
      return state.set('loginRespMsg', action.data);
    default:
      return state;
  }
}

export default mainReducer;
