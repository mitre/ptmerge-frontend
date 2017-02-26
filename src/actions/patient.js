import axios from 'axios';

import {
  FETCH_PATIENT,
  FETCH_PATIENT_LIST
} from './types';

export function fetchPatient(id, position) {
  let PATIENT_URL = `${FHIR_SERVER}/Patient?_id=${id}&_revinclude=Encounter:patient&_revinclude=MedicationStatement:patient&_revinclude=Condition:patient`;

  return {
    type: FETCH_PATIENT,
    payload: axios.get(PATIENT_URL).then((payload) => {
      return { ...payload, position };
    })
  };
}

export function fetchPatientList() {
  return {
    type: FETCH_PATIENT_LIST,
    payload: axios.get(`${FHIR_SERVER}/Patient`)
  };
}
