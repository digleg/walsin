/*
 *
 * TagPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_SEARCH_FILTER,
  SET_SEARCH_FILTER,
  GET_SEARCH_FILTER_PARENT_VAL,
  SET_SEARCH_FILTER_STATE,
  SET_TRACK_CNT_LIST,
  GET_TAG_TYPE,
  SET_TAG_TYPE,
  SET_TAG_LIST,
  GET_TRACK_LIST,
  SET_TRACK_LIST,
  GET_TAG_LIST,
  GET_TRACK_BY_ID_LIST,
  SET_TRACK_BY_ID_LIST,
  UPDATE_TAG,
  SET_TAG_LIST_SIZE,
  GET_DEVICE_META,
  SET_DEV_META,
  GET_TAG_BY_META,
  SET_TAG_BY_META,
  GET_TRACK_BY_MAC,
  SET_TRACK_BY_MAC,
  GET_SHOW_FIELD,
  SET_SHOW_FIELD,
  GET_FILTER_IN_TRACK_EDIT_F,
  GET_FILTER_IN_TRACK_EDIT_Z,
  GET_FILTER_IN_TRACK_EDIT_S,
  SET_FILTER_IN_TRACK_EDIT_F,
  SET_FILTER_IN_TRACK_EDIT_Z,
  SET_FILTER_IN_TRACK_EDIT_S,
  UPDATE_META,
  SET_TAG_BY_META_CNT,
  INSERT_TAG,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getSearchFilter() {
  return {
    type: GET_SEARCH_FILTER,
  };
}

export function setSearchFilter(data) {
  return {
    type: SET_SEARCH_FILTER,
    data,
  };
}

export function getSearchFilterParentVal(data) {
  return {
    type: GET_SEARCH_FILTER_PARENT_VAL,
    data,
  };
}

export function setSearchFilterState(data) {
  return {
    type: SET_SEARCH_FILTER_STATE,
    data,
  };
}

export function setTrackCntList(data) {
  return {
    type: SET_TRACK_CNT_LIST,
    data,
  };
}

export function getTagType() {
  return {
    type: GET_TAG_TYPE,
  };
}

export function setTagType(data) {
  return {
    type: SET_TAG_TYPE,
    data,
  };
}

export function setTagList(data) {
  return {
    type: SET_TAG_LIST,
    data,
  };
}

export function getTrackList(data) {
  return {
    type: GET_TRACK_LIST,
    data,
  };
}

export function setTrackList(data) {
  return {
    type: SET_TRACK_LIST,
    data,
  };
}

export function getTagList(data) {
  return {
    type: GET_TAG_LIST,
    data,
  };
}

export function getTrackbyIdList(data) {
  return {
    type: GET_TRACK_BY_ID_LIST,
    data,
  };
}

export function setTrackByIdList(data) {
  return {
    type: SET_TRACK_BY_ID_LIST,
    data,
  };
}

export function updateTag(data) {
  return {
    type: UPDATE_TAG,
    data,
  };
}

export function setTagListSize(data) {
  return {
    type: SET_TAG_LIST_SIZE,
    data,
  };
}

export function getDeviceMeta(data) {
  return {
    type: GET_DEVICE_META,
    data,
  };
}

export function setDevMeta(data) {
  return {
    type: SET_DEV_META,
    data,
  };
}

export function getTagByMeta(data) {
  return {
    type: GET_TAG_BY_META,
    data,
  };
}

export function setTagByMeta(data) {
  return {
    type: SET_TAG_BY_META,
    data,
  };
}

export function getTrackbyMac(data) {
  return {
    type: GET_TRACK_BY_MAC,
    data,
  };
}

export function setTrackByMac(data) {
  return {
    type: SET_TRACK_BY_MAC,
    data,
  };
}

export function getShowField() {
  return {
    type: GET_SHOW_FIELD,
  };
}

export function setShowField(data) {
  return {
    type: SET_SHOW_FIELD,
    data,
  };
}

export function getFilterInTrackEditF(data) {
  return {
    type: GET_FILTER_IN_TRACK_EDIT_F,
    data,
  };
}

export function getFilterInTrackEditZ(data) {
  return {
    type: GET_FILTER_IN_TRACK_EDIT_Z,
    data,
  };
}

export function getFilterInTrackEditS(data) {
  return {
    type: GET_FILTER_IN_TRACK_EDIT_S,
    data,
  };
}

export function setFilterInTrackEditF(data) {
  return {
    type: SET_FILTER_IN_TRACK_EDIT_F,
    data,
  };
}

export function setFilterInTrackEditZ(data) {
  return {
    type: SET_FILTER_IN_TRACK_EDIT_Z,
    data,
  };
}

export function setFilterInTrackEditS(data) {
  return {
    type: SET_FILTER_IN_TRACK_EDIT_S,
    data,
  };
}

export function updateMeta(data) {
  return {
    type: UPDATE_META,
    data,
  };
}

export function setTagByMetaCnt(data) {
  return {
    type: SET_TAG_BY_META_CNT,
    data,
  };
}

export function insertTag(data) {
  return {
    type: INSERT_TAG,
    data,
  };
}
