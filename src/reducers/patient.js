import {
  FETCH_PATIENT_FULFILLED,
  FETCH_PATIENT_LIST_FULFILLED
} from '../actions/types';

export default function(state = { patientList: [],
                                  source1PatientData: null,
                                  source2PatientData: null }, action)  {

  switch (action.type) {
    case FETCH_PATIENT_FULFILLED:
      if (action.position === 'source1Patient') {
        return { ...state, source1PatientData: action.payload };
      } else if (action.position === 'source2Patient') {
        return { ...state, source2PatientData: action.payload };
      }
      return { ...state };
    case FETCH_PATIENT_LIST_FULFILLED:
      return { ...state, patientList: action.payload };
    default:
      return state;
  }
}
