import { createSelector } from 'reselect';

/**
 * Direct selector to the active state domain
 */
const selectActiveDomain = state => state.get('active');

/**
 * Other specific selectors
 */

/**
 * Default selector used by Active
 */

const makeSelectActive = () => createSelector(selectActiveDomain, substate => substate.toJS());
const SelectActiveCodeResp = () => createSelector(selectActiveDomain, substate => substate.get('activeCodeResp'));

// activeCodeResp

export default makeSelectActive;
export { makeSelectActive, selectActiveDomain, SelectActiveCodeResp };
