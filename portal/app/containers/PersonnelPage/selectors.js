import { createSelector } from 'reselect/lib';

/**
 * Direct selector to the personnelPage state domain
 */
const selectPersonnelPageDomain = state => state.get('personnelPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by PersonnelPage
 */

const makeSelectPersonnelPage = () => createSelector(selectPersonnelPageDomain, substate => substate.toJS());
const SelectSearchFilter = () => createSelector(selectPersonnelPageDomain, substate => substate.get('searchFilter'));
const SelectTrackCntList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('trackCntList'));
const SelectTagTypeList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('tagTypeList'));
const SelectTagList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('tagList'));
const SelectTrackList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('trackList'));
const SelectTrackByIdList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('trackByIdList'));
const SelectTagListSize = () => createSelector(selectPersonnelPageDomain, substate => substate.get('tagListSize'));
const SelectDevMetaList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('devMetaList'));
const SelectTagByMetaList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('tagByMetaList'));
const SelectTrackByMacList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('trackByMacList'));
const SelectShowFieldList = () => createSelector(selectPersonnelPageDomain, substate => substate.get('showFieldList'));
const SelectFieldInTrackEditF = () => createSelector(selectPersonnelPageDomain, substate => substate.get('fieldInTrackEditF'));
const SelectFieldInTrackEditZ = () => createSelector(selectPersonnelPageDomain, substate => substate.get('fieldInTrackEditZ'));
const SelectFieldInTrackEditS = () => createSelector(selectPersonnelPageDomain, substate => substate.get('fieldInTrackEditS'));
const SelectTagByMetaCnt = () => createSelector(selectPersonnelPageDomain, substate => substate.get('tagByMetaCnt'));

export default makeSelectPersonnelPage;
export {
  makeSelectPersonnelPage,
  SelectSearchFilter,
  SelectTrackCntList,
  SelectTagTypeList,
  SelectTagList,
  SelectTrackList,
  SelectTrackByIdList,
  SelectTagListSize,
  SelectDevMetaList,
  SelectTagByMetaList,
  SelectTrackByMacList,
  SelectShowFieldList,
  SelectFieldInTrackEditF,
  SelectFieldInTrackEditZ,
  SelectFieldInTrackEditS,
  SelectTagByMetaCnt,
};
