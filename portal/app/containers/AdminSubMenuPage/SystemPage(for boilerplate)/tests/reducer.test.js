
import { fromJS } from 'immutable';
import systemPageReducer from '../reducer';

describe('systemPageReducer', () => {
  it('returns the initial state', () => {
    expect(systemPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
