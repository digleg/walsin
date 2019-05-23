/*
 *
 * UserPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_USER_LIST, SENDIND_SEARCH_REQUEST, SET_ERROR_MSG, ADD_SUCCESS_RESP } from './constants';

const initialState = fromJS({
  setUserList: {},
  sendingSearchReq: false,
  errorMsg: '',
  addSuccessResp: false,
});

function userPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_USER_LIST:
      return state.set('setUserList', action.data);
    case SENDIND_SEARCH_REQUEST:
      return state.set('sendingSearchReq', action.data);
    case SET_ERROR_MSG:
      return state.set('errorMsg', action.data);
    case ADD_SUCCESS_RESP:
      return state.set('addSuccessResp', action.data);
    default:
      return state;
  }
}

export default userPageReducer;
