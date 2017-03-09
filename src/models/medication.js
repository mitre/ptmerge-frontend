import moment from 'moment';

import FhirModel from './fhir_model';

const STRIP_FIELDS = Object.freeze([
  "id",
  "subject.reference",
  "subject.referenceid"
]);

export const medicationMergeKeys = Object.freeze({
  'Medication': 'medicationCodeableConcept.coding.[0].display',
  'Code': 'medicationCodeableConcept.coding.[0].code',
  'System': 'medicationCodeableConcept.coding.[0].system',
  'Status': 'status',
  'Start Date': 'effectivePeriod.start',
  'End Date': 'effectivePeriod.end',
  'Updated': 'meta.lastUpdated'
});

export default class Medication extends FhirModel {
  constructor(bundle) {
    super(bundle);

    this.status = bundle.status;

    let [coding] = bundle.medicationCodeableConcept.coding;
    this.medication = {
      name: coding.display,
      code: coding.code,
      system: coding.system
    };

    this.effectivePeriod = {
      start: moment(bundle.effectivePeriod.start),
      end: moment(bundle.effectivePeriod.end)
    };
  }

  get modelName() {
    return 'Medication';
  }

  matches(obj) {
    // code + system much match
    if (this.medication.code !== obj.medication.code || this.medication.system !== obj.medication.system) {
      return false;
    }

    return this.effectivePeriod.start.isSame(obj.effectivePeriod.start, 'day');
  }

  static stripConflictFields(fields) {
    return fields.filter((field) => STRIP_FIELDS.indexOf(field) === -1);
  }
}
