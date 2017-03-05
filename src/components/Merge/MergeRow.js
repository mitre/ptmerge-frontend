import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

// displays row of patient data for the given category
export default class MergeRow extends Component {
  renderedArrow() {
    if (this.props.patientType === "source1") {
      return <FontAwesome name="arrow-circle-o-right" className="arrow arrow-source1" />;
    } else if (this.props.patientType === "source2") {
      return <FontAwesome name="arrow-circle-o-left" className="arrow arrow-source2" />;
    }
  }

  render() {
    let className = `merge-row row patient-${this.props.patientType}${this.props.hasConflict ? ' has-conflict' : ''}`;

    return (
      <div className={className}>
        <div className="col key">{this.props.categoryName}</div>
        <div className="col value">{this.props.categoryValue}</div>
        <div className="merge-tool-placeholder">
          {this.props.hasConflict ? this.renderedArrow() : null}
        </div>
      </div>
    );
  }
}

MergeRow.displayName = 'MergeRow';

MergeRow.propTypes = {
  categoryName: PropTypes.string,
  categoryValue: PropTypes.any,
  patientType: PropTypes.string,
  hasConflict: PropTypes.bool
};
