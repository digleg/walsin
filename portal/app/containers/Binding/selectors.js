import { createSelector } from 'reselect';

/**
 * Direct selector to the binding state domain
 */
const selectBindingDomain = state => state.get('binding');

/**
 * Other specific selectors
 */

/**
 * Default selector used by Binding
 */

const makeSelectBinding = () => createSelector(selectBindingDomain, substate => substate.toJS());
const SelectBindingCodeResp = () => createSelector(selectBindingDomain, substate => substate.get('bindingCodeResp'));

// bindingCodeResp

export default makeSelectBinding;
export { makeSelectBinding, selectBindingDomain, SelectBindingCodeResp };
