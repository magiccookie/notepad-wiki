import { fromJS } from 'immutable';
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
    default:
      return state;
  }
}

export default DocViewReducer;
