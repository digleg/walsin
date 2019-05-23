/*
 *
 * SystemPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_SYS_LIST } from './constants';

const initialState = fromJS({
  setSysList: {},
});

function systemPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_SYS_LIST:
      return state.set('setSysList', action.data);
    default:
      return state;
  }
}

export default systemPageReducer;
