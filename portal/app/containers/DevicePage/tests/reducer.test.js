
import { fromJS } from 'immutable';
import devicePageReducer from '../reducer';

describe('devicePageReducer', () => {
  it('returns the initial state', () => {
    expect(devicePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
