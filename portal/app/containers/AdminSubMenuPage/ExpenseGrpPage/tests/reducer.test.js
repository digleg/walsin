
import { fromJS } from 'immutable';
import expenseGrpPageReducer from '../reducer';

describe('expenseGrpPageReducer', () => {
  it('returns the initial state', () => {
    expect(expenseGrpPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
