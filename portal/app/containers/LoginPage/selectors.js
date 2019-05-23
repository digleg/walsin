import { createSelector } from 'reselect';

/**
 * Direct selector to the loginPage state domain
 */
const selectLoginPageDomain = state => state.get('loginPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () => createSelector(selectLoginPageDomain, substate => substate.toJS());
const SelectLoginInState = () => createSelector(selectLoginPageDomain, substate => substate.get('loggedIn'));
const SelectLoginError = () => createSelector(selectLoginPageDomain, substate => substate.get('loginError'));
const SelectLogoutSuccessMsg = () => createSelector(selectLoginPageDomain, substate => substate.get('logoutSuccessMsg'));

export default makeSelectLoginPage;
export { makeSelectLoginPage, selectLoginPageDomain, SelectLoginInState, SelectLoginError, SelectLogoutSuccessMsg };
