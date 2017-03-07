import moment from 'moment';

import get from '../utils/get';

const STRIP_FIELDS = Object.freeze([
  "id",
  "subject.reference",
  "subject.referenceid"
]);

export default class Procedure {
  constructor(bundle) {
    this._bundle = bundle;

    this.id = bundle.id;
    this.lastUpdated = moment(bundle.meta.lastUpdated);

    this.status = bundle.status;

    let [coding] = bundle.code.coding;
    this.procedure = {
      name: coding.display,
      code: coding.code,
      system: coding.system
    };
    this.performedDate = moment(bundle.performedDateTime);
  }

  get(keyName) {
    return get(this._bundle, keyName);
  }

  toKey() {
    return `Procedure:${this.id}`;
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
