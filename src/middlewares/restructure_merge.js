import { MERGE_PATIENTS_FULFILLED } from '../actions/types';

import Patient from '../models/patient';
import PatientMerger from '../models/patient_merger';

export default function () {
  return next => action => {
    if (action.type === MERGE_PATIENTS_FULFILLED && action.payload) {
      let { payload } = action;

      if (payload.mergeComplete) {
        // TODO: merge has no conflicts
        alert('Merge completed successfully!');
        return next(action);
      }

      let { merge, source1Patient, source2Patient, targetPatient } = payload;

      action.payload = new PatientMerger(
        merge.headers.location,
        new Patient(source1Patient.data),
        new Patient(source2Patient.data),
        new Patient(targetPatient.data),
        merge.data
      );
    }

    return next(action);
  };
}
