/*
 *
 * DevicePage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, GET_GW_LIST_RESP, GET_SENSOR_LIST_RESP, SET_ERR_MSG, SET_SUCC_MSG } from './constants';

const initialState = fromJS({
  getGwListResp: {},
  getSensorListResp: {},
  errMsg: '',
  succMsg: '',
});

function devicePageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_GW_LIST_RESP:
      return state.set('getGwListResp', action.data);
    case GET_SENSOR_LIST_RESP:
      return state.set('getSensorListResp', action.data);
    case SET_ERR_MSG:
      return state.set('errMsg', action.data);
    case SET_SUCC_MSG:
      return state.set('succMsg', action.data);
    default:
      return state;
  }
}

export default devicePageReducer;
