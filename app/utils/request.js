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

const toImmutable = (data) => fromJS(data);
