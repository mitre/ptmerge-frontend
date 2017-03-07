import moment from 'moment';

import FhirModel from './fhir_model';

const STRIP_FIELDS = Object.freeze([
  "id",
  "patient.reference",
  "patient.referenceid"
]);

export default class Encounter extends FhirModel {
  constructor(bundle) {
    super(bundle);

    this.status = bundle.status;
    this.classType = bundle['class'].code;

    let [coding] = bundle.type[0].coding;
    this.encounter = {
      name: coding.display,
      code: coding.code,
      system: coding.system
    };
    this.period = {
      start: moment(bundle.period.start),
      end: moment(bundle.period.end)
    };
  }

  get modelName() {
    return 'Encounter';
  }

  matches(obj) {
    // code + system much match
    if (this.encounter.code !== obj.encounter.code || this.encounter.system !== obj.encounter.system) {
      return false;
    }

    return this.period.start.isSame(obj.period.start, 'day');
  }

  static stripConflictFields(fields) {
    return fields.filter((field) => STRIP_FIELDS.indexOf(field) === -1);
  }
}
