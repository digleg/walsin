/* eslint-disable consistent-return */

import 'isomorphic-fetch';
import { saveAs } from 'file-saver';
import {
  apiELBUrlLogin,
  apiELBUrlLogout,
  apiELBUrlGetSummaryExpenseList,
  apiELBUrlGetUserList,
  apiELBUrlGetRoleList,
  apiELBUrlGetFunctionList,
  apiELBUrlGetExpGrpList,
  apiELBUrlGetExpensedtl,
  apiELBUrlUpdateUserStatus,
  apiELBUrlUpdateLayout,
  apiELBUrlGetMenuItem,
  apiELBUrlGetCpList,
  apiELBUrlUpdateRole,
  apiELBUrlGrpList,
  apiELBUrlUpdateGrpList,

  // LoRa
  apiELBUrlActiveCode,
  apiELBUrlGetSummaryList,
  // apiELBUrlGetGWList,
  apiELBUrlGetNodeList,
  apiELBUrlBindingCode,
  apiELBUrlPublishGwCmd,
  apiELBUrlGetFwList,
  apiELBUrlGetHistoryList,
  apiELBUrlGetHistoryDtlList,
  apiELBUrlUploadFw,
  // apiELBUrlGetSensorList,
  apiELBUrlDelHistory,
  apiELBUrlUpdateExpGrp,
  apiELBUrlgetRoboticList,
  apiELBUrlgetScriptList,
  apiELBUrlUpdateRAScript,
  apiELBUrlgetSysList,
  apiELBUrlUpdateGrpListbyCp,

  // Dashboard
  apiGetLayout,
  apiPlan,
  apiELBUrlGetEventList,
  apiELBUrlMqttCtl,
  apiDL,

  // robotic arm
  apiGetEventList,

  // event page
  apiELBUrlGetSensorListE,
  apiELBUrlGetEventListE,
  apiELBUrlGetGWListE,
  apiEventType,
  // getSensorByfport,
  apiRpt,
  apiRptChk,

  // alert page
  apiELBUrlGetAlertList,
  apiELBUrlAddAlertList,
  apiELBUrlDelAlertList,

  // virtual shelf
  apiTrackCnt,
  apiTrack,
  apiTag,
  api1Tag,
  apiSteelBeenShelf,
  apiTagCnt,
  apiSteelCnt,
  apiSteelBeenShelfCnt,
  apiGetDevInfobyMac,

  // tagPage
  apiGetSearchFilter,
  apiGetSearchOption,
  apiGetTrackCnt,
  apiGetTrack,
  apiGetTagType,
  apiGetTagList,
  apiGetTrackByfilterTag,
  apiGetTrackByfilterValTag,
  apiUpdateTagByAdmin,
  apiInsertTagByAdmin,
  apiGetDevMeta,
  apiGetTagByMeta,
  apiShowField,
  apiUpdateMeta,

  // personnel page
  apiZoneShowField,
  // devicePage
  apiDev,
} from '../../urls.conf';

import { getAuthToken } from './storageUtility';
import { getTripleDES } from './tripleDES';

// const SystemApiPath = '/rest/sys';
// const UserApiPath = '/rest/usr';
// const UploadApiPath = '/rest/usr/upload';

class ApiRequest {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getSummaryExpenseList = this.getSummaryExpenseList.bind(this);
    this.getSummaryWaterExpenseList = this.getSummaryWaterExpenseList.bind(this);
    this.getUserList = this.getUserList.bind(this);
    this.getRoleList = this.getRoleList.bind(this);
    this.getRoleListSearch = this.getRoleListSearch.bind(this);
    this.getFunctionList = this.getFunctionList.bind(this);
    this.getExpGrpList = this.getExpGrpList.bind(this);
    this.getExpDtl = this.getExpDtl.bind(this);
    this.searchUserList = this.searchUserList.bind(this);
    this.updateUserStatus = this.updateUserStatus.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.getMenuItem = this.getMenuItem.bind(this);
    this.getCpList = this.getCpList.bind(this);
    this.addUsr = this.addUsr.bind(this);
    this.addRole = this.addRole.bind(this);
    this.delUsr = this.delUsr.bind(this);
    this.getGrpList = this.getGrpList.bind(this);
    this.updateRoleByGrp = this.updateRoleByGrp.bind(this);
    this.updateRoleByFunc = this.updateRoleByFunc.bind(this);

    // LoRa
    this.activeLoraGateway = this.activeLoraGateway.bind(this);
    this.getSummaryList = this.getSummaryList.bind(this);
    this.getGWList = this.getGWList.bind(this);
    this.getNodeList = this.getNodeList.bind(this);
    this.getFwList = this.getFwList.bind(this);
    this.getHistoryList = this.getHistoryList.bind(this);
    this.getHistoryDtlList = this.getHistoryDtlList.bind(this);
    this.bindingLoraGateway = this.bindingLoraGateway.bind(this);
    this.publishGwCmd = this.publishGwCmd.bind(this);
    this.uploadFw = this.uploadFw.bind(this);
    this.getSensorList = this.getSensorList.bind(this);
    this.delHistory = this.delHistory.bind(this);

    this.addFunc = this.addFunc.bind(this);
    this.updateFunc = this.updateFunc.bind(this);
    this.updateFuncinRole = this.updateFuncinRole.bind(this);
    this.addExpGrp = this.addExpGrp.bind(this);
    this.updateExpGrp = this.updateExpGrp.bind(this);
    this.deleteExpGrp = this.deleteExpGrp.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
    this.delFunc = this.delFunc.bind(this);

    // Robotic
    this.getRoboticList = this.getRoboticList.bind(this);
    this.getScriptList = this.getScriptList.bind(this);
    this.uploadRAScript = this.uploadRAScript.bind(this);
    this.deleteRAScript = this.deleteRAScript.bind(this);
    this.editRAScript = this.editRAScript.bind(this);
    this.updateRAScript = this.updateRAScript.bind(this);
    this.getExecHistory = this.getExecHistory.bind(this);

