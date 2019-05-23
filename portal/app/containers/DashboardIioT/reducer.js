/*
 *
 * DashboardIioT reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_LAYOUT_LIST,
  SET_LAYOUT_DATA_LIST,
  SET_UPLOAD_PLAN_LIST,
  SET_EVENT_TYPE,
  SET_SENSOR_LIST_BY_PORT,
  SET_DATA_FIELD,
  SET_PREV_DATA,
  SET_LAYOUT_DATA_W_SEARCH,
  LOGIN_SUCCESS,
} from './constants';

const initialState = fromJS({
  // layout
  layoutList: null,
  layoutDataList: null,
  uploadPlanList: null,
  eventType: null,
  sensorListByPort: null,
  dataField: null,
  prevData: null,
  layoutDataWSearch: null,
  loginSuccess: false,
});

function dashboardIioTReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_LAYOUT_LIST:
      return state.set('layoutList', action.data);
    case SET_LAYOUT_DATA_LIST:
      return state.set('layoutDataList', action.data);
    case SET_UPLOAD_PLAN_LIST:
      return state.set('uploadPlanList', action.data);
    case SET_EVENT_TYPE:
      return state.set('eventType', action.data);
    case SET_SENSOR_LIST_BY_PORT:
      return state.set('sensorListByPort', action.data);
    case SET_DATA_FIELD:
      return state.set('dataField', action.data);
    case SET_PREV_DATA:
      return state.set('prevData', action.data);
    case SET_LAYOUT_DATA_W_SEARCH:
      return state.set('layoutDataWSearch', action.data);
    case LOGIN_SUCCESS:
      return state.set('loginSuccess', action.data);
    default:
      return state;
  }
}

export default dashboardIioTReducer;
