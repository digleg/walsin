/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, LOGIN_STATUS_CHANGE, LOGIN_ERROR, LOGOUT_SUCCESS_MSG } from './constants';

const initialState = fromJS({
  // ex account: admin@gemteks.com, username: Admin, pw: gemtek123
  formState: { account: '', username: '', pw: '' },
  logoutSuccessMsg: false,
  loginError: { status: false, msg: null },
});

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case LOGIN_STATUS_CHANGE:
      return state.set('loggedIn', action.status);
    case LOGIN_ERROR:
      return state.set('loginError', action.data);
    case LOGOUT_SUCCESS_MSG:
      return state.set('logoutSuccessMsg', action.data);
    default:
      return state;
  }
}

export default loginPageReducer;
