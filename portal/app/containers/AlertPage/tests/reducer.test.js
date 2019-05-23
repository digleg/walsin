
import { fromJS } from 'immutable';
import alertPageReducer from '../reducer';

describe('alertPageReducer', () => {
  it('returns the initial state', () => {
    expect(alertPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
