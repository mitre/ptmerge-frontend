import moment from 'moment';
import get from '../utils/get';

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

    let diagnostics = bundle.issue[0].diagnostics.split(':');
    this.mergeConflict = {
      objectId: diagnostics[1],
      objectClass: diagnostics[0],
      fields: bundle.issue[0].location.slice()
    };
    this.resolved = false;

    this.source1PatientObject = null;
    this.source2PatientObject = null;
    this.targetPatientObject = null;
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
