import { makeSelectLoggedIn } from './reducers/Auth/selectors';

export const requireAuth = (store) => (nextState, replace) => {
  const state = store.getState();
  const loggedIn = makeSelectLoggedIn(state);
  if (!loggedIn) {
    replace('/login/');
  }
}
