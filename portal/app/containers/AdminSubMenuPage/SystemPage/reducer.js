/*
 *
 * SystemPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_SYS_LIST, ERROR_MSG } from './constants';

const initialState = fromJS({
  setSysList: {},
  errorMsg: '',
});

function systemPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_SYS_LIST:
      return state.set('setSysList', action.data);
    case ERROR_MSG:
      return state.set('errorMsg', action.data);
    default:
      return state;
  }
}

export default systemPageReducer;
