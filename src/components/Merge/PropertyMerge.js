import React, { Component, PropTypes } from 'react';

import MergeRow from './MergeRow';

import MergeConflict from '../../models/merge_conflict';

// renders patient data that consists of key/value pairs
export default class PropertyMerge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayNameKeys: Object.keys(props.keys)
    };
  }

  // renders category data for given patient
  renderPair(displayKey) {
    let dataKey = this.props.keys[displayKey];
    let conflict = this.props.conflict;
    let hasConflict = conflict && conflict.mergeConflict.fields.indexOf(dataKey) !== -1;
    let value = this.props.source.get(dataKey);

    let params = {
      key: displayKey,
      categoryName: displayKey,
      categoryValue: value,
      patientType: this.props.patientType,
      hasConflict
    };

    if (hasConflict && this.props.patientType === 'target') {
      if (conflict.source1PatientObject && conflict.source1PatientObject.get(dataKey) === value) {
        params.conflictFrom = 'source1';
      } else if (conflict.source2PatientObject && conflict.source2PatientObject.get(dataKey) === value) {
        params.conflictFrom = 'source2';
      }
    }

    return (
      <MergeRow {...params} />
    );
  }

  render() {
    return (
      <div>
        {this.state.displayNameKeys.map((key) =>
          this.renderPair(key)
        )}
      </div>
    );
  }
}

PropertyMerge.displayName = 'PropertyMerge';

PropertyMerge.propTypes = {
  source: PropTypes.any.isRequired,
  keys: PropTypes.object.isRequired,
  patientType: PropTypes.string,
  conflict: PropTypes.instanceOf(MergeConflict)
};
