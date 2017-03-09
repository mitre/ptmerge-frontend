import moment from 'moment';
import axios from 'axios';

import Condition from './condition';
import Encounter from './encounter';
import Medication from './medication';
import Patient from './patient';
import Procedure from './procedure';

// classes that we can cross link
const LINKABLE_OBJECTS = [
  'Patient',
  'Condition',
  'Encounter',
  'MedicationStatement',
  'Procedure'
];

export default class MergeConflict {
  constructor(mergeId, bundle) {
    this.mergeId = mergeId;
    this._bundle = bundle;

    this.id = bundle.id;
    this.lastUpdated = moment(bundle.meta.lastUpdated);

    let [objectClass, objectId] = bundle.issue[0].diagnostics.split(':');

    let _fields = toClass(objectClass).stripConflictFields(bundle.issue[0].location.slice());
    let fields = alterKeySyntax(_fields);

    this.mergeConflict = {
      objectId,
      objectClass,
      fields,
      _fields
    };
    this.resolved = false;
    this.saved = false;

    this.source1PatientObject = null;
    this.source2PatientObject = null;
    this.targetPatientObject = null;
  }

  markFieldsResolved(fields) {
    if (fields == null) {
      this.markResolved();
      return;
    }

    for (let i = 0; i < fields.length; ++i) {
      let field = fields[i];
      let index = this.mergeConflict.fields.indexOf(field);

      if (index !== -1) {
        this.mergeConflict.fields.splice(index, 1);
      }
    }

    if (this.mergeConflict.fields.length === 0) {
      this.markResolved();
    }
  }

  markResolved() {
    this.mergeConflict.fields = [];
    this.resolved = true;
  }

  isResolved() {
    return this.resolved;
  }

  save() {
    if (!this.isResolved()) {
      return;
    } else if (this.saved) {
      return Promise.resolve();
    }

    let request = axios({
      method: 'post',
      url: `${MERGE_SERVER}/merge/${this.mergeId}/resolve/${this.id}`,
      data: this.targetPatientObject.toFhir()
    });

    request.then(() => {
      this.saved = true;
    });

    return request;
  }

  delete() {
    let request = axios({
      method: 'delete',
      url: `${MERGE_SERVER}/merge/${this.mergeId}/resolve/${this.id}`
    });

    request.then(() => {
      this.saved = true;
    });

    return request;
  }

  getUnresolvedConflicts() {
    return this.mergeConflict.fields;
  }

  hasUnresolvedConflicts(key) {
    return this.mergeConflict.fields.indexOf(key) !== -1;
  }

  setFromSource(key, source) {
    let patientObject = this[`${source}PatientObject`];
    if (patientObject) {
      this.targetPatientObject.set(key, patientObject.get(key));
    }
  }

  isLinkable() {
    return LINKABLE_OBJECTS.indexOf(this.mergeConflict.objectClass) !== -1;
  }

  linkPatientObjects(source1Patient, source2Patient, targetPatient) {
    if (this.mergeConflict.objectClass === 'Patient') {
      this.targetPatientObject = targetPatient;
      this.source1PatientObject = source1Patient;
      this.source2PatientObject = source2Patient;
    } else {
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

  linkTargetObject(targetPatient) {
    if (this.mergeConflict.objectClass === 'Patient') {
      this.targetPatientObject = targetPatient;
    } else {
      let key = transformObjectClassKey(this.mergeConflict.objectClass);

      let targetPatientObject = targetPatient[key].find((obj) => obj.id === this.mergeConflict.objectId);
      if (targetPatientObject == null) {
        return;
      }

      this.targetPatientObject = targetPatientObject;
    }
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

function alterKeySyntax(conflictKeys) {
  return conflictKeys.map((key) => key.replace('[', '.['));
}
