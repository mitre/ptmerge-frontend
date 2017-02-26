// Restructures the response of the patient endpoint
import moment from 'moment';

import { FETCH_PATIENT_LIST_FULFILLED, FETCH_PATIENT_FULFILLED } from '../actions/types';

function restructurePatient(patientData) {
  let patient;
  let conditions = [];
  let encounters = [];
  let medications = [];

  patientData.forEach((item) => {
    let resource = item.resource.resourceType;

    if (resource === 'Patient') {
      patient = item.resource;
    } else if (resource === 'Condition') {
      conditions.push({
        id: item.resource.id,
        text: item.resource.code.text,
        code: item.resource.code.coding[0].code,
        codeSystem: item.resource.code.coding[0].system,
        verificationStatus: item.resource.verificationStatus,
        onsetDateTime: item.resource.onsetDateTime,
        abatementDateTime: item.resource.abatementDateTime
      });
    } else if (resource === 'Encounter') {
      encounters.push({
        id: item.resource.id,
        text: item.resource.type[0].text,
        code: item.resource.type[0].coding[0].code,
        codeSystem: item.resource.type[0].coding[0].system,
        periodStart: item.resource.period.start,
        periodEnd: item.resource.period.end
      });
    } else if (resource === 'MedicationStatement') {
      medications.push({
        id: item.resource.id,
        text: item.resource.medicationCodeableConcept.text,
        code: item.resource.medicationCodeableConcept.coding[0].code,
        codeSystem: item.resource.medicationCodeableConcept.coding[0].system,
        status: item.resource.status,
        periodStart: item.resource.effectivePeriod.start,
        periodEnd: item.resource.effectivePeriod.end
      });
    }
  });

  return {
    id: patient.id,
    data: {
      allergy: {},
      behavior: {},
      condition: conditions,
      demographics: {
        address: {
          street: patient.address[0]                                                                                    .line[0],
          city: patient.address[0].city,
          state: patient.address[0].state,
          postalCode: patient.address[0].postalCode
        },
        age: moment().diff(moment(patient.birthDate), 'years'),
        dateOfBirth: patient.birthDate,
        gender: patient.gender,
        healthInsurance: null,
        humanName: {
          prefix: null,
          familyName: patient.name[0].family[0],
          givenName: patient.name[0].given[0],
          suffix: null
        },
        maritalStatus: null,
        placeOfBirth: null,
        socialSecurityNumber: null
      },
      encounter: encounters,
      familyHistory: null,
      immunization: null,
      lab: null,
      lifeHistory: null,
      medication: medications,
      vital: null
    }
  };
}

function restructurePatientList(patients) {
  return patients.map(({ resource }) => {
    return {
      id: resource.id,
      name: `${resource.name[0].family[0]}, ${resource.name[0].given[0]}`
    };
  });
}

export default function () {
  return next => action => {
    if (action.type === FETCH_PATIENT_FULFILLED && action.payload) {
      let { payload } = action;
      action.payload = restructurePatient(payload.data.entry);
      action.position = payload.position;
    } else if (action.type === FETCH_PATIENT_LIST_FULFILLED && action.payload) {
      action.payload = restructurePatientList(action.payload.data.entry);
    }

    return next(action);
  };
}
