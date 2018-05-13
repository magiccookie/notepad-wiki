import { createSelector } from 'reselect';

const selectSearchState = (state) => state.get('search');

export const makeSelectSearchResults = createSelector(
  selectSearchState,
  (search) => search.get('results')
);
