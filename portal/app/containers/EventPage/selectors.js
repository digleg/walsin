import { createSelector } from 'reselect';

/**
 * Direct selector to the eventPage state domain
 */
const selectEventPageDomain = state => state.get('eventPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by EventPage
 */

const makeSelectEventPage = () => createSelector(selectEventPageDomain, substate => substate.toJS());
const SelectEventList = () => createSelector(selectEventPageDomain, substate => substate.get('eventList'));
const SelectSenListByfport = () => createSelector(selectEventPageDomain, substate => substate.get('senListByfport'));
const SelectErrMsg = () => createSelector(selectEventPageDomain, substate => substate.get('errMsg'));
const SelectFportList = () => createSelector(selectEventPageDomain, substate => substate.get('fportList'));

export default makeSelectEventPage;
export { makeSelectEventPage, SelectEventList, SelectSenListByfport, SelectErrMsg, SelectFportList };
