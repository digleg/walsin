/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */

import { call, fork, put, takeLatest } from 'redux-saga/effects';
import cloneDeep from 'lodash.clonedeep';
// import timediff from 'timediff/timediff';
import api from '../../utils/apiRequest';
import {
  GET_SEARCH_FILTER,
  GET_SEARCH_FILTER_PARENT_VAL,
  GET_TAG_TYPE,
  GET_TRACK_LIST,
  GET_TAG_LIST,
  GET_TRACK_BY_ID_LIST,
  UPDATE_TAG,
  GET_DEVICE_META,
  GET_TAG_BY_META,
  GET_TRACK_BY_MAC,
  GET_SHOW_FIELD,
  GET_FILTER_IN_TRACK_EDIT_F,
  GET_FILTER_IN_TRACK_EDIT_Z,
  GET_FILTER_IN_TRACK_EDIT_S,
  UPDATE_META,
  INSERT_TAG,
} from './constants';
import {
  setSearchFilter,
  setTrackCntList,
  setTagType,
  setTagList,
  setTrackList,
  setTrackByIdList,
  setTagListSize,
  setDevMeta,
  setTagByMeta,
  setTrackByMac,
  setShowField,
  getDeviceMeta,
  getTagByMeta,
  setFilterInTrackEditF,
  setFilterInTrackEditZ,
  setFilterInTrackEditS,
  setTagByMetaCnt,
} from './actions';

import { timeTransForm } from '../../utils/timeTransForm';

import { sendingRequestM } from '../App/actions';

// global flag
let showFlg;

/* 機台資料 saga */
export function* getSearchFilterSaga() {
  const respSearchFilter = yield call(api.getSearchFilter);
  if (respSearchFilter.responseCode === '000') {
    showFlg = respSearchFilter.field[0].showFlg;
    let rootIndex;
    if (respSearchFilter.responseCode === '000') {
      for (let i = 0; i < respSearchFilter.field.length; i += 1) {
        if (respSearchFilter.field[i].root === 1) {
          rootIndex = i;
          break;
        }
      }
      const apiObj = {};
      apiObj[respSearchFilter.field[rootIndex].val] = { fport: respSearchFilter.field[rootIndex].fport };
      const respSearchOption = yield call(api.getSearchOptionWithRoot, apiObj);
      const trackCntList = [];
      if (respSearchOption.responseCode === '000') {
        for (let j = 0; j < respSearchOption.option.length; j += 1) {
          const respGetTrackCount = yield call(api.getTrackCount, {
            type: respSearchFilter.field[rootIndex].val,
            typeId: respSearchOption.option[j]._id.val,
          });
          if (respGetTrackCount.responseCode === '000') {
            trackCntList.push({
              val: respSearchOption.option[j]._id.val,
              name: respSearchOption.option[j]._id.name,
              cnt: respGetTrackCount.size,
              label: respSearchFilter.field[rootIndex].name,
              machineCnt: respSearchOption.option[j].count,
            });
          }

          // Layer-3 Track
          // const respGetTrack = yield call(api.getTrack, {
          //   type: respSearchFilter.field[rootIndex].val,
          //   typeId: respSearchOption.option[j]._id.val,
          // });
        }

        // initial meta data
        yield put(getDeviceMeta({ fport: respSearchFilter.field[rootIndex].fport, meta: 'factory', val: 'f1' }));
        yield put(getTagByMeta({ type: 'factory', meta: 'f1' }));

        yield put(setSearchFilter({ filter: respSearchFilter.field, option: [respSearchOption.option] }));
        yield put(setTrackCntList(trackCntList));
      } else {
        // error hdling
      }
    } else {
      // error hdling
    }
  }
}

export function* getSearchFilterFlow() {
  yield takeLatest(GET_SEARCH_FILTER, getSearchFilterSaga);
}

