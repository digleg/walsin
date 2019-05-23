/*
 *
 * Binding actions
 *
 */

import { DEFAULT_ACTION, CODE_BINDING, BINDING_CODE_RESP } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function codeBinding(data) {
  return {
    type: CODE_BINDING,
    data,
  };
}

export function bindingCodeResp(data) {
  return {
    type: BINDING_CODE_RESP,
    data,
  };
}
