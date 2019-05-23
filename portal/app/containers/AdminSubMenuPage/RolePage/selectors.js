import { createSelector } from 'reselect';

/**
 * Direct selector to the rolePage state domain
 */
const selectRolePageDomain = state => state.get('rolePage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by RolePage
 */

const makeSelectRolePage = () =>
  createSelector(
    selectRolePageDomain,
    substate => substate.toJS()
  );
const SelectSetRoleList = () =>
  createSelector(
    selectRolePageDomain,
    substate => substate.get('setRoleList')
  );
const SelectSetFunctionList = () =>
  createSelector(
    selectRolePageDomain,
    substate => substate.get('setFunctionList')
  );
const SelectSetSrvList = () =>
  createSelector(
    selectRolePageDomain,
    substate => substate.get('setSrvList')
  );
const SelectSetGrpList = () =>
  createSelector(
    selectRolePageDomain,
    substate => substate.get('setGrpList')
  );
const SelectFuncListWSearch = () =>
  createSelector(
    selectRolePageDomain,
    substate => substate.get('funcListWSearch')
  );
const SelectRefresh = () =>
  createSelector(
    selectRolePageDomain,
    substate => substate.get('refresh')
  );

export default makeSelectRolePage;
export {
  makeSelectRolePage,
  SelectSetRoleList,
  SelectSetFunctionList,
  SelectSetSrvList,
  SelectSetGrpList,
  SelectFuncListWSearch,
  SelectRefresh,
};
