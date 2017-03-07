import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';

import Select from 'react-select';

import { fetchPatient, fetchPatientList } from '../actions/patient';
import { mergePatients } from '../actions/merge';

import PageHeader from '../components/Header/PageHeader';
import ArrayMerge from '../components/Merge/ArrayMerge';

import PatientMerger from '../models/patient_merger';

export class Merge extends Component {
  static conditionMergeKeys = Object.freeze({
    'Condition': 'code.coding.[0].display',
    'Code': 'code.coding.[0].code',
    'System': 'code.coding.[0].system',
    'Onset Date': 'onsetDateTime',
    'Updated': 'meta.lastUpdated'
  });

  static encounterMergeKeys = Object.freeze({
    'Encounter': 'type.[0].coding.[0].display',
    'Code': 'type.[0].coding.[0].code',
    'System': 'type.[0].coding.[0].system',
    'Class': 'class.code',
    'Status': 'status',
    'Start Date': 'period.start',
    'End Date': 'period.end',
    'Updated': 'meta.lastUpdated'
  });

  static medicationMergeKeys = Object.freeze({
    'Medication': 'medicationCodeableConcept.coding.[0].display',
    'Code': 'medicationCodeableConcept.coding.[0].code',
    'System': 'medicationCodeableConcept.coding.[0].system',
    'Status': 'status',
    'Start Date': 'effectivePeriod.start',
    'End Date': 'effectivePeriod.end',
    'Updated': 'meta.lastUpdated'
  });

  static procedureMergeKeys = Object.freeze({
    'Procedure': 'code.coding.[0].display',
    'Code': 'code.coding.[0].code',
    'System': 'code.coding.[0].system',
    'Status': 'status',
    'Performed Date': 'performedDateTime',
    'Updated': 'meta.lastUpdated'
  });

  constructor(props) {
    super(props);

    this.state = {
      source1Patient: null,
      source2Patient: null,
      sourcePatientList: [],
      mergeInProgress: false,
      loading: false
    };
  }

  componentWillMount() {
    this.props.fetchPatientList();
  }

  componentWillReceiveProps(nextProps) {
    // when patient list changes, updates list -- used in select2 component
    if (this.props.patientList !== nextProps.patientList) {
      this.setState({
        sourcePatientList: nextProps.patientList.map(({ id, name }) => {
          return { value: id, label: name };
        }).sort((a, b) => a.label.localeCompare(b.label))
      });
    } else if (this.props.patientMerger !== nextProps.patientMerger) {
      this.setState({
        mergeInProgress: nextProps.patientMerger != null,
        loading: false
      });
    }
  }

  // handles selection of source patient, field = source1Patient or source2Patient
  select2Handler(field) {
    // returns a function which fetches the patient and sets the state for the given field
    return (selectedOption) => {
      if (selectedOption) {
        let patient = this.props.patientList.find((patient) => patient.id === selectedOption.value);
        this.setState({
          [field]: patient
        });
      }
    };
  }

