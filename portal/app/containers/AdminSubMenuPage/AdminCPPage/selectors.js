import { createSelector } from 'reselect';

/**
 * Direct selector to the adminCppage state domain
 */
const selectAdminCppageDomain = state => state.get('adminCppage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminCppage
 */

const makeSelectAdminCppage = () => createSelector(selectAdminCppageDomain, substate => substate.toJS());
const SelectSetCpList = () => createSelector(selectAdminCppageDomain, substate => substate.get('setCpList'));
const SelectSetGrpList = () => createSelector(selectAdminCppageDomain, substate => substate.get('setGrpList'));

export default makeSelectAdminCppage;
export { makeSelectAdminCppage, SelectSetCpList, SelectSetGrpList };
