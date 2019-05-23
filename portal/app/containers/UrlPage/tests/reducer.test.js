
import { fromJS } from 'immutable';
import urlPageReducer from '../reducer';

describe('urlPageReducer', () => {
  it('returns the initial state', () => {
    expect(urlPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
