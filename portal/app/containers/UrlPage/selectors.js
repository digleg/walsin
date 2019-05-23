import { createSelector } from 'reselect';

/**
 * Direct selector to the urlPage state domain
 */
const selectUrlPageDomain = state => state.get('urlPage');

/**
 * Other specific selectors
 */

/**
 * Default selector used by UrlPage
 */

const makeSelectUrlPage = () =>
  createSelector(
    selectUrlPageDomain,
    substate => substate.toJS()
  );

const SelectUrl = () =>
  createSelector(
    selectUrlPageDomain,
    substate => substate.get('url')
  );

// url;

export default makeSelectUrlPage;
export { makeSelectUrlPage, SelectUrl };
