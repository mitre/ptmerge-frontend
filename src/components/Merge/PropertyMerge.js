import React, { Component, PropTypes } from 'react';

import MergeRow from './MergeRow';

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
    let hasConflict = this.props.conflicts && this.props.conflicts.indexOf(dataKey) !== -1;

    return (
      <MergeRow
        key={displayKey}
        categoryName={displayKey}
        categoryValue={this.props.source.get(dataKey)}
        hasConflict={hasConflict}
        patientType={this.props.patientType} />
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
  conflicts: PropTypes.arrayOf(PropTypes.string)
};
