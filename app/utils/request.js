import 'whatwg-fetch';
import { fromJS } from 'immutable';


function parseJSON(response) {
  const res = response.json();
  if (res) {
    return res;
  }

  const error = new Error(res.error);
  error.response = res;
  throw error;
}


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}


function validData(data) {
  if (data) {
    return data;
  }

  const error = new Error("data is not valid");
  error.response = data;
  throw error;
}


const toImmutable = (data) => fromJS(data);
const takeFirst = (data) => data.get('0');


export function fetchPosts(token) {
  return fetch('/api/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}


export function fetchNote(noteName, token) {
  return fetch(`/api/posts?name=${noteName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable)
    .then(takeFirst)
    .then(validData);
}


export function createNote(note, token) {
  return fetch('/api/posts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify(note.toJS()),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}


export function modifyNote(note, token) {
  return fetch(`/api/posts/${note.get("id")}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify(note.toJS()),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}


export function deleteNote(id, token) {
  return fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}


export function signup(data) {
  return fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.toJS()),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}


export function requestAuth(data) {
  return fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}


export function requestCheckUser(token) {
  return fetch('/api/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}

export function searchNotes(query, token) {
  return fetch('/api/search/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`,
    },
    body: JSON.stringify({ query }),
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(toImmutable);
}
