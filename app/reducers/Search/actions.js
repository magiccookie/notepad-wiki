import * as c from './constants';

export function search(queryString) {
  return {
    type: c.SEARCH,
    payload: queryString,
  };
}

export function searchSuccess(result) {
  return {
    type: c.SEARCH_SUCCESS,
    payload: result,
  };
}

export function searchError(err) {
  return {
    type: c.SEARCH_ERROR,
    payload: err,
  };
}
