import React, { Component, PropTypes } from 'react';

import MergeRow from './MergeRow';

// renders patient data that consists of key/value pairs
export default class PropertyMerge extends Component {
  constructor(props) {
    super(props);
    
    let categoryPath = props.category.id.split('.'); // ex. ['demographics', 'address']
    let patientData = props[props.patient].data; // gets data object for given patient
    
    // does a deep dive for category data for the given patient
    while (categoryPath.length) {
      patientData = patientData[categoryPath.shift()]; // shift returns first patientData and removes it
    }
    
    this.state = {
      patientData, // filtered to just the data for the given category
      keys: Object.keys(patientData)
    };
  }
  
  // renders category data for given patient
  renderPair(key) {
    return (
      <MergeRow
        key={key}
        categoryName={key}
        categoryValue={this.state.patientData[key]}
        transformName={true} />
    );
  }
  
  render() {
    return (
      <div>
        {this.state.keys.map((key) => 
          this.renderPair(key)
        )}
      </div>
    );
  }
}

PropertyMerge.displayName = 'PropertyMerge';

PropertyMerge.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  source1Patient: PropTypes.object,
  source2Patient: PropTypes.object,
  targetPatient: PropTypes.object,
  patient: PropTypes.string
};