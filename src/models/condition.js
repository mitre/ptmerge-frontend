import moment from 'moment';

import FhirModel from './fhir_model';

const STRIP_FIELDS = Object.freeze([
  "id",
  "subject.reference",
  "subject.referenceid"
]);

export const conditionMergeKeys = Object.freeze({
  'Condition': 'code.coding.[0].display',
  'Code': 'code.coding.[0].code',
  'System': 'code.coding.[0].system',
  'Onset Date': 'onsetDateTime',
  'Updated': 'meta.lastUpdated'
});

export default class Condition extends FhirModel {
  constructor(bundle) {
    super(bundle);

    let [coding] = bundle.code.coding;
    this.condition = {
      name: coding.display,
      code: coding.code,
      system: coding.system
    };
    this.onsetDate = moment(bundle.onsetDateTime);
  }

  get modelName() {
    return 'Condition';
  }

  matches(obj) {
    return this.condition.code === obj.condition.code && this.condition.system === obj.condition.system;
  }

  static stripConflictFields(fields) {
    return fields.filter((field) => STRIP_FIELDS.indexOf(field) === -1);
  }
}
