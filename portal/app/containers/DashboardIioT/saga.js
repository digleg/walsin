/* eslint-disable camelcase */

import { call, put, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import api from '../../utils/apiRequest';
import {
  GET_LAYOUT_LIST,
  GET_LAYOUT_DATA_LIST,
  SET_MQTT_CTL,
  SET_LAYOUT_LIST_INDEX,
  // SET_UPLOAD_PLAN,
  GET_UPLOAD_PLAN_LIST,
  GET_EVENT_TYPE,
  GET_SENSOR_LIST_BY_PORT,
  GET_DATA_FIELD,
  GET_PREVIEW_GRAPH,
  SET_DASHBOARD_DL,
  SET_UPLOAD_PLAN,
  GET_LAYOUT_DATA_W_SEARCH,
} from './constants';
import {
  setLayoutList,
  setLayoutDataList,
  setUploadPlanList,
  setEventType,
  setSensorListByPort,
  setDataField,
  setPrevData,
  setLayoutDataWSearch,
} from './actions';
import tempDataProcess from './dataProcess/tempDataProcess';
import humiDataProcess from './dataProcess/humiDataProcess';
import { sendingRequestS } from '../App/actions';

export function* getLayoutSaga() {
  yield put(setLayoutList(null)); // clear first
  yield put(sendingRequestS(true));
  const respLayout = yield call(api.getLayout);
  if (respLayout.responseCode === '000') {
    yield put(setLayoutList(respLayout.layout)); // an array index by tab
    yield put(sendingRequestS(false));
  }
}

export function* getLayoutFlow() {
  yield takeLatest(GET_LAYOUT_LIST, getLayoutSaga);
}

export function* setLayoutSaga(data) {
  // yield put(sendingRequestS(true));
  const resp = yield call(api.updateLayout, data);
  if (resp.responseCode === '000') {
    yield delay(200);
    const respLayout = yield call(api.getLayout);
    yield put(setLayoutList(respLayout.layout));
  }
  yield delay(200);
  // yield put(sendingRequestS(false));
}

export function* setLayoutFlow() {
  yield takeLatest(SET_LAYOUT_LIST_INDEX, setLayoutSaga);
}

export function* getLayoutDataSaga(data) {
  // const { tabValue, status } = data.data;
  const { tabValue, status } = data.data;
  // let tabTypeInit;
  let flg = 0;
  if (status !== 'stop') {
    // do {
    // yield put(setLayoutDataList(null));
    if (flg === 0) {
      yield put(setLayoutDataList(null));
      flg = 1;
    }
    const respLayout = yield call(api.getLayout);
    if (respLayout.responseCode === '000') {
      const { layout } = respLayout;
      // tabTypeInit = layout[tabValue].tabType;
      // if (tabType !== undefined) {
      //   tabTypeInit = tabType;
      // }
      const layoutDataList = [];
      for (let i = 0; i < layout.length; i += 1) {
        if (i === tabValue) {
          const widgetDataList = [];
          if (layout[i].tabType === 'Plan') {
            for (let l = 0; l < layout[i].planInfo.widgetInfo.length; l += 1) {
              const widgetInfo = layout[i].planInfo.widgetInfo;
              if (widgetInfo.length === 0) {
                widgetDataList.push(null);
              } else if (widgetInfo[l].widgetType === 'Tag') {
                const THWidgetData1 = yield call(api[widgetInfo[l].widgetData.api.shelfWidgetApi1], widgetInfo[l].shelfID);
                const THWidgetData2 = yield call(api[widgetInfo[l].widgetData.api.shelfWidgetApi2], widgetInfo[l].shelfID);
                const widgetDataListItem = [];
                if (THWidgetData2.responseCode === '000') {
                  for (let o = 0; o < THWidgetData2.trackList.length; o += 1) {
                    widgetDataListItem.push('tagID:'.concat(THWidgetData2.trackList[o].tagId).concat(' '));
                  }
                }
                widgetDataList.push([THWidgetData1.size, widgetDataListItem]);
              } else if (widgetInfo[l].widgetType === 'M') {
                const THWidgetData = yield call(api[widgetInfo[l].widgetData.api[0]], widgetInfo[l].widgetData.macAddr);
                const widgetDataListItem = [];
                const dataItem = {
                  type: 'macAddr',
                  meta: widgetInfo[l].widgetData.macAddr,
                };
                const widgetDataTagList = yield call(api[widgetInfo[l].widgetData.api[1]], { data: dataItem, showFlg: 1 });
                if (THWidgetData.responseCode === '000') {
                  for (let o = 0; o < Object.keys(widgetInfo[l].widgetData.showField).length; o += 1) {
                    if (Object.values(widgetInfo[l].widgetData.showField)[o] === 'true') {
                      if (Object.keys(widgetInfo[l].widgetData.showField)[o].split('.').length === 1) {
                        const key = Object.keys(widgetInfo[l].widgetData.showField)[o];
                        widgetDataListItem.push({ [key]: THWidgetData.device[key] });
                      } else {
                        let val = THWidgetData.device[Object.keys(widgetInfo[l].widgetData.showField)[o].split('.')[0]].meta;
                        if (val !== undefined) {
                          for (let p = 1; p < Object.keys(widgetInfo[l].widgetData.showField)[o].split('.').length; p += 1) {
                            val = val[Object.keys(widgetInfo[l].widgetData.showField)[o].split('.')[p]];
                          }
                        }
                        const key = Object.keys(widgetInfo[l].widgetData.showField)[o];
                        widgetDataListItem.push({ [key]: val });
                      }
                    }
                  }
                }
                if (THWidgetData.responseCode === '000' && widgetDataTagList.responseCode === '000') {
                  if (widgetInfo[l].widgetData.type === 'Device') {
                    widgetDataList.push([widgetDataListItem, widgetDataTagList.trackList, 'Device']);
                  } else {
                    widgetDataList.push([widgetDataListItem, widgetDataTagList.trackList, 'M']);
                  }
                }
              } else if (widgetInfo[l].widgetType === 'T') {
                const widgetData = yield call(api[widgetInfo[l].widgetData.api.THApi], {
                  fport: widgetInfo[l].widgetData.fport,
                  macAddr: widgetInfo[l].widgetData.mac,
                  limit: widgetInfo[l].widgetData.limit,
                });
                const resp_ProcT = tempDataProcess(widgetData, 'information.temperature');
                const resp_ProcH = humiDataProcess(widgetData, 'information.humidity');
                // condition process start
                // const ops = [];
                let bool = false;
                const cssSetting = [];
                for (let m = 0; m < widgetInfo[l].ops.length; m += 1) {
                  // const conditons = [];
                  let boolPrev = false;
                  let flag = 0;
                  for (let n = 0; n < widgetInfo[l].ops[m].condition.length; n += 1) {
                    // conditons.push([widgetInfo[l].ops[m].condition[n].op, widgetInfo[l].ops[m].condition[n].val]);
                    // not dynamtic enough !
                    if (widgetInfo[l].ops[m].condition[n].field === 'information.temperature') {
                      switch (widgetInfo[l].ops[m].condition[n].op) {
                        case '>':
                          bool = Boolean(resp_ProcT[2] > widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '<':
                          bool = Boolean(resp_ProcT[2] < widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '>=':
                          bool = Boolean(resp_ProcT[2] >= widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '<=':
                          bool = Boolean(resp_ProcT[2] <= widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '=':
                          bool = Boolean(resp_ProcT[2] === widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '≠':
                          bool = Boolean(resp_ProcT[2] !== widgetInfo[l].ops[m].condition[n].val);
                          break;
                        default:
                          break;
                      }
                    } else if (widgetInfo[l].ops[m].condition[n].field === 'information.humility') {
                      switch (widgetInfo[l].ops[m].condition[n].op) {
                        case '>':
                          bool = Boolean(resp_ProcH[2] > widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '<':
                          bool = Boolean(resp_ProcH[2] < widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '>=':
                          bool = Boolean(resp_ProcH[2] >= widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '<=':
                          bool = Boolean(resp_ProcH[2] <= widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '=':
                          bool = Boolean(resp_ProcH[2] === widgetInfo[l].ops[m].condition[n].val);
                          break;
                        case '≠':
                          bool = Boolean(resp_ProcH[2] !== widgetInfo[l].ops[m].condition[n].val);
                          break;
                        default:
                          break;
                      }
                    }
                    if (flag === 1) {
                      switch (widgetInfo[l].ops[m].condition[n].combine) {
                        case 'AND':
                          bool = boolPrev && bool;
                          break;
                        case 'OR':
                          bool = boolPrev || bool;
                          break;
                        default:
                          break;
                      }
                    }
                    if (bool && flag) {
                      cssSetting.push(widgetInfo[l].ops[m].css);
                    }
                    flag = 1;
                    boolPrev = bool;
                  }
                  // ops.push(conditons, cssSetting);
                }
                widgetDataList.push([resp_ProcT[2], resp_ProcH[2], cssSetting]);
              } else if (widgetInfo[l].widgetType === 'Switch') {
                const esdData = [];
                for (let p = 0; p < widgetInfo[l].mac.length; p += 1) {
                  const widgetData = yield call(api[widgetInfo[l].widgetData.api], {
                    fport: widgetInfo[l].widgetData.fport,
                    macAddr: widgetInfo[l].widgetData.mac[p],
                    limit: widgetInfo[l].widgetData.limit,
                  });
                  esdData.push(widgetData.data[0].information.status);
                }
                widgetDataList.push(esdData);
              }
            }
            layoutDataList.push(widgetDataList);
          } else if (layout[i].tabType === 'Chart') {
            const chartDataList = [];
            for (let j = 0; j < layout[i].chartInfo.length; j += 1) {
              const chartInfo = layout[i].chartInfo;
              if (chartInfo.length === 0) {
                chartDataList.push(null);
              } else if (chartInfo[j].chartType === 'lineChart') {
                const lineChartData = yield call(api[chartInfo[j].chartData.api.lineChartApi], {
                  fport: chartInfo[j].chartData.fport,
                  macAddr: chartInfo[j].chartData.mac,
                  limit: chartInfo[j].chartData.limit,
                });
                if (lineChartData.responseCode === '000') {
                  const THPair = [];
                  let resp_lProc;
                  if (layout[i].chartInfo[j].chartData.vals[0].mainVal === 'information.temperature') {
                    if (j === 0) {
                      resp_lProc = tempDataProcess(lineChartData, layout[i].chartInfo[j].chartData.vals[0].mainVal);
                    } else {
                      resp_lProc = tempDataProcess(lineChartData, layout[i].chartInfo[j].chartData.vals[0].mainVal);
                    }
                  } else if (layout[i].chartInfo[j].chartData.vals[0].mainVal === 'information.humidity') {
                    if (j === 1) {
                      resp_lProc = humiDataProcess(lineChartData, layout[i].chartInfo[j].chartData.vals[0].mainVal);
                    } else {
                      resp_lProc = humiDataProcess(lineChartData, layout[i].chartInfo[j].chartData.vals[0].mainVal);
                    }
                  }
                  THPair.push(resp_lProc);
                  chartDataList.push(THPair);
                }
              } else if (chartInfo[j].chartType === 'switchChart') {
                const switchChartData = yield call(api[chartInfo[j].chartData.api.switchChartApi], {
                  fport: chartInfo[j].chartData.fport,
                  macAddr: chartInfo[j].chartData.mac,
                  limit: chartInfo[j].chartData.limit,
                });
                const switchChartDataGrp = [];
                for (let k = 0; k < Object.keys(switchChartData.data[0].information).length; k += 1) {
                  switchChartDataGrp.push(Object.values(switchChartData.data[0].information)[k]);
                }
                chartDataList.push(switchChartDataGrp);
              } else if (chartInfo[j].chartType === 'esdChart') {
                const esdChartData = [];
                for (let l = 0; l < chartInfo[j].chartData.mac.length; l += 1) {
                  const esdChartResp = yield call(api[chartInfo[j].chartData.api], {
                    fport: chartInfo[j].chartData.fport,
                    macAddr: chartInfo[j].chartData.mac[l],
                    limit: chartInfo[j].chartData.limit,
                  });
                  if (esdChartResp.total === 0) {
                    esdChartData.push(null);
                  } else {
                    esdChartData.push(esdChartResp.data[0].information.status);
                  }
                }
                chartDataList.push(esdChartData);
              } else if (chartInfo[j].chartType === 'ACChart') {
                const ACInfo = chartInfo[j].chartData;
                const ACArr = [];
                for (let k = 0; k < ACInfo.mac.length; k += 1) {
                  const ACErrorResp = yield call(api[ACInfo.api], {
                    macAddr: ACInfo.mac[k],
                    fport: ACInfo.fport,
                    limit: ACInfo.limit,
                  });
                  const ACCloseResp = yield call(api[ACInfo.api], {
                    macAddr: ACInfo.mac[k],
                    fport: ACInfo.fport2,
                    limit: ACInfo.limit,
                    search: ACInfo.search,
                  });
                  if (ACCloseResp.data.length === 0) {
                    // data don't existed status is default to 0
                    ACArr.push([ACErrorResp.data[0].macAddr, Number(ACErrorResp.data[0].information.status), 0]);
                  } else {
                    // data do existed
                    ACArr.push([
                      ACErrorResp.data[0].macAddr,
                      Number(ACErrorResp.data[0].information.status),
                      ACCloseResp.data[0].information.switch,
                    ]);
                  }
                }
                chartDataList.push(ACArr);
              }
            }
            layoutDataList.push(chartDataList);
          } else if (layout[i].tabType === 'Tableau') {
            layoutDataList.push(layout[i].tableInfo.url);
          } else if (layout[i].tabType === 'Warning') {
            const warningInfo = layout[i].warningInfo;
            const warnArr = [];
            for (let j = 0; j < warningInfo.mac.length; j += 1) {
              const warningResp = yield call(api[warningInfo.api], {
                mac: warningInfo.mac[j],
              });
              warnArr.push({
                device_mac: warningResp.device.device_mac,
                device_name: warningResp.device.device_name,
                meta: warningResp.device.meta,
              });
            }
            layoutDataList.push(warnArr);
          }
        } else {
          layoutDataList.push([]);
        }
      }
      yield put(setLayoutDataList(layoutDataList));
    } else if (respLayout.responseCode === '404') {
      // yield put(setLayoutDataList(null));
      const initData = [{ tab: 'default', tabIcon: 'account_balance', tabType: 'Chart', chartInfo: [] }];
      const resp = yield call(api.updateLayout, { data: initData });
      yield delay(500);
      if (resp.responseCode === '000') {
        const respL = yield call(api.getLayout);
        if (respL.responseCode === '000') {
          yield put(setLayoutList(respL.layout)); // an array index by tab
          yield put(setLayoutDataList([])); // an array index by tab
          yield put(sendingRequestS(false));
        }
      }
    }
    // yield delay(5000);
    // } while (tabTypeInit !== 'Tableau');
  }
}

export function* getLayoutDataFlow() {
  yield takeLatest(GET_LAYOUT_DATA_LIST, getLayoutDataSaga);
}

const delay = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export function* setMqttCtlSaga(data) {
  let mqttStr = '';
  for (let i = 0; i < data.data.length - 1; i += 1) {
    mqttStr = mqttStr.concat(data.data[i]);
  }
  if (data.data[data.data.length] === 'light') {
    // const resp = yield call(api.mqttCtl, mqttStr);
  } else if (data.data[data.data.length] === 'air') {
    // const resp = yield call(api.mqttCtlAir, mqttStr);
  }
  yield call(delay, 300);
  getLayoutDataSaga();
}

export function* setMqttCtlFlow() {
  yield takeLatest(SET_MQTT_CTL, setMqttCtlSaga);
}

export function* setUploadPlanSaga(data) {
  const { file, id, planName, planDesc, planVers, planVeri } = data.data;
  yield call(api.uploadPlan, file, id, planName, planDesc, planVers, planVeri);
}

export function* setUploadPlanFlow() {
  yield takeLatest(SET_UPLOAD_PLAN, setUploadPlanSaga);
}

export function* getUploadPlanListSaga() {
  yield put(sendingRequestS(true));
  const resp = yield call(api.getPlanList);
  if (resp.responseCode === '000') {
    yield put(setUploadPlanList(resp.fList));
    yield put(sendingRequestS(false));
  } else {
    // error handling
  }
}

export function* getUploadPlanListFlow() {
  yield takeLatest(GET_UPLOAD_PLAN_LIST, getUploadPlanListSaga);
}

export function* getEventTypeSaga() {
  const resp = yield call(api.getEventType);
  if (resp.responseCode === '000') {
    yield put(setEventType(resp.data));
  } else {
    // error handling
  }
}

export function* getEventTypeFlow() {
  yield takeLatest(GET_EVENT_TYPE, getEventTypeSaga);
}

export function* getSensorListByPortSaga(data) {
  const { fport } = data.data;
  const resp = yield call(api.getSensorByfport, fport);
  if (resp.responseCode === '000') {
    yield put(setSensorListByPort(resp.mList));
  } else {
    // error handling
  }
}

export function* getSensorListByPortFlow() {
  yield takeLatest(GET_SENSOR_LIST_BY_PORT, getSensorListByPortSaga);
}

export function* getDataFieldSaga(data) {
  yield put(sendingRequestS(true));
  const { selValFPort, selMacAddr } = data.data;
  const dataFieldResp = [];
  if (Array.isArray(selMacAddr)) {
    for (let i = 0; i < selMacAddr.length; i += 1) {
      const resp = yield call(api.getEventList, { fport: selValFPort, macAddr: selMacAddr[i], limit: 1 });
      if (resp.responseCode === '000') {
        // const selMacAddrNameInd = selMacAddrName[i];
        const infoArr = [];
        for (let j = 0; j < Object.keys(resp.data[0].information).length; j += 1) {
          infoArr.push(Object.keys(resp.data[0].information)[j]);
        }
        dataFieldResp.push(infoArr);
      }
    }
  } else {
    const resp = yield call(api.getEventList, { fport: selValFPort, macAddr: selMacAddr, limit: 1 });
    if (resp.responseCode === '000') {
      const infoArr = [];
      for (let j = 0; j < Object.keys(resp.data[0].information).length; j += 1) {
        infoArr.push(Object.keys(resp.data[0].information)[j]);
      }
      dataFieldResp.push(infoArr);
    }
  }
  yield put(setDataField(dataFieldResp));
  yield put(sendingRequestS(false));
}

export function* getDataFieldFlow() {
  yield takeLatest(GET_DATA_FIELD, getDataFieldSaga);
}

export function* getPreviewSaga(data) {
  const { addWidgetXAxisDataLimit, selYAxisData } = data.data;
  // selYAxisData
  const yAxisData = [];
  for (let i = 0; i < selYAxisData.length; i += 1) {
    yAxisData.push([]);
  }
  for (let i = 0; i < selYAxisData.length; i += 1) {
    yAxisData[i].push(selYAxisData[i].split(',')[0]);
    yAxisData[i].push(selYAxisData[i].split(',')[1]);
    yAxisData[i].push(selYAxisData[i].split(',')[2]);
  }
  const prewResp = [];
  for (let j = 0; j < yAxisData.length; j += 1) {
    const resp = yield call(api.getEventList, {
      fport: yAxisData[j][0],
      macAddr: yAxisData[j][1],
      limit: addWidgetXAxisDataLimit,
    });
    prewResp.push(resp);
  }
  yield put(setPrevData(prewResp));
}

export function* getPreviewFlow() {
  yield takeLatest(GET_PREVIEW_GRAPH, getPreviewSaga);
}

export function* setDashboardDLSaga(data) {
  const { fport, mac, message } = data.data;
  const resp = yield call(api.dashboardDLPost, { fport, mac, message });
  if (resp.responseCode === '000') {
    const respLayout = yield call(api.getLayout);
    yield put(setLayoutList(respLayout.layout)); // an array index by tab
    yield put(sendingRequestS(false));
  }
}

export function* setDashboardDLFlow() {
  yield takeEvery(SET_DASHBOARD_DL, setDashboardDLSaga);
}

export function* getLayoutDataWSearchSaga(data) {
  const resp = yield call(api.getTagByMeta, data);
  if (resp.responseCode === '000') {
    yield put(setLayoutDataWSearch(resp.trackList));
  }
}

export function* getLayoutDataWSearchFlow() {
  yield takeEvery(GET_LAYOUT_DATA_W_SEARCH, getLayoutDataWSearchSaga);
}

export default function* rootSaga() {
  yield fork(getLayoutFlow);
  yield fork(setLayoutFlow);
  yield fork(getLayoutDataFlow);
  yield fork(setMqttCtlFlow);
  yield fork(setUploadPlanFlow);
  yield fork(getUploadPlanListFlow);
  yield fork(getEventTypeFlow);
  yield fork(getSensorListByPortFlow);
  yield fork(getDataFieldFlow);
  yield fork(getPreviewFlow);
  yield fork(setDashboardDLFlow);
  yield fork(getLayoutDataWSearchFlow);
}
