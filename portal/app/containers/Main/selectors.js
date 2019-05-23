import { createSelector } from 'reselect/lib';

/**
 * Direct selector to the main state domain
 */
const selectMainDomain = state => state.get('main');

/**
 * Other specific selectors
 */

/**
 * Default selector used by Main
 */

const makeSelectMain = () =>
  createSelector(
    selectMainDomain,
    substate => substate.toJS()
  );

const SelectMenuList = () =>
  createSelector(
    selectMainDomain,
    substate => substate.get('menuList')
  );
const SelectSubMenuList = () =>
  createSelector(
    selectMainDomain,
    substate => substate.get('subMenuList')
  );

const SelectLoginRespMsg = () =>
  createSelector(
    selectMainDomain,
    substate => substate.get('loginRespMsg')
  );

export default makeSelectMain;
export { makeSelectMain, selectMainDomain, SelectMenuList, SelectSubMenuList, SelectLoginRespMsg };