export function* getSearchFilterParentValSaga(data) {
  const { currOption, index } = data.data;
  const respSearchFilter = yield call(api.getSearchFilter);
  const respSearchOptionParent = yield call(api.getSearchOptionWithParentVal, data.data);
  if (respSearchFilter.responseCode === '000' && respSearchOptionParent.responseCode === '000') {
    const trackCntList = [];
    for (let i = 0; i < respSearchOptionParent.option.length; i += 1) {
      let respGetTrackCount;
      if (data.data.child !== 'macAddr' && data.data.searchField !== 'macAddr') {
        respGetTrackCount = yield call(api.getTrackCount, {
          type: data.data.child,
          typeId: respSearchOptionParent.option[i]._id.val,
        });
      } else {
        respGetTrackCount = yield call(api.getTrackCount, {
          type: data.data.child,
          typeId: respSearchOptionParent.option[i].macAddr,
        });
      }
      if (respGetTrackCount.responseCode === '000') {
        if (data.data.child !== 'macAddr' && data.data.searchField !== 'macAddr') {
          trackCntList.push({
            val: respSearchOptionParent.option[i]._id.val,
            name: respSearchOptionParent.option[i]._id.name,
            cnt: respGetTrackCount.size,
            label: data.data.child,
            machineCnt: respSearchOptionParent.option[i].count,
          });
        } else {
          trackCntList.push({
            val: respSearchOptionParent.option[i].macAddr,
            name: respSearchOptionParent.option[i].name,
            cnt: respGetTrackCount.size,
            label: data.data.child,
            machineCnt: respSearchOptionParent.option[i].count,
          });
        }
      }
    }
    let currOptionEdit = cloneDeep(currOption);
    if (index + 1 === currOption.length) {
      if (data.data.val !== 'all') {
        currOptionEdit = [...currOptionEdit, respSearchOptionParent.option];
      }
    } else {
      if (data.data.val !== 'all') {
        if (data.data.all === false) {
          currOptionEdit.splice(index + 1, currOption.length - index, respSearchOptionParent.option);
        } else {
          currOptionEdit.splice(index, currOption.length - index, respSearchOptionParent.option);
        }
      }
    }
    if (data.data.searchField !== 'macAddr') {
      yield put(setSearchFilter({ filter: respSearchFilter.field, option: currOptionEdit }));
    }
    if (data.data.searchField === 'macAddr') {
      const respGetTrackCount = yield call(api.getTrackCount, {
        type: data.data.searchField,
        typeId: data.data.val,
      });
      if (respGetTrackCount.responseCode === '000') {
        trackCntList.push({
          name: data.data.currOption[currOption.length - 1][data.data.index1].name,
          cnt: respGetTrackCount.size,
          label: data.data.searchField,
          // machineCnt: respSearchOptionParent.option[i].count,
        });
      }
    }

    yield put(setTrackCntList(trackCntList));
  }
}

export function* getSearchFilterParentValFlow() {
  yield takeLatest(GET_SEARCH_FILTER_PARENT_VAL, getSearchFilterParentValSaga);
}

export function* getDeviceMetaSaga(data) {
  const { meta, val } = data.data;
  if (meta !== undefined && val !== undefined) {
    const respGetGetDevMeta = yield call(api.getGetDevMeta, { ...data, showFlg });
    if (respGetGetDevMeta.responseCode === '000') {
      yield put(setDevMeta(respGetGetDevMeta.device));
    }
  } else {
    const respSearchFilter = yield call(api.getSearchFilter);
    showFlg = respSearchFilter.field[0].showFlg;
    let rootIndex;
    if (respSearchFilter.responseCode === '000') {
      for (let i = 0; i < respSearchFilter.field.length; i += 1) {
        if (respSearchFilter.field[i].root === 1) {
          rootIndex = i;
          break;
        }
      }
      const apiObj = {};
      apiObj[respSearchFilter.field[rootIndex].val] = { fport: respSearchFilter.field[rootIndex].fport };
      const respSearchOption = yield call(api.getSearchOptionWithRoot, apiObj);
      if (respSearchOption.responseCode === '000') {
        const dataMeta = {
          fport: respSearchFilter.field[rootIndex].fport,
          meta: respSearchFilter.field[rootIndex].val,
          val: respSearchOption.option[0]._id.val,
        };
        const respGetGetDevMeta = yield call(api.getGetDevMeta, {
          data: dataMeta,
          showFlg,
        });
        if (respGetGetDevMeta.responseCode === '000') {
          yield put(setDevMeta(respGetGetDevMeta.device));
        }
      }
    }
  }
}

export function* getDeviceMetaFlow() {
  yield takeLatest(GET_DEVICE_META, getDeviceMetaSaga);
}

