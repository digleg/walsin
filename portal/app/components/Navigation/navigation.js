// unused
global.navigations = [
  ['Login', '/', ''],
  ['Dashboard', '/dashboard', ''],
  // ['Apply Developer', '/dev/apply', 'navApplyDev'],
  // ['Application', '/applicationn/createApp', 'navApp'],
  // ['Develope Agent', '/agent/createAgent', 'navAgent'],
];

const navApplyDev = [['Apply Developer', '/dev/apply'], ['Operator Management', '/dev/operatorMgr']];

const navApp = [['Create Application', '/application/createApp'], ['Application Management', '/application/appMgr']];

const navAgent = [
  ['Create Agent', '/agent/createAgent'],
  ['Agent Management', '/agent/agentMgr'],
  // ['Broadcast', '/agent/broadcast'],
];

global.menus = [['Apply', navApplyDev], ['Application', navApp], ['Agent', navAgent]];

// global.menuItems = [
//   ['Apply Developer', '/dev/apply'],
//   ['Operator Management', '/dev/operatorMgr'],
//   ['Create Application', '/application/createApp'],
//   ['Application Management', '/application/appMgr'],
//   ['Create Agent', '/agent/createAgent'],
//   ['Agent Management', '/agent/agentMgr'],
//   // ['Broadcast', '/agent/broadcast'],
// ];

const menuItems = [
  ['DASHBOARD', '/dashboard'],
  ['TEMPERATURE', '/TemperaturePage'],
  ['HUMIDITY', '/HumidityPage'],
  ['ELECTRICITY EXPENSE', '/ElectricityPage'],
  ['WATER EXPENSE', '/WaterPage'],
];

export default menuItems;

export function getNavigation(url) {
  let pathShow1st = '';
  let pathShowNav = '';
  let pathShow2nd = '';
  // eslint-disable-next-line
  for (let i = 1; i < navigations.length; i++) {
    // eslint-disable-next-line
    if (navigations[i][1].indexOf(url.split('/')[1]) !== -1) {
      // eslint-disable-next-line
      pathShow1st = navigations[i][0];
      // eslint-disable-next-line
      pathShowNav = navigations[i][2];
      break;
    }
  }

  /* eslint no-eval: 0 */
  // eslint-disable-next-line
  for (let i = 0; i < eval(pathShowNav).length; i++) {
    if (url.indexOf(eval(pathShowNav)[i][1]) !== -1) {
      pathShow2nd = eval(pathShowNav)[i][0];
      break;
    }
  }

  const value = [pathShow1st, pathShow2nd];
  return value;
}
