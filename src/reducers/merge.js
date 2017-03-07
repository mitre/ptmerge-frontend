import {
  MERGE_PATIENTS_FULFILLED,
  ABORT_MERGE_PATIENTS_FULFILLED
} from '../actions/types';

export default function(state = { patientMerger: null }, action) {
  if (action.type === MERGE_PATIENTS_FULFILLED) {
    return { ...state, patientMerger: action.payload };
  } else if (action.type === ABORT_MERGE_PATIENTS_FULFILLED) {
    return { ...state, patientMerger: null };
  }

  return state;
}
