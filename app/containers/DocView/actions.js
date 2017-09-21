import * as c from './constants';

export function updateActiveNoteHeader(header) {
  return { type: c.UPDATE_ACTIVE_NOTE_HEADER, payload: header };
}

export function updateActiveNoteContent(content) {
  return { type: c.UPDATE_ACTIVE_NOTE_CONTENT, payload: content };
}

export function getNoteByName(noteName) {
  return { type: c.GET_NOTE, payload: noteName };
}

export function saveNote(note) {
  return { type: c.SAVE_NOTE, payload: note };
}

export function resetState() {
  return { type: c.RESET };
}

export function fetchSuccess(result) {
  return { type: c.PUT_ACTIVE_NOTE, payload: result };
}

export function fetchError(err) {
  console.log("fetch note error", err);
  return { type: c.FETCH_NOTE_ERROR };
}

export function createSuccess(r) {
  console.log("createSuccess", r);
  return { type: 'REPORT', payload: r };
}

export function createError(err) {
  console.log("createError", err);
  return { type: 'ERROR' };
}

export function modifySuccess(r) {
  console.log("modifySuccess", r);
  return { type: 'REPORT', payload: r };
}

export function modifyError(err) {
  console.log("modifyError", err);
  return { type: 'ERROR' };
}
