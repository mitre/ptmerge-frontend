import moment from 'moment';

import Condition from './condition';
import Encounter from './encounter';
import Medication from './medication';
import Procedure from './procedure';

const STRIP_FIELDS = Object.freeze([
  "id"
]);

export default class Patient {
  constructor(bundle) {
    this._bundle = bundle;

    // set patient data
    let patient = findResource(bundle, 'Patient');

    this.id = patient.id;
    this.lastUpdated = moment(patient.meta.lastUpdated);

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

  getId() {
    return this.id;
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
