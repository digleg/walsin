import { createSelector } from 'reselect';

/**
 * Direct selector to the roboticPage state domain
 */
const selectRoboticPageDomain = state => state.get('roboticPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by RoboticPage
 */

const makeSelectRoboticPage = () => createSelector(selectRoboticPageDomain, substate => substate.toJS());
const SelectSetRoboticList = () => createSelector(selectRoboticPageDomain, substate => substate.get('setRoboticList'));
const SelectSetScriptList = () => createSelector(selectRoboticPageDomain, substate => substate.get('setScriptList'));
const SelectSetExecHistory = () => createSelector(selectRoboticPageDomain, substate => substate.get('setExecHistory'));
const SelectSetDate = () => createSelector(selectRoboticPageDomain, substate => substate.get('setDate'));
const SelectSetAll = () => createSelector(selectRoboticPageDomain, substate => substate.get('setAll'));
const SelectSetScriptListRespMsg = () =>
  createSelector(selectRoboticPageDomain, substate => substate.get('setScriptListRespMsg'));

export default makeSelectRoboticPage;
export {
  makeSelectRoboticPage,
  SelectSetRoboticList,
  SelectSetScriptList,
  SelectSetExecHistory,
  SelectSetDate,
  SelectSetAll,
  SelectSetScriptListRespMsg,
};
