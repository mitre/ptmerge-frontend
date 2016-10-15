import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import DevTools from '../containers/DevTools';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let middleware = applyMiddleware(
    promiseMiddleware(),
    createLogger()
  );

  let enhancer = compose(middleware, DevTools.instrument());
  let store = createStore(rootReducer, initialState, enhancer);

  return store;
}
