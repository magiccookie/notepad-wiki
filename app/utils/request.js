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

const toImmutable = (data) => fromJS(data);

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

const takeFirst = (data) => data.get('0');

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
    .then(takeFirst);
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
