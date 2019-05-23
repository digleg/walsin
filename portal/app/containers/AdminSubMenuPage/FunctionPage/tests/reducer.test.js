
import { fromJS } from 'immutable';
import functionPageReducer from '../reducer';

describe('functionPageReducer', () => {
  it('returns the initial state', () => {
    expect(functionPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
