import moment from 'moment';
import get from '../utils/get';

import Condition from './Condition';
import Encounter from './Encounter';
import Medication from './Medication';
import Patient from './Patient';
import Procedure from './Procedure';

// classes that we can cross link
const LINKABLE_OBJECTS = [
  'Condition',
  'Encounter',
  'MedicationStatement',
  'Procedure'
];

export default class MergeConflict {
  constructor(bundle) {
    this._bundle = bundle;

    this.id = bundle.id;
    this.lastUpdated = moment(bundle.meta.lastUpdated);

    let [objectClass, objectId] = bundle.issue[0].diagnostics.split(':');

    this.mergeConflict = {
      objectId,
      objectClass,
      fields: toClass(objectClass).stripConflictFields(bundle.issue[0].location.slice())
    };
    this.resolved = false;

    this.source1PatientObject = null;
    this.source2PatientObject = null;
    this.targetPatientObject = null;
  }

  isResolved() {
    return false;
  }

  unresolvedConflicts() {
    return this.mergeConflict.fields;
  }

  hasUnresolvedConflicts(key) {
    return this.mergeConflict.fields.indexOf(key) !== -1;
  }

  isLinkable() {
    return LINKABLE_OBJECTS.indexOf(this.mergeConflict.objectClass) !== -1;
  }

  linkPatientObjects(source1Patient, source2Patient, targetPatient) {
    let key = transformObjectClassKey(this.mergeConflict.objectClass);

    let targetPatientObject = targetPatient[key].find((obj) => obj.id === this.mergeConflict.objectId);
    if (targetPatientObject == null) {
      return;
    }

    this.targetPatientObject = targetPatientObject;
    this.source1PatientObject = source1Patient[key].find((obj) => obj.matches(targetPatientObject));
    this.source2PatientObject = source2Patient[key].find((obj) => obj.matches(targetPatientObject));
  }
}

function transformObjectClassKey(key) {
  if (key === 'MedicationStatement') {
    return 'medications';
  }

  return `${key.toLowerCase()}s`;
}

function toClass(key) {
  if (key === 'Condition') {
    return Condition;
  } else if (key === 'Encounter') {
    return Encounter;
  } else if (key === 'MedicationStatement') {
    return Medication;
  } else if (key === 'Patient') {
    return Patient;
  } else if (key === 'Procedure') {
    return Procedure;
  }
}
