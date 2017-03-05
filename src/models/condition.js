import moment from 'moment';

import get from '../utils/get';

export default class Condition {
  constructor(bundle) {
    this._bundle = bundle;

    this.id = bundle.id;
    this.lastUpdated = moment(bundle.meta.lastUpdated);

    let [coding] = bundle.code.coding;
    this.condition = {
      name: coding.display,
      code: coding.code,
      system: coding.system
    };
    this.onsetDate = moment(bundle.onsetDateTime);
  }

  get(keyName) {
    return get(this._bundle, keyName);
  }

  toKey() {
    return `Condition:${this.id}`;
  }

  matches(obj) {
    return this.condition.code === obj.condition.code && this.condition.system === obj.condition.system;
  }
}
