import * as c from './constants';

export function updateActiveNoteContent(content) {
  return { type: c.UPDATE_ACTIVE_NOTE_CONTENT, payload: content };
}

export function getNoteByName(noteName) {
  return { type: c.GET_NOTE, payload: noteName };
}

export function fetchSuccess(result) {
  return { type: c.PUT_ACTIVE_NOTE, payload: result };
}

export function fetchError(err) {
  console.log("fetch note error", err);
  return { type: 'ERROR' };
}
