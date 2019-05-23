import CryptoJS from 'crypto-js';

export function getTripleDES(data) {
  const pw = 'gemtek';
  const encrypted = CryptoJS.TripleDES.encrypt(data, pw);
  return encrypted.toString();
}
