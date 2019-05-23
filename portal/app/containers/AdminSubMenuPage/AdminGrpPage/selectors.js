import { createSelector } from 'reselect';

/**
 * Direct selector to the adminGrpPage state domain
 */
const selectAdminGrpPageDomain = state => state.get('adminGrpPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminGrpPage
 */

const makeSelectAdminGrpPage = () => createSelector(selectAdminGrpPageDomain, substate => substate.toJS());
const SelectSetGrpList = () => createSelector(selectAdminGrpPageDomain, substate => substate.get('setGrpList'));

export default makeSelectAdminGrpPage;
export { makeSelectAdminGrpPage, SelectSetGrpList };
