
import { fromJS } from 'immutable';
import adminGrpPageReducer from '../reducer';

describe('adminGrpPageReducer', () => {
  it('returns the initial state', () => {
    expect(adminGrpPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
