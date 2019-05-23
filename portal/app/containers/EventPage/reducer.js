/*
 *
 * EventPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_EVENT_LIST, SET_SENSOR_LIST_BY_FPORT, ERR_MSG, SET_FPORT_LIST } from './constants';

const initialState = fromJS({
  eventList: {},
  senListByfport: null,
  errMsg: '',
  fportList: null,
});

function eventPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_EVENT_LIST:
      return state.set('eventList', action.data);
    case SET_SENSOR_LIST_BY_FPORT:
      return state.set('senListByfport', action.data);
    case ERR_MSG:
      return state.set('errMsg', action.data);
    case SET_FPORT_LIST:
      return state.set('fportList', action.data);
    default:
      return state;
  }
}

export default eventPageReducer;
