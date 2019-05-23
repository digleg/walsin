
import { fromJS } from 'immutable';
import roboticPageReducer from '../reducer';

describe('roboticPageReducer', () => {
  it('returns the initial state', () => {
    expect(roboticPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
