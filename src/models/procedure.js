import moment from 'moment';

import FhirModel from './fhir_model';

const STRIP_FIELDS = Object.freeze([
  "id",
  "subject.reference",
  "subject.referenceid"
]);

export default class Procedure extends FhirModel {
  constructor(bundle) {
    super(bundle);

    this.status = bundle.status;

    let [coding] = bundle.code.coding;
    this.procedure = {
      name: coding.display,
      code: coding.code,
      system: coding.system
    };
    this.performedDate = moment(bundle.performedDateTime);
  }

  get modelName() {
    return 'Procedure';
  }

  matches(obj) {
    // code + system much match
    if (this.procedure.code !== obj.procedure.code || this.procedure.system !== obj.procedure.system) {
      return false;
    }

    return this.performedDate.isSame(obj.performedDate, 'day');
  }

  static stripConflictFields(fields) {
    return fields.filter((field) => STRIP_FIELDS.indexOf(field) === -1);
  }
}
