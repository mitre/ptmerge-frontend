// Restructures the response of the patient endpoint
import moment from 'moment';

import { FETCH_PATIENT_LIST_FULFILLED } from '../actions/types';

function restructurePatientList(patients) {
  return patients.map(({ resource }) => {
    return {
      id: resource.id,
      name: `${resource.name[0].family}, ${resource.name[0].given[0]} (${resource.id})`
    };
  });
}

export default function () {
  return next => action => {
    if (action.type === FETCH_PATIENT_LIST_FULFILLED && action.payload) {
      action.payload = restructurePatientList(action.payload.data.entry);
    }

    return next(action);
  };
}
