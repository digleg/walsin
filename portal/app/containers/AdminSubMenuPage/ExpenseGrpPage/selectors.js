import { createSelector } from 'reselect';

/**
 * Direct selector to the expenseGrpPage state domain
 */
const selectExpenseGrpPageDomain = state => state.get('expenseGrpPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExpenseGrpPage
 */

const makeSelectExpenseGrpPage = () => createSelector(selectExpenseGrpPageDomain, substate => substate.toJS());
const SelectSetExpGrpList = () => createSelector(selectExpenseGrpPageDomain, substate => substate.get('setExpGrpList'));

export default makeSelectExpenseGrpPage;
export { makeSelectExpenseGrpPage, SelectSetExpGrpList };
