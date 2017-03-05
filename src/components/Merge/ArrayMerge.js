import React, { Component, PropTypes } from 'react';

import PropertyMerge from './PropertyMerge';
import CollapsiblePanel from '../../elements/CollapsiblePanel';

import PatientMerger from '../../models/patient_merger';

export default class ArrayMerge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      objects: this.buildObjects()
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

      objects.push({
        source1: source1Object,
        source2: source2Object,
        target: targetObject
      });
    }

    return objects;
  }

  row(conditionHash, index) {
    let { source1, source2, target } = conditionHash;
    let source1Conflicts = null;
    let source2Conflicts = null;
    let targetConflicts = null;

    if (source1) {
      let conflict = this.props.patientMerger.conflictedSource1Objects[source1.toKey()];
      if (conflict) {
        source1Conflicts = conflict.mergeConflict.fields;
      }
    }

    if (source2) {
      let conflict = this.props.patientMerger.conflictedSource2Objects[source2.toKey()];
      if (conflict) {
        source2Conflicts = conflict.mergeConflict.fields;
      }
    }

    return (
      <div className="d-flex justify-content-around" key={index}>
        <div className="source source1">
          <div className="line"></div>
          {source1 == null ? null : <PropertyMerge source={source1} keys={this.props.keys} conflicts={source1Conflicts} patientType="source1" />}
        </div>

        <div className="merge-tool-placeholder"></div>

        <div className="target">
          <div className="line"></div>
          <PropertyMerge source={target} keys={this.props.keys} conflicts={targetConflicts} patientType="target" />
        </div>

        <div className="merge-tool-placeholder"></div>

        <div className="source source2">
          <div className="line"></div>
          {source2 == null ? null : <PropertyMerge source={source2} keys={this.props.keys} conflicts={source2Conflicts} patientType="source2" />}
        </div>
      </div>
    );
  }

  render() {
    return (
      <CollapsiblePanel panelTitle={this.props.panelTitle}>
        <div>
          {this.state.objects.map((conditionHash, index) =>
            this.row(conditionHash, index)
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
