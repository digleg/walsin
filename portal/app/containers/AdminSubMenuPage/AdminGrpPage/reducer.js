/*
 *
 * AdminGrpPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_GRP_LIST } from './constants';

const initialState = fromJS({
  setGrpList: {},
});

function adminGrpPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_GRP_LIST:
      return state.set('setGrpList', action.data);
    default:
      return state;
  }
}

export default adminGrpPageReducer;
