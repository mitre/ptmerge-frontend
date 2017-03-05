import { createStore, applyMiddleware, compose } from 'redux';
import DevTools from '../containers/DevTools';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import promiseMiddleware from 'redux-promise-middleware';

import restructurePatientsMiddleware from '../middlewares/restructure_patients';
import restructureMergeMiddleware from '../middlewares/restructure_merge';

export default function configureStore(initialState) {
  let middleware = applyMiddleware(
    promiseMiddleware(),
    createLogger(),
    restructurePatientsMiddleware,
    restructureMergeMiddleware
  );

  return createStore(
    rootReducer,
    initialState,
    compose(middleware, DevTools.instrument())
  );
}
