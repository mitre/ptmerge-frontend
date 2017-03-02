import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';

import Select from 'react-select';

import { fetchPatient, fetchPatientList } from '../actions/patient';

import PageHeader from '../components/Header/PageHeader';
import PatientMergeSection from '../components/Merge/PatientMergeSection';

import mergeCategories from '../utils/merge_categories';

export class Merge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      source1Patient: null,
      source2Patient: null,
      targetPatient: null,
      targetPatientData: null,
      sourcePatientList: [],
      setTargetPatientOnNewProps: false
    };
  }

  componentWillMount() {
    this.props.fetchPatientList();
  }

  componentWillReceiveProps(nextProps) {
    // when patient list changes, updates list -- used in select2 component
    let newState = {};
    if (this.props.patientList !== nextProps.patientList) {
      newState.sourcePatientList = nextProps.patientList.map(({ id, name }) => {
        return { value: id, label: name };
      });
    }
    
    // when source data properties change, sets target patient data to selected source patient data
    if (this.state.setTargetPatientOnNewProps && this.state.targetPatient) {
      if (nextProps.source1PatientData && nextProps.source1PatientData.id === this.state.targetPatient.id) {
        newState.targetPatientData = nextProps.source1PatientData;
        newState.setTargetPatientOnNewProps = false;
      } else if (nextProps.source2PatientData && nextProps.source2PatientData.id === this.state.targetPatient.id) {
        newState.targetPatientData = nextProps.source2PatientData;
        newState.setTargetPatientOnNewProps = false;
      }
    }
    
    this.setState(newState);
  }

  // handles selection of source patient, field = source1Patient or source2Patient
  select2Handler(field) {
    // returns a function which fetches the patient and sets the state for the given field
    return (selectedOption) => {
      let patientId = null;
      let patient = null;

      if (selectedOption) {
        patientId = selectedOption.value;
        patient = this.props.patientList.find((patient) => patient.id === patientId);
        
        this.props.fetchPatient(patient.id, field);
      }

      this.setState({
        [field]: patient
      });
    };
  }
  
  // handles selection of target patient
  select2TargetPatientHandler(selectedOption) {
    if (selectedOption) {
      let targetPatientId = selectedOption.value;
      let targetPatient = this.props.patientList.find((patient) => patient.id === targetPatientId);
      let targetPatientData = null;
      let setTargetPatientOnNewProps = false; // handles cases when ajax call for source patient hasn't finished yet
      
      // sets target to source1 patient when selected
      if (this.props.source1PatientData && this.props.source1PatientData.id === targetPatientId) {
        targetPatientData = this.props.source1PatientData;
      // sets target to source2 patient when selected
      } else if (this.props.source2PatientData && this.props.source2PatientData.id === targetPatientId) {
        targetPatientData = this.props.source2PatientData;
      // target was selected before ajax call for source patient was completed
      } else {
        setTargetPatientOnNewProps = true;
      }
      
      this.setState({
        targetPatient,
        targetPatientData,
        setTargetPatientOnNewProps
      });
    } else {
      // when target patient is cleared
      this.setState({
        targetPatient: null,
        targetPatientData: null,
        setTargetPatientOnNewProps: false
      });
    }
  }

  // excludes selected source patient from other source patient list -- prevents selecting the
  // same patient for both sources
  filteredSourceList(excludedPatient) {
    if (excludedPatient == null) {
      return this.state.sourcePatientList;
    } else {
      return this.state.sourcePatientList.filter((patient) => patient.value !== excludedPatient.id);
    }
  }
  
  // renders categories with patient data for selected source and target patients
  renderedPatientData() {
    if (this.props.source1PatientData == null ||
        this.props.source2PatientData == null ||
        this.state.targetPatientData == null) {
      return; // only renders when all 3 patients have been selected
    }
    
    return mergeCategories.map((category) =>
      <PatientMergeSection
        key={category.id}
        category={category}
        source1Patient={this.props.source1PatientData}
        source2Patient={this.props.source2PatientData}
        targetPatient={this.state.targetPatientData} />
    );
  }

  render() {
    // sets target patient list to be selected source patients only
    let targetPatientList = [];
    if (this.state.source1Patient) {
      targetPatientList.push(this.state.source1Patient);
    }
    if (this.state.source2Patient) {
      targetPatientList.push(this.state.source2Patient);
    }

    return (
      <div className="merge">
        <PageHeader title="Merge" />

        <div className="merge-tool">
          <div className="merge-tool-header">
            <div className="merge-tool-header-titles row">
              <div className="merge-tool-header-title col">Source</div>
              <div className="merge-tool-header-title col">Target</div>
              <div className="merge-tool-header-title col">Source</div>
            </div>

            <div className="merge-tool-header-selectors d-flex justify-content-around">
              <div className="merge-tool-header-selector source d-flex">
                <div className="merge-tool-header-selector-icon source-1">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                <Select
                  options={this.filteredSourceList(this.state.source2Patient)}
                  value={this.state.source1Patient == null ? null : this.state.source1Patient.id}
                  onChange={this.select2Handler('source1Patient')}
                  placeholder="Select a source" />
              </div>

              <div className="merge-tool-header-selector target d-flex">
                <div className="merge-tool-header-selector-icon target">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                <Select
                  options={targetPatientList.map((patient) => { return { value: patient.id, label: patient.name }; })}
                  value={this.state.targetPatient == null ? null : this.state.targetPatient.id}
                  onChange={this.select2TargetPatientHandler.bind(this)}
                  placeholder="Select a target" />
              </div>

              <div className="merge-tool-header-selector source d-flex">
                <div className="merge-tool-header-selector-icon source-2">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                <Select
                  options={this.filteredSourceList(this.state.source1Patient)}
                  value={this.state.source2Patient == null ? null : this.state.source2Patient.id}
                  onChange={this.select2Handler('source2Patient')}
                  placeholder="Select a source" />
              </div>
            </div>
          </div>

          <div className="merge-tool-body">
            {this.renderedPatientData()}
            
            <div className="merge-tool-footer">
              <div className="d-flex justify-content-around">
                <div className="source source1">
                  <div className="line"></div>
                  <div className="record-end"></div>
                </div>
                
                <div className="target">
                  <div className="line"></div>
                  <div className="conflict-count">
                    <FontAwesome name="exclamation-circle" />
                    0 conflicts to accept
                  </div>
                  
                  <div className="action-buttons">
                    <button type="button" className="btn btn-secondary">Cancel</button>
                    <button type="button" className="btn btn-primary">Create Target Record</button>
                  </div>
                </div>
                
                <div className="source source2">
                  <div className="line"></div>
                  <div className="record-end"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Merge.displayName = 'Merge';

Merge.propTypes = {
  patientList: PropTypes.array,
  fetchPatient: PropTypes.func.isRequired,
  fetchPatientList: PropTypes.func.isRequired,
  source1PatientData: PropTypes.object,
  source2PatientData: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchPatient,
    fetchPatientList
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    patientList: state.patient.patientList,
    source1PatientData: state.patient.source1PatientData,
    source2PatientData: state.patient.source2PatientData
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Merge);
