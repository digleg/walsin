import { createSelector } from 'reselect';

/**
 * Direct selector to the systemPage state domain
 */
const selectSystemPageDomain = state => state.get('systemPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by SystemPage
 */

const makeSelectSystemPage = () => createSelector(selectSystemPageDomain, substate => substate.toJS());
const SelectSetSysList = () => createSelector(selectSystemPageDomain, substate => substate.get('setSysList'));

export default makeSelectSystemPage;
export { makeSelectSystemPage, SelectSetSysList };
