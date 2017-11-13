import { fromJS } from 'immutable';
import { headerToName, randomName } from 'utils/helpers'
import * as c from './constants';


const initialState = fromJS({
  activeNote: {},
  secondaryNote: {},
  createdNote: {},
});

export function DocViewReducer(state = initialState, action) {
  switch (action.type) {
    case c.PUT_ACTIVE_NOTE:
      return state.set('activeNote', action.payload);

    case c.RESET:
      return initialState;

    case c.SAVE_NOTE:
      let payload = fromJS(action.payload);
      if (payload.get("header")) {
        payload = payload.set("name", headerToName(payload.get("header")));
      } else {
        payload = payload.set("name", randomName());
      }
      return state.set('createdNote', payload);

    case c.UPDATE_ACTIVE_NOTE_CONTENT:
      return state.setIn(['activeNote', 'content'], action.payload);

    case c.UPDATE_ACTIVE_NOTE_HEADER:
      let noteName;
      if (action.payload) {
        noteName = headerToName(action.payload)
      } else if (state.get("activeNote").get("header")){
        noteName = randomName()
      } else {
        noteName = state.get("activeNote").get("name");
      }
      return state.setIn(['activeNote', 'header'], action.payload)
                  .setIn(['activeNote', 'name'], noteName);

    default:
      return state;
  }
}

export default DocViewReducer;
