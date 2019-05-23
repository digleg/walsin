/*
 *
 * ExpenseGrpPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_EXP_GRP_LIST } from './constants';

const initialState = fromJS({});

function expenseGrpPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_EXP_GRP_LIST:
      return state.set('setExpGrpList', action.data);
    default:
      return state;
  }
}

export default expenseGrpPageReducer;
