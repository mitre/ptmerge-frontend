import MergeConflict from './merge_conflict';

export default class PatientMerger {
  constructor(mergeId, source1Patient, source2Patient, targetPatient, mergeBundle) {
    this.mergeId = mergeId;
    this.source1Patient = source1Patient;
    this.source2Patient = source2Patient;
    this.targetPatient = targetPatient;
    this._bundle = mergeBundle;

    let conflicts = wrapConflicts(mergeBundle, source1Patient, source2Patient, targetPatient);
    let { source1Objects, source2Objects, targetObjects } = buildConflictMap(conflicts);

    this.conflicts = conflicts;
    this.conflictedSource1Objects = source1Objects;
    this.conflictedSource2Objects = source2Objects;
    this.conflictedTargetObjects = targetObjects;
  }

  getMergeId() {
    return this.mergeId;
  }

  numConflicts() {
    let count = 0;
    for (let i = 0; i < this.conflicts.length; ++i) {
      if (!this.conflicts[i].isResolved()) {
        count += this.conflicts[i].getUnresolvedConflicts().length;
      }
    }
    return count;
  }

  deleteResource(resource) {
    let conflict = this.conflictedTargetObjects[resource.toKey()];
    if (conflict) {
      conflict.markResolved();
    }

    resource.delete();
  }

  resolveConflicts(objectKey, resolvedFields) {
    let targetObjects;

    if (objectKey === 'patient') {
      targetObjects = [this.targetPatient];
    } else {
      targetObjects = this.targetPatient[objectKey];
    }

    for (let i = 0; i < targetObjects.length; ++i) {
      let resource = targetObjects[i];
      let conflict = this.conflictedTargetObjects[resource.toKey()];

      if (conflict) {
        conflict.markFieldsResolved(resolvedFields);
      }
    }
  }
}

function wrapConflicts(bundle, source1Patient, source2Patient, targetPatient) {
  let conflicts = new Array(bundle.entry.length);
  for (let i = 0; i < bundle.entry.length; ++i) {
    let conflict = new MergeConflict(bundle.entry[i].resource);

    if (conflict.isLinkable()) {
      conflict.linkPatientObjects(source1Patient, source2Patient, targetPatient);
    }

    conflicts[i] = conflict;
  }
  return conflicts;
}

function buildConflictMap(conflicts) {
  let source1Objects = {};
  let source2Objects = {};
  let targetObjects = {};

  for (let i = 0; i < conflicts.length; ++i) {
    let conflict = conflicts[i];

    if (conflict.source1PatientObject) {
      source1Objects[conflict.source1PatientObject.toKey()] = conflict;
    }
    if (conflict.source2PatientObject) {
      source2Objects[conflict.source2PatientObject.toKey()] = conflict;
    }
    if (conflict.targetPatientObject) {
      targetObjects[conflict.targetPatientObject.toKey()] = conflict;
    }
  }

  return {
    source1Objects,
    source2Objects,
    targetObjects
  };
}
