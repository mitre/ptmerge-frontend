import moment from 'moment';

import get from '../utils/get';

export default class Encounter {
  constructor(bundle) {
    this._bundle = bundle;

    this.id = bundle.id;
    this.lastUpdated = moment(bundle.meta.lastUpdated);
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

  get(keyName) {
    return get(this._bundle, keyName);
  }

  toKey() {
    return `Encounter:${this.id}`;
  }

  matches(obj) {
    // code + system much match
    if (this.encounter.code !== obj.encounter.code || this.encounter.system !== obj.encounter.system) {
      return false;
    }

    return this.period.start.isSame(obj.period.start, 'day');
  }
}
