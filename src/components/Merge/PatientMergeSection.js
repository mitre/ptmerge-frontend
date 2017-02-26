import React, { Component, PropTypes } from 'react';

import CollapsiblePanel from '../../elements/CollapsiblePanel';

export default class PatientMergeSection extends Component {
  // gets the klass of the category and calls its corresponding component --
  // klasses can be either propertyMerge for data that consists of key/value pairs,
  // or simpleMerge for data that consist of a single value
  getContent(Klass) {
    return (
      <div className="d-flex justify-content-around">
        <div className="source">
          <div className="line"></div>
          { Klass == null ? null : <Klass {...this.props} patient="source1Patient" /> }
        </div>
        
        <div className="target">
          <div className="line"></div>
          { Klass == null ? null : <Klass {...this.props} patient="targetPatient" /> }
        </div>
        
        <div className="source">
          <div className="line"></div>
          { Klass == null ? null : <Klass {...this.props} patient="source2Patient" /> }
        </div>
      </div>
    );
  }
  
  render() {
    // if category has subcategories, call this component again on them
    if (this.props.category.subcategories) {
      return (
        <CollapsiblePanel panelTitle={this.props.category.name} hasNested={true}>
          <div>
            {this.props.category.subcategories.map((subcategory) =>
              <PatientMergeSection
                {...this.props}
                key={subcategory.id}
                category={subcategory}
                isSubcategory={true} />
            )}
          </div>
        </CollapsiblePanel>
      );
    }
    
    return (
      <CollapsiblePanel panelTitle={this.props.category.name} isNested={this.props.isSubcategory}>
        {this.getContent(this.props.category.klass)}
      </CollapsiblePanel>
    );
  }
}

PatientMergeSection.displayName = 'PatientMergeSection';

PatientMergeSection.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    klass: PropTypes.object,
    subcategories: PropTypes.array
  }).isRequired,
  source1Patient: PropTypes.object,
  source2Patient: PropTypes.object,
  targetPatient: PropTypes.object,
  isSubcategory: PropTypes.bool
};

PatientMergeSection.defaultProps = { isSubcategory: false };
