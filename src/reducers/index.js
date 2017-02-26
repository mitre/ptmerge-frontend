import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import patientReducer from './patient';

const rootReducer = combineReducers({
  routing: routerReducer,
  patient: patientReducer
});

export default rootReducer;