    // Admin-CP
    this.addCp = this.addCp.bind(this);
    this.deleteCp = this.deleteCp.bind(this);
    this.editCp = this.editCp.bind(this);
    this.searchCpList = this.searchCpList.bind(this);
    this.updateGrpbyCp = this.updateGrpbyCp.bind(this);
    this.updateGrpbyCpEdit = this.updateGrpbyCpEdit.bind(this);

    // Admin-System
    this.getSysList = this.getSysList.bind(this);
    this.addSys = this.addSys.bind(this);
    this.editSys = this.editSys.bind(this);
    this.deleteSys = this.deleteSys.bind(this);
    this.searchSysList = this.searchSysList.bind(this);

    // Admin-Grp
    this.addGrp = this.addGrp.bind(this);
    this.editGrp = this.editGrp.bind(this);
    this.deleteGrp = this.deleteGrp.bind(this);
    this.searchGrpList = this.searchGrpList.bind(this);

    // Admin-Function
    this.getFunctionListSearch = this.getFunctionListSearch.bind(this);

    // Dashboard
    this.getLayout = this.getLayout.bind(this);
    this.getPlanList = this.getPlanList.bind(this);
    this.uploadPlan = this.uploadPlan.bind(this);
    this.delPlanList = this.delPlanList.bind(this);
    this.mqttCtl = this.mqttCtl.bind(this);
    this.mqttCtlAir = this.mqttCtlAir.bind(this);
    this.getEventListByMac = this.getEventListByMac.bind(this);
    this.dashboardDL = this.dashboardDL.bind(this);
    this.dashboardDLPost = this.dashboardDLPost.bind(this);

    // event page
    this.getSensorListE = this.getSensorListE.bind(this);
    this.getEventList = this.getEventList.bind(this);
    this.getReportList = this.getReportList.bind(this);
    this.getEventType = this.getEventType.bind(this);
    this.getSensorByfport = this.getSensorByfport.bind(this);
    this.getReportCnt = this.getReportCnt.bind(this);

    // alert page
    this.getAlertList = this.getAlertList.bind(this);
    this.addAlertList = this.addAlertList.bind(this);
    this.delAlertList = this.delAlertList.bind(this);

    // virtual shelf
    this.getSteelCntInShelf = this.getSteelCntInShelf.bind(this);
    this.getSteelInShelf = this.getSteelInShelf.bind(this);
    this.getShelfList = this.getShelfList.bind(this);
    this.getSteelList = this.getSteelList.bind(this);
    this.getSteelBeenShelfList = this.getSteelBeenShelfList.bind(this);
    this.getTagCnt = this.getTagCnt.bind(this);
    this.getSteelCnt = this.getSteelCnt.bind(this);
    this.getSteelBeenShelfCnt = this.getSteelBeenShelfCnt.bind(this);
    this.editShelf = this.editShelf.bind(this);
    this.editSteel = this.editSteel.bind(this);
    this.getDevInfobyMac = this.getDevInfobyMac.bind(this);

    // Tag page
    this.getSearchFilter = this.getSearchFilter.bind(this);
    this.getSearchOptionWithRoot = this.getSearchOptionWithRoot.bind(this);
    this.getSearchOptionWithParentVal = this.getSearchOptionWithParentVal.bind(this);
    this.getTrackCount = this.getTrackCount.bind(this);
    this.getTrack = this.getTrack.bind(this);
    this.getTagType = this.getTagType.bind(this);
    this.getTagList = this.getTagList.bind(this);
    this.getTagListAll = this.getTagListAll.bind(this);
    this.getTrackByfilterTag = this.getTrackByfilterTag.bind(this);
    this.getTrackByfilterValTag = this.getTrackByfilterValTag.bind(this);
    this.updateTagByAdmin = this.updateTagByAdmin.bind(this);
    this.getGetDevMeta = this.getGetDevMeta.bind(this);
    this.getTagByMeta = this.getTagByMeta.bind(this);
    this.getTagByMetaWPage = this.getTagByMetaWPage.bind(this);
    this.getShowField = this.getShowField.bind(this);
    this.updateMeta = this.updateMeta.bind(this);
    this.insertTagByAdmin = this.insertTagByAdmin.bind(this);

    // Device Page
    this.addDevByAdmin = this.addDevByAdmin.bind(this);
    this.delDevByAdmin = this.delDevByAdmin.bind(this);
    this.editDevByAdmin = this.editDevByAdmin.bind(this);

