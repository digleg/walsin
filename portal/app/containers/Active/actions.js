/*
 *
 * Active actions
 *
 */

import { DEFAULT_ACTION, CODE_ACTIVE, ACTIVE_CODE_RESP } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function codeActive(data) {
  return {
    type: CODE_ACTIVE,
    data,
  };
}

export function activeCodeResp(data) {
  return {
    type: ACTIVE_CODE_RESP,
    data,
  };
}
