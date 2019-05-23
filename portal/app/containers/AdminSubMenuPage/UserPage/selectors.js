import { createSelector } from 'reselect';

/**
 * Direct selector to the userPage state domain
 */
const selectUserPageDomain = state => state.get('userPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by UserPage
 */

const makeSelectUserPage = () => createSelector(selectUserPageDomain, substate => substate.toJS());
const SelectSetUserList = () => createSelector(selectUserPageDomain, substate => substate.get('setUserList'));
const SelectSendingSearchReq = () => createSelector(selectUserPageDomain, substate => substate.get('sendingSearchReq'));
const SelectErrorMsg = () => createSelector(selectUserPageDomain, substate => substate.get('errorMsg'));
const SelectAddSuccessResp = () => createSelector(selectUserPageDomain, substate => substate.get('addSuccessResp'));

export default makeSelectUserPage;
export { makeSelectUserPage, SelectSetUserList, SelectSendingSearchReq, SelectErrorMsg, SelectAddSuccessResp };
