import moment from 'moment';

import FhirModel from './fhir_model';

import Condition from './condition';
import Encounter from './encounter';
import Medication from './medication';
import Procedure from './procedure';

const STRIP_FIELDS = Object.freeze([ "id" ]);

export const addressMergeKeys = Object.freeze({
  'City': 'address.[0].city',
  'Line1': 'address.[0].line.[0]',
  'Line2': 'address.[0].line.[1]',
  'State': 'address.[0].state',
  'Use': 'address.[0].use'
});

export const nameMergeKeys = Object.freeze({
  'Family': 'name.[0].family',
  'Given': 'name.[0].given.[0]'
});

export const maritalStatusMergeKeys = Object.freeze({
  'Code': 'maritalStatus.coding.[0].code',
  'Display': 'maritalStatus.coding.[0].display',
  'System': 'maritalStatus.coding.[0].system'
});

export const metaMergeKeys = Object.freeze({ 'Last Updated': 'meta.lastUpdated' });
export const dateOfBirthMergeKeys = Object.freeze({ 'Date of Birth': 'birthDate' });
export const genderMergeKeys = Object.freeze({ 'Gender': 'gender' });

export const telecomMergeKeys = Object.freeze({
  'System': 'telecom.[0].system',
  'Number': 'telecom.[0].value',
  'Use': 'telecom.[0].value'
});

export default class Patient extends FhirModel {
  constructor(bundle) {
    let patient = findResource(bundle, 'Patient');

    super(patient);

    this._fullBundle = bundle;

    // set patient data
    let [name] = patient.name;
    this.name = {
      family: name.family,
      given: name.given[0]
    };

    this.gender = patient.gender;
    this.birthDate = patient.birthDate;

    let [address] = patient.address;
    this.address = {
      line1: address.line[0],
      line2: address.line[1],
      city: address.city,
      state: address.state,
      use: address.use
    };

    this.maritalStatus = patient.maritalStatus.coding[0].display;

    // set model relations
    this.conditions = mapResources(bundle, 'Condition', Condition);
    this.encounters = mapResources(bundle, 'Encounter', Encounter);
    this.medications = mapResources(bundle, 'MedicationStatement', Medication);
    this.procedures = mapResources(bundle, 'Procedure', Procedure);
  }

  get modelName() {
    return 'Patient';
  }

  getName() {
    return `${this.name.family}, ${this.name.given}`;
  }

  static stripConflictFields(fields) {
    return fields.filter((field) => STRIP_FIELDS.indexOf(field) === -1);
  }
}

function findResource(bundle, type) {
  let entry = bundle.entry.find((entry) => entry.resource.resourceType === type);
  if (entry) {
    return entry.resource;
  }
}

function mapResources(bundle, type, klass) {
  let resources = [];

  for (let i = 0; i < bundle.entry.length; ++i) {
    let entry = bundle.entry[i];
    if (entry.resource.resourceType === type) {
      resources.push(new klass(entry.resource));
    }
  }

  return resources;
}
