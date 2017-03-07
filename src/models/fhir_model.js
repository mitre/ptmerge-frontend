import moment from 'moment';

import get from '../utils/get';
import set from '../utils/set';

export default class FhirModel {
  constructor(bundle) {
    this._bundle = bundle;

    this.id = bundle.id;
    this.lastUpdated = moment(bundle.meta.lastUpdated);
    this._pendingDelete = false;
  }

  get modelName() {
    throw new Error(`${this} must overwrite the modelName property`);
  }

  getId() {
    return this.id;
  }

  get(keyName) {
    return get(this._bundle, keyName);
  }

  set(keyName, value) {
    set(this._bundle, keyName, value);
    return value;
  }

  toKey() {
    return `${this.modelName}:${this.getId()}`;
  }

  matches(/* obj */) {
    return false;
  }

  delete() {
    this._pendingDelete = true;
  }

  isPendingDeletion() {
    return this._pendingDelete;
  }

  static stripConflictFields(fields) {
    return fields;
  }
}
