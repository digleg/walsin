/*
 *
 * Binding reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, BINDING_CODE_RESP } from './constants';

const initialState = fromJS({
  bindingCodeResp: '',
});

function bindingReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case BINDING_CODE_RESP:
      return state.set('bindingCodeResp', action.data);
    default:
      return state;
  }
}

export default bindingReducer;
