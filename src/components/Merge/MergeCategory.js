import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import PropertyMerge from './PropertyMerge';
import CollapsiblePanel from '../../elements/CollapsiblePanel';

import PatientMerger from '../../models/patient_merger';

export default class MergeCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      objects: this.buildObjects()
    };
  }

  conflictCount() {
    let conflictCount;
    let objects = this.state.objects;

    if (this.props.objectKey === 'patient' && this.props.hasNested) {
      conflictCount = this.props.patientMerger.conflictedTargetObjects[objects[0].target.toKey()].getUnresolvedConflicts().length;
    } else if (this.props.objectKey === 'patient') {
      conflictCount = this.patientConflictCount(objects[0]);
    } else if (objects) {
      conflictCount = this.arrayConflictCount(objects.map((obj) => obj.target));
    }

    return conflictCount === 0 ? null : conflictCount;
  }

  buildObjects() {
    if (this.props.objectKey == null) { return; }

    let { objectKey } = this.props;
    let { source1Patient, source2Patient, targetPatient } = this.props.patientMerger;

    if (objectKey === 'patient') {
      return [{
        source1: source1Patient,
        source2: source2Patient,
        target: targetPatient
      }];
    }

    let targetPatientObjects = targetPatient[this.props.objectKey];
    let source1Objects = source1Patient[this.props.objectKey];
    let source2Objects = source2Patient[this.props.objectKey];

    let objects = new Array(targetPatientObjects.length);

    for (let i = 0; i < targetPatientObjects.length; ++i) {
      let targetObject = targetPatientObjects[i];
      let source1Object = source1Objects.find((obj) => targetObject.matches(obj));
      let source2Object = source2Objects.find((obj) => targetObject.matches(obj));

      objects[i] = {
        source1: source1Object,
        source2: source2Object,
        target: targetObject
      };
    }

    return objects;
  }

  patientConflictCount(object) {
    let conflict = this.props.patientMerger.conflictedTargetObjects[object.target.toKey()];
    let conflictedFields = _.intersection(conflict.getUnresolvedConflicts(), Object.values(this.props.keys));
    return conflictedFields.length === 0 ? null : conflictedFields.length;
  }

  arrayConflictCount(objects) {
    let count = 0;

    for (let i = 0; i < objects.length; ++i) {
      let object = objects[i];
      let conflict = this.props.patientMerger.conflictedTargetObjects[object.toKey()];
      if (conflict) {
        count += conflict.getUnresolvedConflicts().length;
      }
    }
    return count;
  }

  renderedArrow(patientType, targetObject) {
    let action = () => {
      this.props.patientMerger.deleteResource(targetObject);
      this.props.updateParentView && this.props.updateParentView();
    };

    if (patientType === "source1") {
      return <FontAwesome name="arrow-circle-o-right" className="arrow arrow-source1" onClick={action} />;
    } else if (patientType === "source2") {
      return <FontAwesome name="arrow-circle-o-left" className="arrow arrow-source2" onClick={action} />;
    }
  }

  renderedEmptyResource(patientType, targetObject) {
    let displayText = patientType === 'target' ? 'Resource deleted' : 'No resource present';

    return (
      <div className="empty-resource">
        <div className="empty-resource-text">{displayText}</div>
        {patientType !== 'target' ? this.renderedArrow(patientType, targetObject) : null}
      </div>
    );
  }

  renderedRow(conditionHash, index) {
    let { source1, source2, target } = conditionHash;
    let source1Conflict = null;
    let source2Conflict = null;
    let targetConflict = this.props.patientMerger.conflictedTargetObjects[target.toKey()];

    if (source1) {
      source1Conflict = this.props.patientMerger.conflictedSource1Objects[source1.toKey()];
    }

    if (source2) {
      source2Conflict = this.props.patientMerger.conflictedSource2Objects[source2.toKey()];
    }

    return (
      <div className="d-flex justify-content-around" key={index}>
        <div className="source source1">
          <div className="line"></div>
          {source1 == null ? this.renderedEmptyResource('source1', target) : <PropertyMerge source={source1} keys={this.props.keys} conflict={source1Conflict} patientType="source1" onUpdate={this.forceUpdate.bind(this)} />}
          {source1 == null ? null : <div className="divider"></div>}
        </div>

        <div className="merge-tool-placeholder"></div>

        <div className="target">
          <div className="line"></div>
          {target.isPendingDeletion() ? this.renderedEmptyResource('target') : <PropertyMerge source={target} keys={this.props.keys} conflict={targetConflict} patientType="target" />}
          <div className="divider"></div>
        </div>

        <div className="merge-tool-placeholder"></div>

        <div className="source source2">
          <div className="line"></div>
          {source2 == null ? this.renderedEmptyResource('source2', target) : <PropertyMerge source={source2} keys={this.props.keys} conflict={source2Conflict} patientType="source2" onUpdate={this.forceUpdate.bind(this)} />}
          {source2 == null ? null : <div className="divider"></div>}
        </div>
      </div>
    );
  }

  renderedObjects() {
    if (this.props.hasNested) { return this.props.children; }
    if (this.state.objects == null) { return; }

    return (
      <div>
        {this.state.objects.map((conditionHash, index) =>
          this.renderedRow(conditionHash, index)
        )}
      </div>
    );
  }

  onAccept() {
    if (this.props.onAccept) {
      this.props.onAccept(this.props.objectKey, this.props.keys);
    }
  }

  render() {
    let conflictCount = this.conflictCount();

    return (
      <CollapsiblePanel panelTitle={this.props.panelTitle}
                        conflictCount={conflictCount}
                        hasNested={this.props.hasNested}
                        isNested={this.props.isNested}
                        defaultOpen={conflictCount > 0}
                        onAccept={this.onAccept.bind(this)}>
        {this.renderedObjects()}
      </CollapsiblePanel>
    );
  }
}

MergeCategory.displayName = 'MergeCategory';

MergeCategory.propTypes = {
  children: PropTypes.element,
  hasNested: PropTypes.bool,
  isNested: PropTypes.bool,
  keys: PropTypes.object,
  objectKey: PropTypes.string,
  panelTitle: PropTypes.string,
  patientMerger: PropTypes.instanceOf(PatientMerger),
  updateParentView: PropTypes.func,
  onAccept: PropTypes.func
};
