
import { fromJS } from 'immutable';
import tagPageReducer from '../reducer';

describe('tagPageReducer', () => {
  it('returns the initial state', () => {
    expect(tagPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
