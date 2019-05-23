import { createSelector } from 'reselect';

/**
 * Direct selector to the functionPage state domain
 */
const selectFunctionPageDomain = state => state.get('functionPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by FunctionPage
 */

const makeSelectFunctionPage = () => createSelector(selectFunctionPageDomain, substate => substate.toJS());
const SelectSetFunctionList = () => createSelector(selectFunctionPageDomain, substate => substate.get('setFunctionList'));
const SelectSetGrpList = () => createSelector(selectFunctionPageDomain, substate => substate.get('setGrpList'));

export default makeSelectFunctionPage;
export { makeSelectFunctionPage, SelectSetFunctionList, SelectSetGrpList };