  beginMerge() {
    this.setState({ loading: true });
    this.props.mergePatients(this.state.source1Patient.id, this.state.source2Patient.id);
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

  allSourcesSelected() {
    return this.state.source1Patient != null && this.state.source2Patient != null;
  }

  // renders categories with patient data for selected source and target patients
  renderedPatientData() {
    if (!this.state.mergeInProgress) {
      // only renders when merge is in progress
      return;
    }

    return [
      <ArrayMerge key="conditions" panelTitle="Condition" objectKey="conditions" patientMerger={this.props.patientMerger} keys={Merge.conditionMergeKeys} />,
      <ArrayMerge key="encounters" panelTitle="Encounter" objectKey="encounters" patientMerger={this.props.patientMerger} keys={Merge.encounterMergeKeys} />,
      <ArrayMerge key="medications" panelTitle="Medication" objectKey="medications" patientMerger={this.props.patientMerger} keys={Merge.medicationMergeKeys} />,
      <ArrayMerge key="procedures" panelTitle="Procedure" objectKey="procedures" patientMerger={this.props.patientMerger} keys={Merge.procedureMergeKeys} />
    ];
  }

  renderedTarget() {
    if (!this.state.mergeInProgress) {
      return (
        <button className="btn btn-secondary merge-button d-flex" disabled={this.state.loading || !this.allSourcesSelected()} onClick={this.beginMerge.bind(this)}>
          Merge
        </button>
      );
    }

    return (
      <div className="merge-tool-header-selector target d-flex">
        <div className="merge-tool-header-selector-icon target">
          <FontAwesome name="user" />
          <span className="icon-line"></span>
        </div>

        {`${this.props.patientMerger.targetPatient.getName()} (${this.props.patientMerger.targetPatient.getId()})`}
      </div>
    );
  }

  renderedFooter() {
    if (!this.state.mergeInProgress) {
      return;
    }

    return (
      <div className="merge-tool-footer">
        <div className="d-flex justify-content-around">
          <div className="source source1">
            <div className="record-end"></div>
          </div>

          <div className="merge-tool-placeholder"></div>

          <div className="target">
            <div className="conflict-count">
              <FontAwesome name="exclamation-circle" />
              {this.props.patientMerger.numConflicts()} conflicts to accept
            </div>

            <div className="action-buttons">
              <button type="button" className="btn btn-secondary">Cancel</button>
              <button type="button" className="btn btn-primary">Create Target Record</button>
            </div>
          </div>

          <div className="merge-tool-placeholder"></div>

          <div className="source source2">
            <div className="record-end"></div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="merge">
        <PageHeader title="Merge" />

        <div className="merge-tool">
          <div className="merge-tool-header">
            <div className="merge-tool-header-titles row">
              <div className="merge-tool-header-title col">Source</div>
              <div className="merge-tool-header-title col">{this.state.mergeInProgress ? 'Target' : ''}</div>
              <div className="merge-tool-header-title col">Source</div>
            </div>

            <div className="merge-tool-header-selectors d-flex justify-content-around">
              <div className="merge-tool-header-selector source source1 d-flex">
                <div className="merge-tool-header-selector-icon source-1">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                {(() => {
                  if (this.state.mergeInProgress) {
                    return `${this.props.patientMerger.source1Patient.getName()} (${this.props.patientMerger.source1Patient.getId()})`;
                  }

                  return (
                    <Select
                      options={this.filteredSourceList(this.state.source2Patient)}
                      value={this.state.source1Patient == null ? null : this.state.source1Patient.id}
                      onChange={this.select2Handler('source1Patient')}
                      placeholder="Select a source" />
                  );
                })()}
              </div>

              <div className="merge-tool-placeholder"></div>

              {this.renderedTarget()}

              <div className="merge-tool-placeholder"></div>

              <div className="merge-tool-header-selector source source2 d-flex">
                <div className="merge-tool-header-selector-icon source-2">
                  <FontAwesome name="user" />
                  <span className="icon-line"></span>
                </div>

                {(() => {
                  if (this.state.mergeInProgress) {
                    return `${this.props.patientMerger.source2Patient.getName()} (${this.props.patientMerger.source2Patient.getId()})`;
                  }

                  return (
                    <Select
                      options={this.filteredSourceList(this.state.source1Patient)}
                      value={this.state.source2Patient == null ? null : this.state.source2Patient.id}
                      onChange={this.select2Handler('source2Patient')}
                      placeholder="Select a source" />
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="merge-tool-body">
            {this.renderedPatientData()}
          </div>

          {this.renderedFooter()}
        </div>
      </div>
    );
  }
}

Merge.displayName = 'Merge';

Merge.propTypes = {
  patientList: PropTypes.array,
  patientMerger: PropTypes.instanceOf(PatientMerger),
  fetchPatient: PropTypes.func.isRequired,
  fetchPatientList: PropTypes.func.isRequired,
  mergePatients: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchPatient,
    fetchPatientList,
    mergePatients
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    patientList: state.patient.patientList,
    patientMerger: state.merge.patientMerger
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Merge);
