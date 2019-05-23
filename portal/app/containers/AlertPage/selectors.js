import { createSelector } from 'reselect';

/**
 * Direct selector to the alertPage state domain
 */
const selectAlertPageDomain = state => state.get('alertPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by AlertPage
 */

const makeSelectAlertPage = () =>
  createSelector(
    selectAlertPageDomain,
    substate => substate.toJS()
  );
const SelectFportList = () =>
  createSelector(
    selectAlertPageDomain,
    substate => substate.get('fportList')
  );
const SelectAlertList = () =>
  createSelector(
    selectAlertPageDomain,
    substate => substate.get('alertList')
  );

const SelectAlertListByFport = () =>
  createSelector(
    selectAlertPageDomain,
    substate => substate.get('alertListByFport')
  );

const SelectErrMsg = () =>
  createSelector(
    selectAlertPageDomain,
    substate => substate.get('errMsg')
  );

export default makeSelectAlertPage;
export { makeSelectAlertPage, SelectFportList, SelectAlertList, SelectErrMsg, SelectAlertListByFport };
