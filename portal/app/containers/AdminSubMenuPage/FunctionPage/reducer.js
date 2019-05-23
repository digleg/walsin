/*
 *
 * FunctionPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_FUNCTION_LIST, SET_GRP_LIST } from './constants';

const initialState = fromJS({
  setFunctionList: {},
  setGrpList: [],
});

function functionPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_FUNCTION_LIST:
      return state.set('setFunctionList', action.data);
    case SET_GRP_LIST:
      return state.set('setGrpList', action.data);
    default:
      return state;
  }
}

export default functionPageReducer;
