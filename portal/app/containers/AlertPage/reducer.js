/*
 *
 * AlertPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_FPORT_LIST, SET_ALERT_LIST, SET_ALERT_LIST_BY_FPORT, ERR_MSG } from './constants';

const initialState = fromJS({
  alertList: {},
  senListByfport: null,
  errMsg: '',
  fportList: null,
});

function alertPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_FPORT_LIST:
      return state.set('fportList', action.data);
    case SET_ALERT_LIST:
      return state.set('alertList', action.data);
    case SET_ALERT_LIST_BY_FPORT:
      return state.set('alertListByFport', action.data);
    case ERR_MSG:
      return state.set('errMsg', action.data);
    default:
      return state;
  }
}

export default alertPageReducer;
