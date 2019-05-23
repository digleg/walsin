/*
 *
 * Active reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, ACTIVE_CODE_RESP } from './constants';

const initialState = fromJS({
  activeCodeResp: '',
});

function activeReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case ACTIVE_CODE_RESP:
      return state.set('activeCodeResp', action.data);
    default:
      return state;
  }
}

export default activeReducer;
