/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import { authReducer } from 'reducers/Auth/reducer';
import languageProviderReducer from 'containers/LanguageProvider/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  locationBeforeTransitions: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */

import { LOG_OUT } from 'reducers/Auth/constants';

const appReducer = (asyncReducers) => combineReducers({
  route: routeReducer,
  language: languageProviderReducer,
  auth: authReducer,
  ...asyncReducers,
});

const rootReducer = (asyncReducers) => (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined
  }

  return appReducer(asyncReducers)(state, action);
}

export default function createReducer(asyncReducers) {
  return rootReducer(asyncReducers);
}
