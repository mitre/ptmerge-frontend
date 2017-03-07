import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';

import PropertyMerge from './PropertyMerge';
import CollapsiblePanel from '../../elements/CollapsiblePanel';

import PatientMerger from '../../models/patient_merger';

export default class ArrayMerge extends Component {
  constructor(props) {
    super(props);

    let objects = this.buildObjects();
    let conflictCount = this.conflictCount(objects.map((obj) => obj.target));

    this.state = {
      objects,
      conflictCount
    };
  }

  buildObjects() {
    let { source1Patient, source2Patient, targetPatient } = this.props.patientMerger;
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

  conflictCount(objects) {
    let count = 0;
    for (let i = 0; i < objects.length; ++i) {
      let object = objects[i];
      let conflict = this.props.patientMerger.conflictedTargetObjects[object.toKey()];
      if (conflict) {
        count += conflict.unresolvedConflicts().length;
      }
    }
    return count;
  }

  renderedArrow(patientType) {
    if (patientType === "source1") {
      return <FontAwesome name="arrow-circle-o-right" className="arrow arrow-source1" />;
    } else if (patientType === "source2") {
      return <FontAwesome name="arrow-circle-o-left" className="arrow arrow-source2" />;
    }
  }

  renderedEmptyResource(patientType) {
    return (
      <div className="empty-resource">
        <div className="empty-resource-text">No resource present</div>
        {this.renderedArrow(patientType)}
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
          {source1 == null ? this.renderedEmptyResource('source1') : <PropertyMerge source={source1} keys={this.props.keys} conflict={source1Conflict} patientType="source1" />}
          {source1 == null ? null : <div className="divider"></div>}
        </div>

        <div className="merge-tool-placeholder"></div>

        <div className="target">
          <div className="line"></div>
          <PropertyMerge source={target} keys={this.props.keys} conflict={targetConflict} patientType="target" />
          <div className="divider"></div>
        </div>

        <div className="merge-tool-placeholder"></div>

        <div className="source source2">
          <div className="line"></div>
          {source2 == null ? this.renderedEmptyResource('source2') : <PropertyMerge source={source2} keys={this.props.keys} conflict={source2Conflict} patientType="source2" />}
          {source2 == null ? null : <div className="divider"></div>}
        </div>
      </div>
    );
  }

  render() {
    return (
      <CollapsiblePanel panelTitle={this.props.panelTitle} conflictCount={this.state.conflictCount}>
        <div>
          {this.state.objects.map((conditionHash, index) =>
            this.renderedRow(conditionHash, index)
          )}
        </div>
      </CollapsiblePanel>
    );
  }
}

ArrayMerge.displayName = 'ArrayMerge';

ArrayMerge.propTypes = {
  patientMerger: PropTypes.instanceOf(PatientMerger),
  objectKey: PropTypes.string.isRequired,
  keys: PropTypes.object.isRequired,
  panelTitle: PropTypes.string
};
