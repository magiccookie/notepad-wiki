import { createSelector } from 'reselect';

const selectDocView = (state) => state.get('docview');

export const selectActiveNote = createSelector(
  selectDocView,
  (docview) => docview.get('activeNote')
);

export const selectSecondaryNote = createSelector(
  selectDocView,
  (docview) => docview.get('secondaryNote')
);
