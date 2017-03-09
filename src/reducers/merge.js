import {
  MERGE_PATIENTS_FULFILLED,
  ABORT_MERGE_PATIENTS_FULFILLED,
  RESET_MERGE_PATIENTS,
  GET_COMPLETED_MERGES_FULFILLED,
  GET_MERGE_TARGET_BUNDLES_FULFILLED
} from '../actions/types';

export default function(state = { patientMerger: null, completedMerges: null }, action) {
  if (action.type === MERGE_PATIENTS_FULFILLED) {
    return { ...state, patientMerger: action.payload };
  } else if (action.type === ABORT_MERGE_PATIENTS_FULFILLED || action.type === RESET_MERGE_PATIENTS) {
    return { ...state, patientMerger: null };
  } else if (action.type === GET_COMPLETED_MERGES_FULFILLED) {
    return { ...state, completedMerges: action.payload };
  } else if (action.type === GET_MERGE_TARGET_BUNDLES_FULFILLED) {
    for (let i = 0; i < action.payload.length; ++i) {
      let { type, model, mergeId } = action.payload[i];
      let merge = state.completedMerges.find((merge) => merge.getId() === mergeId);

      if (type === 'Patient') {
        merge.setPatient(model);
      } else if (type === 'MergeConflict') {
        merge.addMergeConflicts(model);
      }
    }
  }

  return state;
}