export function* getTagByMetaSaga(data) {
  const { type, meta, page } = data.data;
  if (type !== undefined && meta !== undefined) {
    const respGetTagByMeta = yield call(api.getTagByMeta, { ...data, showFlg });
    const respGetTagByMetaWPage = yield call(api.getTagByMetaWPage, { ...data, showFlg });
    // set total length
    yield put(setTagByMetaCnt(respGetTagByMeta.trackList.length));

    if (respGetTagByMetaWPage.responseCode === '000') {
      yield put(setTagByMeta(respGetTagByMetaWPage.trackList));
    }
  } else {
    const respSearchFilter = yield call(api.getSearchFilter);
    showFlg = respSearchFilter.field[0].showFlg;
    let rootIndex;
    if (respSearchFilter.responseCode === '000') {
      for (let i = 0; i < respSearchFilter.field.length; i += 1) {
        if (respSearchFilter.field[i].root === 1) {
          rootIndex = i;
          break;
        }
      }
      const apiObj = {};
      apiObj[respSearchFilter.field[rootIndex].val] = { fport: respSearchFilter.field[rootIndex].fport };
      const respSearchOption = yield call(api.getSearchOptionWithRoot, apiObj);

      if (respSearchOption.responseCode === '000') {
        const dataMeta = {
          type: respSearchFilter.field[rootIndex].val,
          meta: respSearchOption.option[0]._id.val,
          page,
        };
        const respGetTagByMeta = yield call(api.getTagByMeta, {
          data: dataMeta,
          showFlg,
        });
        const respGetTagByMetaWPage = yield call(api.getTagByMetaWPage, {
          data: dataMeta,
          showFlg,
        });
        // set total length
        if (respGetTagByMeta.responseCode === '000') {
          yield put(setTagByMetaCnt(respGetTagByMeta.trackList.length));
        }
        if (respGetTagByMetaWPage.responseCode === '000') {
          yield put(setTagByMeta(respGetTagByMetaWPage.trackList));
        }
      }
    }
  }
}

export function* getTagByMetaFlow() {
  yield takeLatest(GET_TAG_BY_META, getTagByMetaSaga);
}

export function* getTrackByMacSaga(data) {
  const respGetTrack = yield call(api.getTrack, data.data);
  if (respGetTrack.responseCode === '000') {
    yield put(setTrackByMac(respGetTrack.trackList));
  }
}

export function* getTrackByMacFlow() {
  yield takeLatest(GET_TRACK_BY_MAC, getTrackByMacSaga);
}

export function* getShowFieldSaga() {
  const dataItem = { fport: 165 };
  const respGetShowField = yield call(api.getShowField, { data: dataItem });
  if (respGetShowField.responseCode === '000') {
    yield put(setShowField(respGetShowField.field));
  }
}

export function* getShowFieldFlow() {
  yield takeLatest(GET_SHOW_FIELD, getShowFieldSaga);
}

export function* getFilterInTrackEditFSaga(data) {
  const respSearchOptionParent = yield call(api.getSearchOptionWithRoot, data.data);
  if (respSearchOptionParent.responseCode === '000') {
    yield put(setFilterInTrackEditF(respSearchOptionParent.option));
  }
}

export function* getFilterInTrackEditFFlow() {
  yield takeLatest(GET_FILTER_IN_TRACK_EDIT_F, getFilterInTrackEditFSaga);
}

export function* getFilterInTrackEditZSaga(data) {
  const respSearchOptionParent = yield call(api.getSearchOptionWithParentVal, data.data);
  if (respSearchOptionParent.responseCode === '000') {
    yield put(setFilterInTrackEditZ(respSearchOptionParent.option));
  }
}

export function* getFilterInTrackEditZFlow() {
  yield takeLatest(GET_FILTER_IN_TRACK_EDIT_Z, getFilterInTrackEditZSaga);
}

export function* getFilterInTrackEditSSaga(data) {
  const respSearchOptionParent = yield call(api.getSearchOptionWithParentVal, data.data);
  if (respSearchOptionParent.responseCode === '000') {
    yield put(setFilterInTrackEditS(respSearchOptionParent.option));
  }
}

export function* getFilterInTrackEditSFlow() {
  yield takeLatest(GET_FILTER_IN_TRACK_EDIT_S, getFilterInTrackEditSSaga);
}

export function* updateMetaSaga(data) {
  const respUpdateMeta = yield call(api.updateMeta, data.data);
  if (respUpdateMeta.responseCode === '000') {
    // yield put(setFilterInTrackEditS(respUpdateMeta.option));
  }
}

export function* updateMetaFlow() {
  yield takeLatest(UPDATE_META, updateMetaSaga);
}

/* 工單資料 saga */

