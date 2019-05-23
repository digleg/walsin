/*
 *
 * AdminCppage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_CP_LIST, SET_GRP_LIST } from './constants';

const initialState = fromJS({
  setCpList: {},
  setGrpList: {},
});

function adminCppageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_CP_LIST:
      return state.set('setCpList', action.data);
    case SET_GRP_LIST:
      return state.set('setGrpList', action.data);
    default:
      return state;
  }
}

export default adminCppageReducer;
