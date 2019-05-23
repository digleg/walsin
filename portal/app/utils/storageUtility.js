export function getFormState() {
  return JSON.parse(localStorage.getItem('formState'));
}

export function setFormState(formState) {
  localStorage.setItem('formState', JSON.stringify(formState));
}

export function getLocaleSetting() {
  return JSON.parse(localStorage.getItem('locale'));
}

export function setLocaleSetting(formState) {
  localStorage.setItem('locale', JSON.stringify(formState));
}

export function getLoginStatus() {
  return JSON.parse(localStorage.getItem('loginStatus'));
}

export function setLoginStatus(formState) {
  localStorage.setItem('loginStatus', JSON.stringify(formState));
}

export function removeLoginStatus() {
  sessionStorage.removeItem('loginStatus');
}

export function getElectData() {
  return JSON.parse(localStorage.getItem('electData'));
}

export function setElectData(electData) {
  localStorage.setItem('electData', JSON.stringify(electData));
}

export function getElectDataTmp() {
  return JSON.parse(localStorage.getItem('electDataTmp'));
}

export function setElectDataTmp(electDataTmp) {
  localStorage.setItem('electDataTmp', JSON.stringify(electDataTmp));
}

export function removeElectDataTmp() {
  sessionStorage.removeItem('electDataTmp');
}

export function getWaterData() {
  return JSON.parse(localStorage.getItem('waterData'));
}

export function setWaterData(waterData) {
  localStorage.setItem('waterData', JSON.stringify(waterData));
}

export function getAuthToken() {
  return JSON.parse(sessionStorage.getItem('auth'));
}

export function setAuthToken(token) {
  sessionStorage.setItem('auth', JSON.stringify(token));
}

export function getIPort() {
  return JSON.parse(sessionStorage.getItem('IPort'));
}

export function setIPort(token) {
  sessionStorage.setItem('IPort', JSON.stringify(token));
}

export function removeAuthToken() {
  sessionStorage.removeItem('auth');
}

export function getRole() {
  return JSON.parse(sessionStorage.getItem('role'));
}

export function setRole(token) {
  sessionStorage.setItem('role', JSON.stringify(token));
}

export function removeRole() {
  sessionStorage.removeItem('role');
}

export function getSubMenuOpen() {
  return JSON.parse(sessionStorage.getItem('subMenuOpen'));
}

export function setSubMenuOpen(data) {
  sessionStorage.setItem('subMenuOpen', JSON.stringify(data));
}

export function removeSubMenuOpen() {
  sessionStorage.removeItem('subMenuOpen');
}

export function setUsername(data) {
  sessionStorage.setItem('username', JSON.stringify(data));
}

export function getUsername() {
  return JSON.parse(sessionStorage.getItem('username'));
}

export function removeUsername() {
  sessionStorage.removeItem('username');
}

export function setPassword(data) {
  sessionStorage.setItem('password', JSON.stringify(data));
}

export function getPassword() {
  return JSON.parse(sessionStorage.getItem('password'));
}

export function removePassword() {
  sessionStorage.removeItem('password');
}
