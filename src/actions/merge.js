import axios from 'axios';

import {
  MERGE_PATIENTS,
  ABORT_MERGE_PATIENTS
} from './types';

export function mergePatients(source1PatientId, source2PatientId) {
  let source1Bundle = `${FHIR_SERVER}/Patient/${source1PatientId}/$everything`;
  let source2Bundle = `${FHIR_SERVER}/Patient/${source2PatientId}/$everything`;

  let mergePromise = getMerge(source1Bundle, source2Bundle);

  return {
    type: MERGE_PATIENTS,
    payload: mergePromise.then((mergeResult) => {
      if (mergeResult.status === 200) {
        // TODO: merge has no conflicts
        return { mergeComplete: true };
      } else {
        let promises = [
          getPatientData(source1Bundle),
          getPatientData(source2Bundle),
          getPatientData(`${MERGE_SERVER}/merge/${mergeResult.headers.location}/target`)
        ];

        return axios.all(promises).then(axios.spread(function(source1Patient, source2Patient, targetPatient) {
          return {
            merge: mergeResult,
            targetPatient,
            source1Patient,
            source2Patient
          };
        }));
      }
    })
  };
}

export function abortMerge(mergeId) {
  return {
    type: ABORT_MERGE_PATIENTS,
    payload: axios({
      method: 'post',
      url: `${MERGE_SERVER}/merge/${mergeId}/abort`
    })
  };
}

function getMerge(source1, source2) {
  return axios({
    method: 'post',
    url: `${MERGE_SERVER}/merge`,
    params: {
      source1,
      source2
    }
  });
}

function getPatientData(url) {
  return axios({
    method: 'get',
    url
  });
}
