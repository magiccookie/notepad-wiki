import { fromJS } from 'immutable';
import { headerToUrl } from 'utils/helpers'
import * as c from './constants';


const initialState = fromJS({
  activeNote: {},
  secondaryNote: {},
});

export function DocViewReducer(state = initialState, action) {
  switch (action.type) {
    case c.PUT_ACTIVE_NOTE:
      return state.set('activeNote', action.payload);
    case c.UPDATE_ACTIVE_NOTE_CONTENT:
      return state.setIn(['activeNote', 'content'], action.payload);
    case c.UPDATE_ACTIVE_NOTE_HEADER:
      let noteName;
      if (action.payload) {
        noteName = headerToUrl(action.payload)
      } else {
         noteName = Math.random().toString(16).substring(2, 8);
      }
      return state.setIn(['activeNote', 'header'], action.payload)
                  .setIn(['activeNote', 'name'], noteName);
    default:
      return state;
  }
}

export default DocViewReducer;
