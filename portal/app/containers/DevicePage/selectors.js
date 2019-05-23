import { createSelector } from 'reselect';

/**
 * Direct selector to the devicePage state domain
 */
const selectDevicePageDomain = state => state.get('devicePage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by DevicePage
 */

const makeSelectDevicePage = () => createSelector(selectDevicePageDomain, substate => substate.toJS());
const SelectGetGwListResp = () => createSelector(selectDevicePageDomain, substate => substate.get('getGwListResp'));
const SelectGetSensorListResp = () => createSelector(selectDevicePageDomain, substate => substate.get('getSensorListResp'));

// error handling
const SelectErrMsgResp = () => createSelector(selectDevicePageDomain, substate => substate.get('errMsg'));
const SelectSuccMsgResp = () => createSelector(selectDevicePageDomain, substate => substate.get('succMsg'));

export default makeSelectDevicePage;
export { makeSelectDevicePage, SelectGetGwListResp, SelectGetSensorListResp, SelectErrMsgResp, SelectSuccMsgResp };
