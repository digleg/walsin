import { createSelector } from 'reselect';

/**
 * Direct selector to the dashboardIioT state domain
 */
const selectDashboardIioTDomain = state => state.get('dashboardIioT');

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashboardIioT
 */

const makeSelectDashboardIioT = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.toJS()
  );
const SelectSetLayoutList = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('layoutList')
  );
const SelectSetLayoutDataList = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('layoutDataList')
  );
const SelectUploadPlanList = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('uploadPlanList')
  );
const SelectEventType = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('eventType')
  );
const SelectSensorListByPort = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('sensorListByPort')
  );
const SelectDataField = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('dataField')
  );
const SelectPrevData = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('prevData')
  );
const SelectLayoutDataWSearch = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('layoutDataWSearch')
  );
const SelectLoginSuccess = () =>
  createSelector(
    selectDashboardIioTDomain,
    substate => substate.get('loginSuccess')
  );

export default makeSelectDashboardIioT;
export {
  makeSelectDashboardIioT,
  SelectSetLayoutList,
  SelectSetLayoutDataList,
  SelectUploadPlanList,
  SelectEventType,
  SelectSensorListByPort,
  SelectDataField,
  SelectPrevData,
  SelectLayoutDataWSearch,
  SelectLoginSuccess,
};
