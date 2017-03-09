import { FETCH_PATIENT_LIST_FULFILLED } from '../actions/types';

export default function(state = { patientList: [] }, action)  {
  switch (action.type) {
    case FETCH_PATIENT_LIST_FULFILLED:
      return { ...state, patientList: action.payload };
    default:
      return state;
  }
}
