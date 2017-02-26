import React, { Component, PropTypes } from 'react';

import MergeRow from './MergeRow';

// renders patient data that consists of a single value
export default class SimpleMerge extends Component {
  constructor(props) {
    super(props);
    
    let categoryPath = props.category.id.split('.'); // ex. ['demographics', 'age']
    let patientData = props[props.patient].data; // gets data object for given patient
    
    // does a deep dive for category data for the given patient
    let categoryName = '';
    while (categoryPath.length) {
      categoryName = categoryPath.shift();
      patientData = patientData[categoryName];
    }
    
    this.state = {
      categoryName, // last category in deep dive
      patientData // filtered to just the data for the given category
    };
  }
  
  // renders category data for given patient
  render() {
    return (
      <MergeRow
        categoryName={this.state.categoryName}
        categoryValue={this.state.patientData}
        transformName={true} />
    );
  }
}

SimpleMerge.displayName = 'SimpleMerge';

SimpleMerge.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  source1Patient: PropTypes.object,
  source2Patient: PropTypes.object,
  targetPatient: PropTypes.object,
  patient: PropTypes.string
};
