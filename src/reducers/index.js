import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import patientReducer from './patient';
import mergeReducer from './merge';

const rootReducer = combineReducers({
  routing: routerReducer,
  patient: patientReducer,
  merge: mergeReducer
});

export default rootReducer;
