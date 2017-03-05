import moment from 'moment';

import get from '../utils/get';

export default class Medication {
  constructor(bundle) {
    this._bundle = bundle;

    this.id = bundle.id;
    this.lastUpdated = moment(bundle.meta.lastUpdated);
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

  get(keyName) {
    return get(this._bundle, keyName);
  }

  toKey() {
    return `Medication:${this.id}`;
  }

  matches(obj) {
    // code + system much match
    if (this.medication.code !== obj.medication.code || this.medication.system !== obj.medication.system) {
      return false;
    }

    return this.effectivePeriod.start.isSame(obj.effectivePeriod.start, 'day');
  }
}
