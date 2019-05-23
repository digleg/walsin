/*
 *
 * RolePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_ROLE_LIST, SET_FUNCTION_LIST, SET_SRV_LIST, SET_GRP_LIST, SET_FUNC_LIST_W_SEARCH, REFRESH } from './constants';

const initialState = fromJS({
  setRoleList: {},
  setFunctionList: null,
  setSrvList: {},
  setGrpList: [],
  funcListWSearch: null,
  refresh: false,
});

function rolePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_ROLE_LIST:
      return state.set('setRoleList', action.data);
    case SET_FUNCTION_LIST:
      return state.set('setFunctionList', action.data);
    case SET_SRV_LIST:
      return state.set('setSrvList', action.data);
    case SET_GRP_LIST:
      return state.set('setGrpList', action.data);
    case SET_FUNC_LIST_W_SEARCH:
      return state.set('funcListWSearch', action.data);
    case REFRESH:
      return state.set('refresh', action.data);
    default:
      return state;
  }
}

export default rolePageReducer;
