/**
 * The global state selectors
 */

import { createSelector } from 'reselect/lib';

const selectGlobal = state => state.get('global');

const selectRoute = state => state.get('route');

const makeSelectCurrentUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('currentUser')
  );
const makeSelectLoading = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('loading')
  );
const makeSelectError = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('error')
  );
const makeSelectRepos = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.getIn(['userData', 'repositories'])
  );
const makeSelectLocation = () =>
  createSelector(
    selectRoute,
    routeState => routeState.get('location').toJS()
  );
const SelectSendingReq = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('sendingReq')
  );
const SelectSendingReqL = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('sendingReqL')
  );
const SelectSendingReqM = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('sendingReqM')
  );
const SelectSendingReqS = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('sendingReqS')
  );
const SelectSendingReqMain = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('sendingReqMain')
  );

const SelectLoginInState = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('loggedIn')
  );
const SelectMenuOpened = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('menuOpened')
  );
const SelectLoginForm = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('formState')
  );
const SelectLoginCurrentlySending = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('currentlySending')
  );
const SelectMenuList = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('menuList')
  );
const SelectSubMenuList = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('subMenuList')
  );
const SelectSetFunctionList = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('setFunctionList')
  );
const SelectSubMenuAdminOpen = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('subMenuAdminOpen')
  );
const SelectSetRoleList = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('roleList')
  );
const SelectSetExpGrpList = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('setExpGrpList')
  );
const SelectSetMenuOpen = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('setMenuOpen')
  );
const SelectSetGrpsList = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('grpsList')
  );
const SelectSetCpList = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('cpList')
  );
const SelectFormState = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('loginResp')
  );
const SelectFocusMenu = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('focusMenu')
  );
const SelectUrl = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('url')
  );
const SelectRefreshPlan = () =>
  createSelector(
    selectGlobal,
    substate => substate.get('refreshPlan')
  );

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocation,
  SelectSendingReq,
  SelectLoginInState,
  SelectMenuOpened,
  SelectLoginForm,
  SelectLoginCurrentlySending,
  SelectMenuList,
  SelectSubMenuList,
  SelectSetFunctionList,
  SelectSubMenuAdminOpen,
  SelectSetRoleList,
  SelectSetExpGrpList,
  SelectSetMenuOpen,
  SelectSetGrpsList,
  SelectSetCpList,
  SelectSendingReqL,
  SelectSendingReqM,
  SelectSendingReqS,
  SelectSendingReqMain,
  SelectFormState,
  SelectFocusMenu,
  SelectUrl,
  SelectRefreshPlan,
};
