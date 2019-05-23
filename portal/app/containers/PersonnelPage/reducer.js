/*
 *
 * TagPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  SET_SEARCH_FILTER,
  SET_SEARCH_FILTER_STATE,
  SET_TRACK_CNT_LIST,
  SET_TAG_TYPE,
  SET_TAG_LIST,
  SET_TRACK_LIST,
  SET_TRACK_BY_ID_LIST,
  SET_TAG_LIST_SIZE,
  SET_DEV_META,
  SET_TAG_BY_META,
  SET_TRACK_BY_MAC,
  SET_SHOW_FIELD,
  SET_FILTER_IN_TRACK_EDIT_F,
  SET_FILTER_IN_TRACK_EDIT_Z,
  SET_FILTER_IN_TRACK_EDIT_S,
  SET_TAG_BY_META_CNT,
  INSERT_TAG,
} from './constants';

const initialState = fromJS({
  searchFilter: {},
  trackCntList: null,
  tagTypeList: {},
  tagList: null,
  trackList: {},
  trackByIdList: null,
  tagListSize: 0,
  devMetaList: null,
  tagByMetaList: null,
  trackByMacList: null,
  showFieldList: null,
  fieldInTrackEditF: null,
  fieldInTrackEditZ: null,
  fieldInTrackEditS: null,
  tagByMetaCnt: 0,
});

function tagPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_SEARCH_FILTER:
      return state.set('searchFilter', action.data);
    case SET_SEARCH_FILTER_STATE:
      return state.set('searchFilter', action.data);
    case SET_TRACK_CNT_LIST:
      return state.set('trackCntList', action.data);
    case SET_TAG_TYPE:
      return state.set('tagTypeList', action.data);
    case SET_TAG_LIST:
      return state.set('tagList', action.data);
    case SET_TRACK_LIST:
      return state.set('trackList', action.data);
    case SET_TRACK_BY_ID_LIST:
      return state.set('trackByIdList', action.data);
    case SET_TAG_LIST_SIZE:
      return state.set('tagListSize', action.data);
    case SET_DEV_META:
      return state.set('devMetaList', action.data);
    case SET_TAG_BY_META:
      return state.set('tagByMetaList', action.data);
    case SET_TRACK_BY_MAC:
      return state.set('trackByMacList', action.data);
    case SET_SHOW_FIELD:
      return state.set('showFieldList', action.data);
    case SET_FILTER_IN_TRACK_EDIT_F:
      return state.set('fieldInTrackEditF', action.data);
    case SET_FILTER_IN_TRACK_EDIT_Z:
      return state.set('fieldInTrackEditZ', action.data);
    case SET_FILTER_IN_TRACK_EDIT_S:
      return state.set('fieldInTrackEditS', action.data);
    case SET_TAG_BY_META_CNT:
      return state.set('tagByMetaCnt', action.data);
    case INSERT_TAG:
      return state.set('insertTag', action.data);

    default:
      return state;
  }
}

export default tagPageReducer;