export function* getTagTypeSaga() {
  const respGetTabType = yield call(api.getTagType);
  if (respGetTabType.responseCode === '000') {
    const respTagList = yield call(api.getTagList, { type: respGetTabType.tags[0].val, limit: 5 });
    const respTagListAll = yield call(api.getTagListAll, { type: respGetTabType.tags[0].val });
    if (respTagList.responseCode === '000') {
      yield put(setTagList(respTagList.tagList));
      yield put(setTagListSize(respTagListAll.size));
    }
  }
  yield put(setTagType(respGetTabType));
}

export function* getTagTypeFlow() {
  yield takeLatest(GET_TAG_TYPE, getTagTypeSaga);
}

export function* getTrackListSaga(data) {
  const layerOrder = [];
  const layerObject = {};
  const { id, type } = data.data;
  const respSearchFilter = yield call(api.getSearchFilter);
  const rootIndex = 0;
  if (respSearchFilter.responseCode === '000') {
    for (let i = 0; i < respSearchFilter.field.length; i += 1) {
      layerObject[respSearchFilter.field[i].val] = {};
      layerOrder.push(respSearchFilter.field[i].val);
    }
    const respGetTrackByfilterTag = yield call(api.getTrackByfilterTag, {
      searchField: respSearchFilter.field[rootIndex].val,
      type,
      id,
    });
    if (respGetTrackByfilterTag.track.length > 0) {
      // factory
      if (respGetTrackByfilterTag.track[0].isNA === true) {
        const arr = [];
        let obj = {};
        for (let j = 0; j < respGetTrackByfilterTag.track.length; j += 1) {
          obj = {
            parent: null,
            name: respGetTrackByfilterTag.track[j]._id.name,
            val: respGetTrackByfilterTag.track[j]._id.val,
            time: timeTransForm(respGetTrackByfilterTag.track[j].inTs),
            isNA: respGetTrackByfilterTag.track[j].isNA,
          };
          arr.push(obj);
          layerObject[respSearchFilter.field[rootIndex].val] = arr;
        }
      } else {
        const arr = [];
        let obj = {};
        for (let j = 0; j < respGetTrackByfilterTag.track.length; j += 1) {
          obj = {
            parent: null,
            name: respGetTrackByfilterTag.track[j]._id.name,
            val: respGetTrackByfilterTag.track[j]._id.val,
            time: timeTransForm(respGetTrackByfilterTag.track[j].inTs, respGetTrackByfilterTag.track[j].outTs),
            isNA: respGetTrackByfilterTag.track[j].isNA,
          };
          arr.push(obj);
          layerObject[respSearchFilter.field[rootIndex].val] = arr;
        }
      }
      // others
      for (let k = 1; k < layerOrder.length; k += 1) {
        let arr = [];
        for (let l = 0; l < layerObject[layerOrder[k - 1]].length; l += 1) {
          const respGetTrackByfilterValTag = yield call(api.getTrackByfilterValTag, {
            searchField: layerOrder[k - 1],
            val: layerObject[layerOrder[k - 1]][l].val,
            child: layerOrder[k],
            type,
            id,
          });
          if (respGetTrackByfilterValTag.responseCode === '000') {
            for (let j = 0; j < respGetTrackByfilterValTag.track.length; j += 1) {
              if (respGetTrackByfilterValTag.track[j].isNA === true) {
                let obj = {};
                obj = {
                  parent: layerObject[layerOrder[k - 1]][l].val,
                  name: respGetTrackByfilterValTag.track[j]._id.name,
                  val: respGetTrackByfilterValTag.track[j]._id.val,
                  time: timeTransForm(respGetTrackByfilterValTag.track[j].inTs),
                  isNA: respGetTrackByfilterValTag.track[j].isNA,
                  extra: respGetTrackByfilterValTag.track[j].extra[0],
                };
                arr.push(obj);
                layerObject[respSearchFilter.field[k].val] = arr;
              } else {
                let obj = {};
                obj = {
                  parent: layerObject[layerOrder[k - 1]][l].val,
                  name: respGetTrackByfilterValTag.track[j]._id.name,
                  val: respGetTrackByfilterValTag.track[j]._id.val,
                  time: timeTransForm(respGetTrackByfilterValTag.track[j].inTs, respGetTrackByfilterValTag.track[j].outTs),
                  isNA: respGetTrackByfilterValTag.track[j].isNA,
                  extra: respGetTrackByfilterValTag.track[j].extra[0],
                };
                arr.push(obj);
                layerObject[respSearchFilter.field[k].val] = arr;
              }
            }
          }
        }
        arr = [];
      }
    }
    yield put(setTrackList(layerObject));
  }
}

