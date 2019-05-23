/*
 *
 * RoboticPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_ROBOTIC_LIST,
  SET_SCRIPT_LIST,
  SET_EXEC_HISTORY,
  SET_DATE,
  SET_ALL,
  SET_SCRIPT_LIST_RESP_MSG,
} from './constants';

const initialState = fromJS({
  setRoboticList: {},
  setScriptList: {},
  setExecHistory: {},
  setDate: '',
  setAll: 0,
  setScriptListRespMsg: '',
});

function roboticPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_ROBOTIC_LIST:
      return state.set('setRoboticList', action.data);
    case SET_SCRIPT_LIST:
      return state.set('setScriptList', action.data);
    case SET_EXEC_HISTORY:
      return state.set('setExecHistory', action.data);
    case SET_DATE:
      return state.set('setDate', action.data);
    case SET_ALL:
      return state.set('setAll', action.data);
    case SET_SCRIPT_LIST_RESP_MSG:
      return state.set('setScriptListRespMsg', action.data);
    default:
      return state;
  }
}

export default roboticPageReducer;
