import { createSelector } from 'reselect/lib';

/**
 * Direct selector to the tagPage state domain
 */
const selectTagPageDomain = state => state.get('tagPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by TagPage
 */

const makeSelectTagPage = () => createSelector(selectTagPageDomain, substate => substate.toJS());
const SelectSearchFilter = () => createSelector(selectTagPageDomain, substate => substate.get('searchFilter'));
const SelectTrackCntList = () => createSelector(selectTagPageDomain, substate => substate.get('trackCntList'));
const SelectTagTypeList = () => createSelector(selectTagPageDomain, substate => substate.get('tagTypeList'));
const SelectTagList = () => createSelector(selectTagPageDomain, substate => substate.get('tagList'));
const SelectTrackList = () => createSelector(selectTagPageDomain, substate => substate.get('trackList'));
const SelectTrackByIdList = () => createSelector(selectTagPageDomain, substate => substate.get('trackByIdList'));
const SelectTagListSize = () => createSelector(selectTagPageDomain, substate => substate.get('tagListSize'));
const SelectDevMetaList = () => createSelector(selectTagPageDomain, substate => substate.get('devMetaList'));
const SelectTagByMetaList = () => createSelector(selectTagPageDomain, substate => substate.get('tagByMetaList'));
const SelectTrackByMacList = () => createSelector(selectTagPageDomain, substate => substate.get('trackByMacList'));
const SelectShowFieldList = () => createSelector(selectTagPageDomain, substate => substate.get('showFieldList'));
const SelectFieldInTrackEditF = () => createSelector(selectTagPageDomain, substate => substate.get('fieldInTrackEditF'));
const SelectFieldInTrackEditZ = () => createSelector(selectTagPageDomain, substate => substate.get('fieldInTrackEditZ'));
const SelectFieldInTrackEditS = () => createSelector(selectTagPageDomain, substate => substate.get('fieldInTrackEditS'));
const SelectTagByMetaCnt = () => createSelector(selectTagPageDomain, substate => substate.get('tagByMetaCnt'));

export default makeSelectTagPage;
export {
  makeSelectTagPage,
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