export function* getTrackListFlow() {
  yield takeLatest(GET_TRACK_LIST, getTrackListSaga);
}

export function* getTagListSaga(data) {
  const { tagType } = data.data;
  const apiObj = {};
  const apiWOPageObj = {};
  apiObj.type = tagType;
  apiObj.limit = '5';
  apiWOPageObj.type = tagType;
  if ('id' in data.data) {
    apiObj.id = data.data.id;
    apiWOPageObj.id = data.data.id;
  }
  if ('date' in data.data) {
    if (data.data.date[0] !== '' || data.data.date[1] !== '') {
      apiObj.date = data.data.date;
      apiWOPageObj.date = data.data.date;
    }
  }
  if ('page' in data.data) {
    apiObj.page = data.data.page;
  }
  const respTagList = yield call(api.getTagList, apiObj);
  const respTagListWOPage = yield call(api.getTagList, apiWOPageObj);
  if (respTagList.responseCode === '000') {
    yield put(setTagList(respTagList.tagList));
    yield put(setTrackList({}));
  }

  if (respTagListWOPage.responseCode === '000') {
    yield put(setTagListSize(respTagListWOPage.tagList.length));
  }
}

export function* getTagListFlow() {
  yield takeLatest(GET_TAG_LIST, getTagListSaga);
}

export function* getTrackByIdListSaga(data) {
  const respGetTrackList = yield call(api.getTrack, data.data);
  if (respGetTrackList.responseCode === '000') {
    yield put(setTrackByIdList(respGetTrackList.trackList));
  }
}

export function* getTrackByIdListFlow() {
  yield takeLatest(GET_TRACK_BY_ID_LIST, getTrackByIdListSaga);
}

export function* updateTagSaga(data) {
  const { type, date, searchId } = data.data;
  const respUpdateTag = yield call(api.updateTagByAdmin, data.data);
  if (respUpdateTag.responseCode === '000') {
    const apiObj = {};
    apiObj.type = type;
    if (searchId !== '') {
      apiObj.id = data.data.id;
    }
    if (date[0] !== '') {
      if (data.data.date[0] !== '' || data.data.date[1] !== '') {
        apiObj.date = data.data.date;
      }
    }
    const respTagList = yield call(api.getTagList, apiObj);
    if (respTagList.responseCode === '000') {
      yield put(setTagList(respTagList.tagList));
      yield put(setTrackList({}));
    }
  }
}

export function* updateTagFlow() {
  yield takeLatest(UPDATE_TAG, updateTagSaga);
}

// insert tag 2019/01/21
export function* insertTagSaga(data) {
  const payload = {};
  const apiWOPageObj = {};
  payload.fport = 165;
  payload.macAddr = '0000000001000008';
  payload.data = data.data.id;

  // apiWOPageObj.id = '0000000001000008';
  apiWOPageObj.type = 1;

  yield put(sendingRequestM(true));
  const respInsertTag = yield call(api.insertTagByAdmin, payload);
  if (respInsertTag.responseCode === '000') {
    const apiObj = {};
    apiObj.type = 1;
    yield call(delay, 3000);
    const respTagList = yield call(api.getTagList, apiObj);
    if (respTagList.responseCode === '000') {
      yield put(setTagList(respTagList.tagList));
      yield put(setTrackList({}));
      yield put(sendingRequestM(false));
    }
    const respTagListWOPage = yield call(api.getTagList, apiWOPageObj);
    if (respTagListWOPage.responseCode === '000') {
      yield put(setTagListSize(respTagListWOPage.tagList.length));
    }
  }
}

const delay = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export function* insertTagFlow() {
  yield takeLatest(INSERT_TAG, insertTagSaga);
}

export default function* rootSaga() {
  yield fork(getSearchFilterFlow);
  yield fork(getSearchFilterParentValFlow);
  yield fork(getTagTypeFlow);
  yield fork(getTrackListFlow);
  yield fork(getTagListFlow);
  yield fork(getTrackByIdListFlow);
  yield fork(updateTagFlow);
  yield fork(getDeviceMetaFlow);
  yield fork(getTagByMetaFlow);
  yield fork(getTrackByMacFlow);
  yield fork(getShowFieldFlow);
  yield fork(getFilterInTrackEditFFlow);
  yield fork(getFilterInTrackEditZFlow);
  yield fork(getFilterInTrackEditSFlow);
  yield fork(updateMetaFlow);
  yield fork(insertTagFlow);
}
