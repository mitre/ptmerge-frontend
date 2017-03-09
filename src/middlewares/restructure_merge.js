import {
  MERGE_PATIENTS_FULFILLED,
  GET_COMPLETED_MERGES_FULFILLED,
  GET_MERGE_TARGET_BUNDLES_FULFILLED
} from '../actions/types';

import Merge from '../models/merge';
import MergeConflict from '../models/merge_conflict';
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
    } else if (action.type === GET_COMPLETED_MERGES_FULFILLED) {
      let { data } = action.payload;

      if (data.merges == null) {
        action.payload = [];
      } else {
        action.payload = action.payload.data.merges.filter((merge) => merge.completed === true).map((merge) => new Merge(merge));
      }
    } else if (action.type === GET_MERGE_TARGET_BUNDLES_FULFILLED) {
      action.payload = action.payload.map(({ payload, mergeId, type }) => {
        let model;
        if (type === 'Patient') {
          model = new Patient(payload.data);
        } else if (type === 'MergeConflict') {
          model = payload.data.entry.map((mergeConflict) => new MergeConflict(mergeId, mergeConflict.resource));
        }

        return {
          type,
          model,
          mergeId
        };
      });
    }

    return next(action);
  };
}
