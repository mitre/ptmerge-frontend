import FhirModel from './fhir_model';

export default class Merge extends FhirModel {
  constructor(bundle) {
    super(bundle);

    this.completed = bundle.completed;
    this.patient = null;
    this.mergeConflicts = [];
  }

  get modelName() {
    return 'Merge';
  }

  addMergeConflicts(mergeConflicts) {
    this.mergeConflicts.splice(this.mergeConflicts.length, 0, ...mergeConflicts);

    for (let i = 0; i < mergeConflicts.length; ++i) {
      mergeConflicts[i].linkTargetObject(this.patient);
    }
  }

  setPatient(patient) {
    this.patient = patient;
  }

  getTotalConflicts() {
    return this.mergeConflicts.reduce((memo, conflict) => memo + conflict.getUnresolvedConflicts().length, 0);
  }
}
