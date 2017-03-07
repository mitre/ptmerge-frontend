import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
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
    let className = classNames(
      'merge-row', 'row', `patient-${this.props.patientType}`,
      { 'has-conflict': this.props.hasConflict },
      { [`value-from-${this.props.conflictFrom}`]: this.props.conflictFrom }
    );

    return (
      <div className={className}>
        <div className="col key">{this.props.categoryName}</div>
        <div className="col value" title={this.props.categoryValue}>{this.props.categoryValue}</div>
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
  hasConflict: PropTypes.bool,
  conflictFrom: PropTypes.string
};
