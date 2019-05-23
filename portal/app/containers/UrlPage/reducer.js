/*
 *
 * UrlPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, SET_URL } from './constants';

const initialState = fromJS({
  url: '',
});

function urlPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SET_URL:
      return state.set('url', action.data);
    default:
      return state;
  }
}

export default urlPageReducer;
