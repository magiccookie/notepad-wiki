import { createSelector } from 'reselect';

const selectLoginFormDomain = () => (state) => state.get('loginForm');

const makeSelectLoginForm = () => createSelector(
  selectLoginFormDomain(),
  (substate) => substate.toJS()
);

export default makeSelectLoginForm;
export {
  selectLoginFormDomain,
};
