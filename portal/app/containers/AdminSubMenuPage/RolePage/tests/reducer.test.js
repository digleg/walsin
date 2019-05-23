
import { fromJS } from 'immutable';
import rolePageReducer from '../reducer';

describe('rolePageReducer', () => {
  it('returns the initial state', () => {
    expect(rolePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
