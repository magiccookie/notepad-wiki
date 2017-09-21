import { getAsyncInjectors } from 'utils/asyncInjectors';
import { requireAuth } from './requireAuth';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  const childRoutes = [
    {
      path: '/',
      name: 'userhome',
      onEnter: requireAuth(store),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UserHome/reducer'),
          import('containers/UserHome/sagas'),
          import('containers/UserHome'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('posts', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/login',
      name: 'loginForm',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/LoginForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/signup',
      name: 'signUpForm',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/SignUpForm/reducer'),
          import('containers/SignUpForm/sagas'),
          import('containers/SignUpForm'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('signup', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/note/:note',
      name: 'docview',
      onEnter: requireAuth(store),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DocView/reducer'),
          import('containers/DocView/sagas'),
          import('containers/DocView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('docview', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/create/',
      name: 'create',
      onEnter: requireAuth(store),
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DocView/reducer'),
          import('containers/DocView/sagas'),
          import('containers/DocView'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('docview', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];

  return {
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('reducers/Auth/sagas'),
        import('containers/App'),
      ]);

      const renderRoute = loadModule(cb);

      importModules.then(([sagas, component]) => {
        injectSagas(sagas.default);
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
    childRoutes,
  };
}
