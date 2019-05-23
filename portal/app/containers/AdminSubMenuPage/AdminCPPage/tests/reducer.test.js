
import { fromJS } from 'immutable';
import adminCppageReducer from '../reducer';

describe('adminCppageReducer', () => {
  it('returns the initial state', () => {
    expect(adminCppageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
