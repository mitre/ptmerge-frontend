import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

// displays row of patient data for the given category
export default class MergeRow extends Component {
  name() {
    if (this.props.transformName) { // humanize it
      return _.chain(this.props.categoryName).snakeCase().split('_').map(_.upperFirst).join(' ').value();
    }

    return this.props.categoryName;
  }
  
  render() {
    return (
      <div className="merge-row row">
        <div className="col key">{this.name()}</div>
        <div className="col value">{this.props.categoryValue}</div>
      </div>
    );
  }
}

MergeRow.displayName = 'MergeRow';

MergeRow.propTypes = {
  categoryName: PropTypes.string,
  categoryValue: PropTypes.any,
  transformName: PropTypes.bool
};