    //personnel page
    this.getSearchFilterByPersonnel = this.getSearchFilterByPersonnel.bind(this);
    this.getZoneShowField = this.getZoneShowField.bind(this);
    this.getTagTypeIn2 = this.getTagTypeIn2.bind(this);
    
  }

  // POST function
  sendRequest(apiLocation, req) {
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });

      // const timeout = setTimeout(() => {
      //   reject('Server-side Request Timeout');
      // }, 5000);
      // return timeout;
    });
  }

  // GET function
  sendRequestGet(apiLocation) {
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          } else return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  sendRequestGetSave(apiLocation, fileName) {
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.blob())
        .then(blob => {
          if (fileName === '') {
            saveAs(blob, 'eventList.xlsx');
          } else {
            saveAs(blob, fileName.concat('.xlsx'));
          }

          return 0;
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // PUT function
  sendRequestPut(apiLocation, req) {
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Delete function
  sendRequestDelete(apiLocation, req) {
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://10.70.51.54:1880/',
        },
        body: JSON.stringify(req),
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Form POST function
  sendFormRequest(apiLocation, file, id, name, desc, version, verifier, token) {
    const data = new FormData();
    data.append('myFile', file);
    data.append('id', id);
    data.append('name', name);
    data.append('desc', desc);
    data.append('version', version);
    data.append('verifier', verifier);
    data.append('token', token);
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': 'http://10.70.51.54:1880/',
        },
        body: data,
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Form POST function
  sendFormReq(apiLocation, data) {
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': 'http://10.70.51.54:1880/',
        },
        body: data,
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // Form MQTT POST function
  sendFormMQTTRequest(apiLocation, message, token) {
    const bodyStr = 'message='
      .concat(message)
      .concat('&topic=')
      .concat('GIOT-GW/DL/0000deedbafefeed')
      .concat('&token=')
      .concat(encodeURIComponent(token));
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyStr,
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  sendFormMQTTAirRequest(apiLocation, message, token) {
    const bodyStr = 'message='
      .concat(message)
      .concat('&topic=')
      .concat('GIOT-GW/DL/0000deedbafefef2')
      .concat('&token=')
      .concat(encodeURIComponent(token));
    return new Promise((resolve, reject) => {
      fetch(apiLocation, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyStr,
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // POST
  sendRequestPost(api, body) {
    return new Promise((resolve, reject) => {
      fetch(api, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })
        .then(response => {
          if (response.status >= 400) {
            reject({ 'Bad response from server': response });
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // api start
  login(_acc, _pwd, _type) {
    const req = { acc: _acc, pwd: _pwd, type: _type };
    return this.sendRequest(apiELBUrlLogin, req);
  }

  logout(token) {
    // const that = this;
    const req = { token };
    return this.sendRequest(apiELBUrlLogout, req);
  }

  getSummaryExpenseList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetSummaryExpenseList
      .concat('?token=')
      .concat(token)
      .concat('&type=e');
    return this.sendRequestGet(urlToken);
  }

  getSummaryWaterExpenseList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetSummaryExpenseList
      .concat('?token=')
      .concat(token)
      .concat('&type=w');
    return this.sendRequestGet(urlToken);
  }

  getUserList() {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetUserList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }

  searchUserList(data) {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetUserList
      .concat('?token=')
      .concat(token)
      .concat('&search=')
      .concat(data);
    return this.sendRequestGet(urlToken);
  }

  getRoleList() {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetRoleList.concat('?token=').concat(token);
    // .concat('&type=w');
    return this.sendRequestGet(urlToken);
  }

  getRoleListSearch(data) {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetRoleList
      .concat('?token=')
      .concat(token)
      .concat('&search=')
      .concat(data);
    return this.sendRequestGet(urlToken);
  }

  getFunctionList() {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetFunctionList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }

  getFunctionListSearch(data) {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetFunctionList
      .concat('?token=')
      .concat(token)
      .concat('&search=')
      .concat(encodeURIComponent(getTripleDES('roleId:=:'.concat(data))));
    return this.sendRequestGet(urlToken);
  }

  getExpGrpList() {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetExpGrpList.concat('?token=').concat(token);
    // .concat('&type=w');
    return this.sendRequestGet(urlToken);
  }

  getExpDtl() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetExpensedtl
      .concat('?token=')
      .concat(token)
      .concat('&type=e');
    return this.sendRequestGet(urlToken);
  }

  updateUserStatus(_userName, _cpId, _roleName, _userBlockFlag) {
    const getToken = getAuthToken();
    const req = { mUserId: _userName, catId: _cpId, roleId: _roleName, userBlock: _userBlockFlag, token: getToken };
    return this.sendRequestPut(apiELBUrlUpdateUserStatus, req);
  }

  updateLayout(data) {
    const getToken = getAuthToken();
    const req = { token: getToken, layout: data.data };
    return this.sendRequest(apiELBUrlUpdateLayout, req);
  }

  getMenuItem(data) {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetMenuItem
      .concat(data)
      .concat('?token=')
      .concat(encodeURIComponent(token));
    return this.sendRequestGet(urlToken);
  }

  getCpList() {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGetCpList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }

  addUsr(_textName, _textEmail, _textPw, _selGender, _selCp, _roleId, _selBlock) {
    const getToken = getAuthToken();
    const req = {
      name: _textName,
      email: _textEmail,
      pwd: _textPw,
      gender: _selGender,
      catId: _selCp,
      roleId: _roleId,
      userBlock: _selBlock,
      token: getToken,
    };
    return this.sendRequest(apiELBUrlUpdateUserStatus, req);
  }
  delUsr(_userId) {
    const getToken = getAuthToken();
    const req = {
      delUserId: _userId,
      token: getToken,
    };
    return this.sendRequestDelete(apiELBUrlGetUserList, req);
  }
  addRole(_selDataLevel, _textRoleName) {
    const getToken = getAuthToken();
    const req = {
      roleId: -1,
      dataId: _selDataLevel,
      roleName: _textRoleName,
      token: getToken,
    };
    return this.sendRequest(apiELBUrlUpdateRole, req);
  }
  getGrpList() {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGrpList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }

  updateRoleByGrp(_catId, _grps, _type) {
    const getToken = getAuthToken();
    const req = {
      catId: _catId,
      grps: _grps,
      type: _type,
      token: getToken,
    };
    return this.sendRequest(apiELBUrlUpdateGrpList, req);
  }

  updateRoleByFunc(catId, func, type) {
    const getToken = getAuthToken();
    const req = {
      catId,
      func,
      type,
      token: getToken,
    };
    return this.sendRequest(apiELBUrlUpdateGrpList, req);
  }

  // LoRa
  activeLoraGateway(_d) {
    // apiELBUrlActiveCode
    const tokenTmp = getAuthToken();
    const req = { d: _d, token: tokenTmp };
    return this.sendRequest(apiELBUrlActiveCode, req);
  }

  bindingLoraGateway(_d) {
    // apiELBUrlActiveCode
    const tokenTmp = getAuthToken();
    const req = { d: _d, token: tokenTmp };
    return this.sendRequest(apiELBUrlBindingCode, req);
  }

  getSummaryList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetSummaryList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }
  getGWList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetGWListE
      .concat('?token=')
      .concat(encodeURIComponent(token))
      .replace('{status}', -1);
    return this.sendRequestGet(urlToken);
  }
  getAlertList(data) {
    const token = getAuthToken();
    let urlToken = apiELBUrlGetAlertList.concat('?token=').concat(encodeURIComponent(token));
    if (data === undefined) {
      return this.sendRequestGet(urlToken);
    }
    if (data.fport !== undefined) {
      urlToken = urlToken.concat('&fport=', data.fport);
    }
    if (data.limit !== undefined) {
      urlToken = urlToken.concat('&limit=', data.limit);
    }
    if (data.page !== undefined) {
      urlToken = urlToken.concat('&page=', data.page);
    }
    if (data.paginate !== undefined) {
      urlToken = urlToken.concat('&paginate=', data.paginate);
    }
    if (data.sort !== undefined) {
      urlToken = urlToken.concat('&sort=', data.sort);
    }
    return this.sendRequestGet(urlToken);
  }
  addAlertList(data) {
    const token = getAuthToken();
    const dataParam = {
      token,
      data,
    };
    return this.sendRequest(apiELBUrlAddAlertList, dataParam);
  }

  delAlertList(id) {
    const token = getAuthToken();
    const dataParam = {
      token,
    };
    const delUrlApi = apiELBUrlDelAlertList.replace('{id}', id);
    return this.sendRequestDelete(delUrlApi, dataParam);
  }

  getSensorList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetSensorListE
      .concat('?token=')
      .concat(encodeURIComponent(token))
      .replace('{status}', -1);
    return this.sendRequestGet(urlToken);
  }
  getNodeList(_org, _type, _id) {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetNodeList
      .replace('{org}', _org)
      .replace('{deviceType}', _type)
      .replace('{deviceId}', _id)
      .concat('?token=')
      .concat(token);
    return this.sendRequestGet(urlToken);
  }
  getFwList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetFwList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }
  getHistoryList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetHistoryList
      .replace('{org}', 'kqqhst')
      .concat('?token=')
      .concat(token);
    return this.sendRequestGet(urlToken);
  }
  getHistoryDtlList(_org, _id) {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetHistoryDtlList
      .replace('{org}', 'kqqhst')
      .replace('{reqId}', _id)
      .concat('?token=')
      .concat(token);
    return this.sendRequestGet(urlToken);
  }
  publishGwCmd(_org, _type, _id, _cmdType, _fwId) {
    const token = getAuthToken();
    const req = { ids: _id, token, fwId: _fwId };
    const urlToken = apiELBUrlPublishGwCmd
      .replace('{org}', _org)
      .replace('{deviceType}', _type)
      .replace('{cmd}', _cmdType);
    return this.sendRequest(urlToken, req);
  }
  uploadFw(_myfile, _id, _name, _desc, _version, _verfier) {
    const token = getAuthToken();
    return this.sendFormRequest(apiELBUrlUploadFw, _myfile, _id, _name, _desc, _version, _verfier, token);
  }
  delHistory(_id) {
    const token = getAuthToken();
    const req = { token };
    const urlToken = apiELBUrlDelHistory.replace('{org}', 'kqqhst').replace('{reqId}', _id);
    return this.sendRequestDelete(urlToken, req);
  }
  addFunc(_funcName, _funcUrl, _grpId, _hiddenFlg, _parentId) {
    const token = getAuthToken();
    const req = {
      funcId: -1,
      funcName: _funcName,
      funcUrl: _funcUrl,
      parentId: _parentId,
      sortId: 0,
      grpId: _grpId,
      hiddenFlg: _hiddenFlg,
      token,
    };
    return this.sendRequest(apiELBUrlGetFunctionList, req);
  }
  updateFunc(_funcName, _funcUrl, _grpId, _hiddenFlg, _funcId, _parentId) {
    const token = getAuthToken();
    const req = {
      funcId: _funcId,
      funcName: _funcName,
      funcUrl: _funcUrl,
      parentId: _parentId,
      sortId: 0,
      grpId: _grpId,
      hiddenFlg: _hiddenFlg,
      token,
    };
    return this.sendRequest(apiELBUrlGetFunctionList, req);
  }
  updateFuncinRole(funcId, funcName, funcUrl, parentId, sortId, grpId, hiddenFlg) {
    const token = getAuthToken();
    const req = {
      funcId,
      funcName,
      funcUrl,
      parentId,
      sortId,
      grpId,
      hiddenFlg,
      token,
    };
    return this.sendRequest(apiELBUrlGetFunctionList, req);
  }
  addExpGrp(_eGrpName) {
    const token = getAuthToken();
    const req = {
      eGrpId: -1,
      eGrpName: _eGrpName,
      token,
    };
    return this.sendRequest(apiELBUrlUpdateExpGrp, req);
  }
  updateExpGrp(_eGrpName, _eGrpId) {
    const token = getAuthToken();
    const req = {
      eGrpId: _eGrpId,
      eGrpName: _eGrpName,
      token,
    };
    return this.sendRequest(apiELBUrlUpdateExpGrp, req);
  }
  deleteExpGrp(_eGrpId) {
    const token = getAuthToken();
    const req = {
      eGrpId: _eGrpId,
      token,
    };
    return this.sendRequestDelete(apiELBUrlUpdateExpGrp, req);
  }
  deleteRole(_roleId) {
    const token = getAuthToken();
    const req = {
      roleId: _roleId,
      token,
    };
    return this.sendRequestDelete(apiELBUrlGetRoleList, req);
  }

  delFunc(_functionId) {
    const token = getAuthToken();
    const req = {
      funcId: _functionId,
      token,
    };
    return this.sendRequestDelete(apiELBUrlGetFunctionList, req);
  }

  getRoboticList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlgetRoboticList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }

  getScriptList() {
    const token = getAuthToken();
    const urlToken = apiELBUrlgetScriptList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }

  uploadRAScript(_myfile, _name, _desc, _version) {
    const token = getAuthToken();
    const data = new FormData();
    data.append('myFile', _myfile);
    data.append('id', -1);
    data.append('name', _name);
    data.append('desc', _desc);
    data.append('version', _version);
    data.append('token', token);
    return this.sendFormReq(apiELBUrlgetScriptList, data);
  }

  deleteRAScript(id) {
    const token = getAuthToken();
    const req = {
      id,
      token,
    };
    return this.sendRequestDelete(apiELBUrlgetScriptList, req);
  }

  editRAScript(_id, _myfile, _name, _desc, _version) {
    const token = getAuthToken();
    const data = new FormData();
    data.append('id', _id);
    data.append('myFile', _myfile);
    data.append('name', _name);
    data.append('desc', _desc);
    data.append('version', _version);
    data.append('token', token);
    return this.sendFormReq(apiELBUrlgetScriptList, data);
  }

  updateRAScript(RAId, scriptId) {
    const token = getAuthToken();
    const req = {
      d: RAId,
      roboticFw: scriptId,
      token,
    };
    return this.sendRequest(apiELBUrlUpdateRAScript, req);
  }

  addCp(textCpName) {
    const token = getAuthToken();
    const req = {
      cpId: -1,
      cpName: textCpName,
      token,
    };
    return this.sendRequest(apiELBUrlGetCpList, req);
  }

  deleteCp(cpId) {
    const token = getAuthToken();
    const req = {
      cpId,
      token,
    };
    return this.sendRequestDelete(apiELBUrlGetCpList, req);
  }

  editCp(cpId, textCpName) {
    const token = getAuthToken();
    const req = {
      cpId,
      cpName: textCpName,
      token,
    };
    return this.sendRequest(apiELBUrlGetCpList, req);
  }

  searchCpList(data) {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetCpList
      .concat('?token=')
      .concat(token)
      .concat('&search=')
      .concat(data);
    return this.sendRequestGet(urlToken);
  }

  getSysList() {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlgetSysList.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }
  addSys(textSysName, textSysDesc, textSysValue, textSysType) {
    const token = getAuthToken();
    const req = {
      sysId: '-1',
      name: textSysName,
      value: textSysValue,
      desc: textSysDesc,
      type: textSysType,
      token,
    };
    return this.sendRequest(apiELBUrlgetSysList, req);
  }
  editSys(textSysName, textSysDesc, textSysValue, textSysType) {
    const token = getAuthToken();
    const req = {
      sysId: '0',
      name: textSysName,
      value: textSysValue,
      desc: textSysDesc,
      type: textSysType,
      token,
    };
    return this.sendRequest(apiELBUrlgetSysList, req);
  }
  deleteSys(textSysName) {
    const token = getAuthToken();
    const req = {
      name: textSysName,
      token,
    };
    return this.sendRequestDelete(apiELBUrlgetSysList, req);
  }
  searchSysList(data) {
    const token = getAuthToken();
    const urlToken = apiELBUrlgetSysList
      .concat('?token=')
      .concat(token)
      .concat('&search=')
      .concat(data);
    return this.sendRequestGet(urlToken);
  }
  addGrp(textGrpName) {
    const token = getAuthToken();
    const req = {
      grpId: '-1',
      name: textGrpName,
      token,
    };
    return this.sendRequest(apiELBUrlGrpList, req);
  }
  editGrp(textGrpName, grpId) {
    const token = getAuthToken();
    const req = {
      grpId,
      name: textGrpName,
      token,
    };
    return this.sendRequest(apiELBUrlGrpList, req);
  }
  deleteGrp(grpId) {
    const token = getAuthToken();
    const req = {
      grpId,
      token,
    };
    return this.sendRequestDelete(apiELBUrlGrpList, req);
  }
  searchGrpList(data) {
    const token = encodeURIComponent(getAuthToken());
    const urlToken = apiELBUrlGrpList
      .concat('?token=')
      .concat(token)
      .concat('&search=')
      .concat(data);
    return this.sendRequestGet(urlToken);
  }
  updateGrpbyCp(cpId, grpsArr) {
    // apiELBUrlUpdateGrpListbyCp
    const token = getAuthToken();
    const req = {
      type: 'GCp',
      catId: cpId,
      grps: grpsArr,
      token,
    };
    return this.sendRequest(apiELBUrlUpdateGrpListbyCp, req);
  }
  updateGrpbyCpEdit(cpId, grpsArr, grpId) {
    const token = getAuthToken();
    const req = {
      type: 'GCp',
      catId: cpId,
      grps: grpId,
      token,
    };
    return this.sendRequest(apiELBUrlUpdateGrpListbyCp, req);
  }

  getExecHistory(_deviceType, _deviceId, _eventType, _qTime, _limit, _skip) {
    const token = getAuthToken();
    const urlToken = apiGetEventList
      .replace('{deviceType}', _deviceType)
      .replace('{deviceId}', _deviceId)
      .replace('{eventType}', _eventType)
      .replace('{token}', token)
      .replace('{qTime}', _qTime)
      .replace('{limit}', _limit)
      .replace('{skip}', _skip);
    return this.sendRequestGet(urlToken);
  }

  // Dashboard
  getLayout() {
    const token = getAuthToken();
    const urlToken = apiGetLayout.concat('?token=').concat(encodeURIComponent(token));
    return this.sendRequestGet(urlToken);
  }

  getPlanList() {
    const token = getAuthToken();
    const urlToken = apiPlan.concat('?token=').concat(encodeURIComponent(token));
    return this.sendRequestGet(urlToken);
  }

  uploadPlan(file, id, planName, planDesc, planVers, planVeri) {
    const token = getAuthToken();
    return this.sendFormRequest(apiPlan, file, id, planName, planDesc, planVers, planVeri, token);
  }

  // uploadFw(_myfile, _id, _name, _desc, _version, _verfier) {
  //   const token = getAuthToken();
  //   return this.sendFormRequest(apiELBUrlUploadFw, _myfile, _id, _name, _desc, _version, _verfier, token);
  // }

  delPlanList() {
    const token = getAuthToken();
    const urlToken = apiPlan.concat('?token=').concat(token);
    return this.sendRequestGet(urlToken);
  }

  // event page
  getSensorListE() {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetSensorListE.concat('?token=').concat(encodeURIComponent(token));
    return this.sendRequestGet(urlToken);
  }
  getEventList(data) {
    const token = getAuthToken();
    let urlToken = apiELBUrlGetEventList.concat('?token=', encodeURIComponent(token));
    if ('fport' in data) {
      if (data.fport !== undefined) {
        urlToken = urlToken.concat('&fport=', data.fport);
      }
    }
    if ('macAddr' in data) {
      if (data.macAddr !== undefined) {
        urlToken = urlToken.concat('&macAddr=', data.macAddr);
      }
    }
    if ('limit' in data) {
      if (data.limit !== undefined) {
        urlToken = urlToken.concat('&limit=', data.limit);
      }
    }
    if ('pagi' in data) {
      if (data.pagi !== undefined) {
        urlToken = urlToken.concat('&page=', data.pagi);
      }
    }
    if ('date' in data) {
      urlToken = urlToken.concat('&from=', encodeURIComponent(data.date[0]), '&to=', encodeURIComponent(data.date[1]));
    }
    if ('fileName' in data) {
      urlToken = urlToken.concat('&showType=xls&fileName=', data.fileName);
    }
    if ('search' in data) {
      if (data.search !== undefined) {
        urlToken = urlToken.concat('&search=', encodeURIComponent(getTripleDES(data.search)));
      }
    }
    return this.sendRequestGet(urlToken);
  }

  getReportList(data) {
    const token = getAuthToken();
    let urlToken = apiRpt.concat('?token=', encodeURIComponent(token));
    if ('fport' in data) {
      if (data.fport !== undefined) {
        urlToken = urlToken.concat('&fport=', data.fport);
      }
    }
    if ('macAddr' in data) {
      if (data.macAddr !== undefined) {
        urlToken = urlToken.concat('&macAddr=', data.macAddr);
      }
    }
    if ('date' in data) {
      urlToken = urlToken.concat('&from=', encodeURIComponent(data.date[0]), '&to=', encodeURIComponent(data.date[1]));
    }
    if ('fileName' in data) {
      urlToken = urlToken.concat('&showType=xls&fileName=', data.fileName);
    }
    return this.sendRequestGetSave(urlToken, data.fileName);
  }

  getReportCnt(data) {
    const token = getAuthToken();
    let urlToken = apiRptChk.concat('?token=', encodeURIComponent(token));
    if ('fport' in data) {
      if (data.fport !== undefined) {
        urlToken = urlToken.concat('&fport=', data.fport);
      }
    }
    if ('macAddr' in data) {
      if (data.macAddr !== undefined) {
        urlToken = urlToken.concat('&macAddr=', data.macAddr);
      }
    }
    if ('date' in data) {
      urlToken = urlToken.concat('&from=', encodeURIComponent(data.date[0]), '&to=', encodeURIComponent(data.date[1]));
    }
    return this.sendRequestGet(urlToken);
  }

  getEventListByMac(mac) {
    const token = getAuthToken();
    const urlToken = apiELBUrlGetEventListE
      .concat('?token=')
      .concat(encodeURIComponent(token))
      .concat('&limit=10')
      .concat('&fport=161')
      .concat('&macAddr=')
      .concat(mac);
    return this.sendRequestGet(urlToken);
  }

  mqttCtl(_message) {
    const token = getAuthToken();
    return this.sendFormMQTTRequest(apiELBUrlMqttCtl, _message, token);
  }

  mqttCtlAir(_message) {
    const token = getAuthToken();
    return this.sendFormMQTTAirRequest(apiELBUrlMqttCtl, _message, token);
  }

  // virtual shelf
  getSteelCntInShelf(tagId) {
    const token = getAuthToken();
    const urlToken = apiTrackCnt
      .replace('{tagId}', tagId)
      .concat('?token=')
      .concat(encodeURIComponent(token));
    return this.sendRequestGet(urlToken);
  }

  getSteelInShelf(tagId, limit, page) {
    const token = getAuthToken();
    let urlToken;
    if (limit === undefined && page === undefined) {
      urlToken = apiTrack
        .replace('{tagId}', tagId)
        .concat('?token=')
        .concat(encodeURIComponent(token));
    } else {
      urlToken = apiTrack
        .replace('{tagId}', tagId)
        .concat('?token=')
        .concat(encodeURIComponent(token))
        .concat('&limit=', limit)
        .concat('&paginate=true')
        .concat('&page=', page);
    }
    return this.sendRequestGet(urlToken);
  }

  getShelfList(limit, page, searchTextTriEn) {
    const token = getAuthToken();
    let urlToken;
    if (limit === undefined && page === undefined) {
      urlToken = apiTag.concat('?token=').concat(encodeURIComponent(token));
    } else if (searchTextTriEn === undefined) {
      urlToken = apiTag
        .concat('?token=')
        .concat(encodeURIComponent(token))
        .concat('&limit=', limit)
        .concat('&paginate=true')
        .concat('&page=', page);
    } else if (searchTextTriEn !== undefined) {
      urlToken = apiTag
        .concat('?token=')
        .concat(encodeURIComponent(token))
        .concat('&limit=', limit)
        .concat('&paginate=true')
        .concat('&page=', page)
        .concat('&search=', searchTextTriEn);
    }
    return this.sendRequestGet(urlToken);
  }

  getSteelList(limit, page, searchTextTriEn) {
    const token = getAuthToken();
    let urlToken;
    if (searchTextTriEn === undefined) {
      urlToken = api1Tag
        .concat('?token=')
        .concat(encodeURIComponent(token))
        .concat('&limit=', limit)
        .concat('&paginate=true')
        .concat('&page=', page);
    } else if (searchTextTriEn !== undefined) {
      urlToken = api1Tag
        .concat('?token=')
        .concat(encodeURIComponent(token))
        .concat('&limit=', limit)
        .concat('&paginate=true')
        .concat('&page=', page)
        .concat('&search=', searchTextTriEn);
    }
    return this.sendRequestGet(urlToken);
  }

  getSteelBeenShelfList(steelId, limit, page) {
    const token = getAuthToken();
    const urlToken = apiSteelBeenShelf
      .replace('{steelId}', steelId)
      .concat('?token=')
      .concat(encodeURIComponent(token))
      .concat('&limit=', limit)
      .concat('&paginate=true')
      .concat('&page=', page);
    return this.sendRequestGet(urlToken);
  }

  getTagCnt(searchTextTriEn) {
    const token = getAuthToken();
    let urlToken;
    if (searchTextTriEn === undefined) {
      urlToken = apiTagCnt.concat('?token=').concat(encodeURIComponent(token));
    } else if (searchTextTriEn !== undefined) {
      urlToken = apiTagCnt
        .concat('?token=')
        .concat(encodeURIComponent(token))
        .concat('&search=')
        .concat(searchTextTriEn);
    }
    return this.sendRequestGet(urlToken);
  }

  getSteelCnt(searchTextTriEn) {
    const token = getAuthToken();
    let urlToken;
    if (searchTextTriEn === undefined) {
      urlToken = apiSteelCnt.concat('?token=').concat(encodeURIComponent(token));
    } else if (searchTextTriEn !== undefined) {
      urlToken = apiSteelCnt
        .concat('?token=')
        .concat(encodeURIComponent(token))
        .concat('&search=')
        .concat(searchTextTriEn);
    }
    return this.sendRequestGet(urlToken);
  }

  getSteelBeenShelfCnt(steelId) {
    const token = getAuthToken();
    const urlToken = apiSteelBeenShelfCnt
      .replace('{steelId}', steelId)
      .concat('?token=')
      .concat(encodeURIComponent(token));
    return this.sendRequestGet(urlToken);
  }

  editShelf(MAC_ID, id, name, MAC_TYPE, MAC_DESC, LOC_DESC, PROC_ID, CHARGE_DEPT, EQUP_NO, STD_WT, SAFE_WT, STD_LOC_WT) {
    const token = getAuthToken();
    const req = {
      MAC_ID,
      id,
      objId: id,
      name,
      MAC_TYPE,
      MAC_DESC,
      LOC_DESC,
      PROC_ID,
      CHARGE_DEPT,
      EQUP_NO,
      STD_WT,
      SAFE_WT,
      STD_LOC_WT,
      token,
    };
    return this.sendRequest(apiTag, req);
  }

  editSteel(name, id, objId) {
    const token = getAuthToken();
    const req = {
      name,
      id,
      objId,
      token,
    };
    return this.sendRequest(api1Tag, req);
  }

  getEventType() {
    const token = getAuthToken();
    const urlToken = apiEventType.concat('?token=').concat(encodeURIComponent(token));
    return this.sendRequestGet(urlToken);
  }

  getSensorByfport(fport) {
    const token = getAuthToken();
    const urlApi = apiELBUrlGetSensorListE
      .concat('?token=')
      .concat(encodeURIComponent(token))
      .concat('&fport=')
      .concat(fport);
    return this.sendRequestGet(urlApi);
  }

  dashboardDL(data) {
    const { fport, message, mac } = data;
    const token = encodeURIComponent(getAuthToken());
    const body = 'token='
      .concat(token)
      .concat('&message=')
      .concat(message)
      .concat('&mac=')
      .concat(mac);
    return this.sendRequestPost(apiDL.concat('/').concat(fport), body);
  }

  dashboardDLPost(data) {
    const token = getAuthToken();
    const { fport, message, mac } = data;
    const req = { token, fport, message, mac };
    return this.sendRequest(apiDL.concat('/', fport), req);
  }

  getDevInfobyMac(data) {
    // const { mac } = data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetDevInfobyMac.concat('/', data, '?token=', token);
    return this.sendRequestGet(urlApi);
  }

  getSearchFilter() {
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetSearchFilter.concat('?token=', token, '&showFlg=', 1);
    return this.sendRequestGet(urlApi);
  }

  getSearchFilterByPersonnel() {
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetSearchFilter.concat('?token=', token, '&showFlg=', 1, '&type=personnel');
    return this.sendRequestGet(urlApi);
  }

  getSearchOptionWithRoot(data) {
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetSearchOption.concat(
      '/',
      Object.keys(data)[0],
      '?token=',
      token,
      '&fport=',
      Object.values(data)[0].fport,
      '&showFlg=',
      1
    );
    return this.sendRequestGet(urlApi);
  }
  getSearchOptionWithParentVal(data) {
    const { searchField, val, child, fport } = data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetSearchOption.concat('/', searchField, '/', val, '/', child, '?token=', token, '&fport=', fport, '&showFlg=', 1);
    return this.sendRequestGet(urlApi);
  }
  getTrackCount(data) {
    const { type, typeId } = data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetTrackCnt
      .replace('{type}', type)
      .replace('{typeId}', typeId)
      .concat('?token=', token, '&showFlg=', 1);
    return this.sendRequestGet(urlApi);
  }
  getTrack(data) {
    const { type, typeId } = data;
    const token = encodeURIComponent(getAuthToken());
    let urlApi;
    urlApi = apiGetTrack
      .replace('{type}', type)
      .replace('{typeId}', typeId)
      .concat('?token=', token);

    if ('date' in data) {
      urlApi = urlApi.concat('&from=', encodeURIComponent(data.date[0]), '&to=', encodeURIComponent(data.date[1]));
    }
    return this.sendRequestGet(urlApi);
  }
  getTagType() {
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetTagType.concat('?token=', token);
    return this.sendRequestGet(urlApi);
  }
  getTagTypeIn2() {
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetTagType.concat('?token=', token, '&type=2');
    return this.sendRequestGet(urlApi);
  }
  getTagList(data) {
    const { type } = data;
    const token = encodeURIComponent(getAuthToken());
    let urlApi = apiGetTagList.concat('?token=', token).replace('{type}', type);
    if ('id' in data) {
      if (data.id !== undefined) {
        urlApi = urlApi.concat('&search=', encodeURIComponent(getTripleDES(data.id)));
      }
    }
    if ('date' in data) {
      urlApi = urlApi.concat('&from=', encodeURIComponent(data.date[0]), '&to=', encodeURIComponent(data.date[1]));
    }
    if ('page' in data) {
      urlApi = urlApi.concat('&page=', data.page);
    }
    if ('limit' in data) {
      urlApi = urlApi.concat('&paginate=true&limit=', data.limit);
    }
    return this.sendRequestGet(urlApi);
  }
  getTagListAll(data) {
    const { type } = data;
    const token = encodeURIComponent(getAuthToken());
    let urlApi = apiGetTagList.concat('?token=', token).replace('{type}', type);
    if ('id' in data) {
      if (data.id !== undefined) {
        urlApi = urlApi.concat('&search=', encodeURIComponent(getTripleDES(data.id)));
      }
    }
    if ('date' in data) {
      urlApi = urlApi.concat('&from=', encodeURIComponent(data.date[0]), '&to=', encodeURIComponent(data.date[1]));
    }
    return this.sendRequestGet(urlApi);
  }
  getTrackByfilterTag(data) {
    const { searchField, type, id } = data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetTrackByfilterTag
      .concat('?token=', token, '&showFlg=', 1)
      .replace('{searchField}', searchField)
      .replace('{type}', type)
      .replace('{id}', id);
    return this.sendRequestGet(urlApi);
  }
  getTrackByfilterValTag(data) {
    const { searchField, val, child, type, id } = data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetTrackByfilterValTag
      .concat('?token=', token, '&showFlg=', 1, '&sort=desc&extra=NW')
      .replace('{searchField}', searchField)
      .replace('{val}', val)
      .replace('{child}', child)
      .replace('{type}', type)
      .replace('{id}', id);
    return this.sendRequestGet(urlApi);
  }

  updateTagByAdmin(data) {
    const { desc, id, macAddr, name, priority, type } = data;
    const urlApi = apiUpdateTagByAdmin.concat('/', type, '/', id);
    const getToken = getAuthToken();
    const req = { token: getToken, info: { desc, priority }, loc: { macAddr, name } };
    return this.sendRequestPut(urlApi, req);
  }

  insertTagByAdmin(payload) {
    const { macAddr, data, fport } = payload;
    const urlApi = apiInsertTagByAdmin;
    const getToken = getAuthToken();
    const req = { token: getToken, data: [{ macAddr, data, fport }] };
    return this.sendRequest(urlApi, req);
  }

  getGetDevMeta(data) {
    const { fport, meta, val } = data.data;
    const { showFlg } = data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetDevMeta
      .concat('?token=', token, '&showFlg=', showFlg)
      .replace('{fport}', fport)
      .replace('{meta}', meta)
      .replace('{val}', val);
    return this.sendRequestGet(urlApi);
  }

  getTagByMeta(data) {
    const { type, meta, date } = data.data;
    // const { showFlg } = data;
    const token = encodeURIComponent(getAuthToken());
    let urlApi = apiGetTagByMeta
      .concat('?token=', token, '&showFlg=', 1, '&paginate=', false)
      .replace('{type}', type)
      .replace('{meta}', meta);
    if ('date' in data.data) {
      urlApi = urlApi.concat(date);
    }
    return this.sendRequestGet(urlApi);
  }

  getTagByMetaWPage(data) {
    const { type, meta, page } = data.data;
    const { showFlg } = data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiGetTagByMeta
      .concat('?token=', token, '&showFlg=', showFlg, '&paginate=', true, '&page=', page)
      .replace('{type}', type)
      .replace('{meta}', meta);
    return this.sendRequestGet(urlApi);
  }

  getShowField(data) {
    const { fport } = data.data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiShowField.concat('?token=', token).replace('{fport}', fport);
    return this.sendRequestGet(urlApi);
  }

  getZoneShowField(data) {
    const { fport } = data.data;
    const token = encodeURIComponent(getAuthToken());
    const urlApi = apiZoneShowField.concat('?token=', token).replace('{fport}', fport);
    return this.sendRequestGet(urlApi);
  }

  updateMeta(dataMeta) {
    const token = getAuthToken();
    const data = {
      meta: dataMeta,
      token,
    };
    const urlApi = apiUpdateMeta.replace('{macAddr}', dataMeta.macAddr);
    return this.sendRequestPut(urlApi, data);
  }

  addDevByAdmin(data) {
    const token = getAuthToken();
    const req = {
      d: [data],
      token,
    };
    return this.sendRequest(apiDev, req);
  }

  delDevByAdmin(data) {
    const { deviceId } = data;
    const token = getAuthToken();
    const req = {
      token,
    };
    return this.sendRequestDelete(apiDev.concat('/', deviceId), req);
  }

  editDevByAdmin(data) {
    const { deviceId, d } = data;
    const getToken = getAuthToken();
    const urlApi = apiDev.concat('/', deviceId);
    const req = { token: getToken, d };
    return this.sendRequestPut(urlApi, req);
  }
}

const api = new ApiRequest();
export default api;
