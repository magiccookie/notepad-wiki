export const requireAuth = (store) => (nextState, replace) => {
  const token = localStorage.getItem('jwt-token');
  if (!token) {
    replace('/login/');
  }
}
