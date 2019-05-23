import { setIPort } from './app/utils/storageUtility';

// const siLocal = 'http://10.70.51.54:';
// const siIIoT = 'http://10.21.20.141:';
// const siWalsin = 'http://10.206.3.70:';
// const siLocalHost = 'http://127.0.0.1:';

const si = siLocal;

setIPort(si);

// walsin api
export const apiELBUrlLogin = si.concat('1880/login/gemtek');
// export const apiELBUrlLogout = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/user/v1/logout';
export const apiELBUrlLogout = si.concat('1880/logout');

export const apiELBUrlUpdateLayout = si.concat('1881/db');
export const apiELBUrlGetLayout = si.concat('1881/db');
export const apiELBUrlGetMenuItem = si.concat('1881/menu/');
// dashboard
export const apiGetLayout = si.concat('1881/db');
export const apiPlan = si.concat('1882/plan');
export const apiELBUrlMqttCtl = si.concat('1887/control/v1/mqtt');
export const apiDL = si.concat('1887/dl');
export const apiGetDevInfobyMac = si.concat('1887/sensor/detail');
// sensor and event
export const apiELBUrlGetSensorListE = si.concat('1887/sensor/3');
export const apiELBUrlGetEventListE = si.concat('1886/event');
export const apiELBUrlGetGWListE = si.concat('1887/gw/3');
export const apiELBUrlGetEventList = si.concat('1886/event');
export const apiEventType = si.concat('1886/eventType');
export const apiRpt = si.concat('1889/rpt');
export const apiRptChk = si.concat('1889/chk');

// shelf and steel
export const apiTrackCnt = si.concat('1886/0/{tagId}/trackCnt');
export const apiTrack = si.concat('1886/0/{tagId}/track');
export const apiTag = si.concat('1887/0/tag');
export const api1Tag = si.concat('1887/1/tag');
export const apiSteelBeenShelf = si.concat('1886/1/{steelId}/track');
export const apiTagCnt = si.concat('1887/0/tagCnt');
export const apiSteelCnt = si.concat('1887/1/tagCnt');
export const apiSteelBeenShelfCnt = si.concat('1886/1/{steelId}/trackCnt');

// tagPage
export const apiGetSearchFilter = si.concat('1887/searchField');
export const apiGetSearchOption = si.concat('1887/option');
export const apiGetTrackCnt = si.concat('1886/{type}/{typeId}/trackCnt');
export const apiGetTrack = si.concat('1886/{type}/{typeId}/track');
export const apiGetTagType = si.concat('1887/tagType');
export const apiGetTagList = si.concat('1887/{type}/tag');
export const apiGetTrackByfilterTag = si.concat('1886/{searchField}/{type}/{id}/track');
export const apiGetTrackByfilterValTag = si.concat('1886/{searchField}/{val}/{child}/{type}/{id}/track');
export const apiUpdateTagByAdmin = si.concat('1887/tag');
export const apiGetDevMeta = si.concat('1887/sensor/{fport}/{meta}/{val}');
export const apiGetTagByMeta = si.concat('1886/{type}/{meta}/track');
export const apiShowField = si.concat('1887/showField/{fport}/pline');
export const apiUpdateMeta = si.concat('1887/meta/165/meta/{macAddr}');
// --------- //

// electricity expense
export const apiELBUrlGetSummaryExpenseList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/data/v1/expense';
export const apiELBUrlGetExpensedtl = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/data/v1/expense/dtl';
// admin control
export const apiELBUrlGetUserList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/users';
export const apiELBUrlGetRoleList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/roles';
export const apiELBUrlGetFunctionList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/func';
export const apiELBUrlGetExpGrpList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/egrp';
export const apiELBUrlUpdateUserStatus = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/users';
export const apiELBUrlGetCpList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/cps';
export const apiELBUrlUpdateRole = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/roles';
export const apiELBUrlGrpList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/grp';
export const apiELBUrlUpdateGrpListByRole = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/mapping';
export const apiELBUrlUpdatefunction = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/func';
export const apiELBUrlUpdateExpGrp = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/egrp';

// LoRa
export const apiELBUrlActiveCode = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/active';
export const apiELBUrlBindingCode = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/bind';
export const apiELBUrlPublishGwCmd =
  'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/gw/{org}/{deviceType}/{cmd}';
export const apiELBUrlUploadFw = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/fw';

// event and sensor
export const apiELBUrlGetSummaryList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/gw';
export const apiELBUrlGetGWList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/gw/{status}';
export const apiELBUrlGetSensorList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/sensor/{status}';
export const apiELBUrlGetNodeList =
  'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/gw/{org}/{deviceType}/{deviceId}';
export const apiELBUrlGetFwList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/fw';
export const apiELBUrlGetHistoryList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/history/{org}';
export const apiELBUrlGetHistoryDtlList =
  'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/history/{org}/{reqId}';

export const apiELBUrlDelHistory = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/history/{org}/{reqId}';
export const apiELBUrlgetRoboticList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/robotic/3';
export const apiELBUrlgetScriptList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/roboticFw';
export const apiELBUrlUpdateRAScript = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/device/v1/robotic';

// Admin-System
export const apiELBUrlgetSysList = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/sys';

// Admin-CP
export const apiELBUrlUpdateGrpListbyCp = 'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/admin/v1/mapping';

// Robotic Arm
export const apiGetEventList =
  'https://api.us.apiconnect.ibmcloud.com/ctosw5-cloud3/sb/data/v1/event/{deviceType}/{deviceId}/{eventType}/{qTime}?token={token}&limit={limit}&skip={skip}';
