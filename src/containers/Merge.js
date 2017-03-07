import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';

import Select from 'react-select';

import { fetchPatient, fetchPatientList } from '../actions/patient';
import { mergePatients, abortMerge } from '../actions/merge';

import PageHeader from '../components/Header/PageHeader';
import MergeCategory from '../components/Merge/MergeCategory';

import PatientMerger from '../models/patient_merger';
import { conditionMergeKeys } from '../models/condition';
import { encounterMergeKeys } from '../models/encounter';
import { medicationMergeKeys } from '../models/medication';
import {
  addressMergeKeys,
  nameMergeKeys,
  dateOfBirthMergeKeys,
  genderMergeKeys,
  maritalStatusMergeKeys,
  metaMergeKeys,
  telecomMergeKeys
} from '../models/patient';
import { procedureMergeKeys } from '../models/procedure';

export class Merge extends Component {
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

  abortMerge() {
    this.setState({ loading: true });
    this.props.abortMerge(this.props.patientMerger.getMergeId()).then(() => {
      this.setState({
        source1Patient: null,
        source2Patient: null,
        mergeInProgress: false,
        loading: false
      });
    });
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
    if (!this.state.mergeInProgress) { return; }

    let params = {
      updateParentView: this.forceUpdate.bind(this),
      onAccept: (objectKey, keys) => {
        let resolvedKeys = keys == null ? null : Object.values(keys);
        this.props.patientMerger.resolveConflicts(objectKey, resolvedKeys);
        this.forceUpdate();
      }
    };

    return [
      <MergeCategory {...params} key="allergy" panelTitle="Allergies" objectKey={null} patientMerger={this.props.patientMerger} keys={null} />,
      <MergeCategory {...params} key="behavior" panelTitle="Behaviors" objectKey={null} patientMerger={this.props.patientMerger} keys={null} />,
      <MergeCategory {...params} key="conditions" panelTitle="Conditions" objectKey="conditions" patientMerger={this.props.patientMerger} keys={conditionMergeKeys} />,
      <MergeCategory {...params} key="demographics" panelTitle="Demographics" objectKey="patient" patientMerger={this.props.patientMerger} keys={null} hasNested={true}>
        <div>
          <MergeCategory {...params} key="address" panelTitle="Address" objectKey="patient" patientMerger={this.props.patientMerger} keys={addressMergeKeys} isNested={true} />
          <MergeCategory {...params} key="dateOfBirth" panelTitle="Date of Birth" objectKey="patient" patientMerger={this.props.patientMerger} keys={dateOfBirthMergeKeys} isNested={true} />
          <MergeCategory {...params} key="gender" panelTitle="Gender" objectKey="patient" patientMerger={this.props.patientMerger} keys={genderMergeKeys} isNested={true} />
          <MergeCategory {...params} key="healthInsurance" panelTitle="Health Insurance" objectKey={null} patientMerger={this.props.patientMerger} keys={null} isNested={true} />
          <MergeCategory {...params} key="meta" panelTitle="Meta" objectKey="patient" patientMerger={this.props.patientMerger} keys={metaMergeKeys} isNested={true} />
          <MergeCategory {...params} key="name" panelTitle="Name" objectKey="patient" patientMerger={this.props.patientMerger} keys={nameMergeKeys} isNested={true} />
          <MergeCategory {...params} key="maritalStatus" panelTitle="Marital Status" objectKey="patient" patientMerger={this.props.patientMerger} keys={maritalStatusMergeKeys} isNested={true} />
          <MergeCategory {...params} key="placeOfBirth" panelTitle="Place of Birth" objectKey={null} patientMerger={this.props.patientMerger} keys={null} isNested={true} />
          <MergeCategory {...params} key="socialSecurityNumber" panelTitle="Social Security Number" objectKey={null} patientMerger={this.props.patientMerger} keys={null} isNested={true} />
          <MergeCategory {...params} key="telecom" panelTitle="Telecom" objectKey="patient" patientMerger={this.props.patientMerger} keys={telecomMergeKeys} isNested={true} />
        </div>
      </MergeCategory>,
      <MergeCategory {...params} key="encounters" panelTitle="Encounters" objectKey="encounters" patientMerger={this.props.patientMerger} keys={encounterMergeKeys} />,
      <MergeCategory {...params} key="familyHistory" panelTitle="Family History" objectKey={null} patientMerger={this.props.patientMerger} keys={null} />,
      <MergeCategory {...params} key="immunization" panelTitle="Immunizations" objectKey={null} patientMerger={this.props.patientMerger} keys={null} />,
      <MergeCategory {...params} key="lab" panelTitle="Lab" objectKey={null} patientMerger={this.props.PatientMerger} keys={null} />,
      <MergeCategory {...params} key="lifeHistory" panelTitle="Life History" objectKey={null} patientMerger={this.props.PatientMerger} keys={null} />,
      <MergeCategory {...params} key="medications" panelTitle="Medications" objectKey="medications" patientMerger={this.props.patientMerger} keys={medicationMergeKeys} />,
      <MergeCategory {...params} key="procedures" panelTitle="Procedures" objectKey="procedures" patientMerger={this.props.patientMerger} keys={procedureMergeKeys} />,
      <MergeCategory {...params} key="vitals" panelTitle="Vitals" objectKey={null} patientMerger={this.props.patientMerger} keys={null} />
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

    let numConflicts = this.props.patientMerger.numConflicts();

    return (
      <div className="merge-tool-footer">
        <div className="d-flex justify-content-around">
          <div className="source source1">
            <div className="record-end"></div>
          </div>

          <div className="merge-tool-placeholder"></div>

          <div className="target">
            <div className={`conflict-count${numConflicts === 0 ? ' done' : ''}`}>
              <FontAwesome name={numConflicts === 0 ? 'check-circle' : 'exclamation-circle'} />{' '}
              {numConflicts === 0 ? 'All conflicts resolved' : `${numConflicts} conflicts to accept`}
            </div>

            <div className="action-buttons">
              <button type="button" className="btn btn-secondary" disabled={this.state.loading} onClick={this.abortMerge.bind(this)}>Cancel</button>
              <button type="button" className="btn btn-primary" disabled={this.state.loading || numConflicts > 0}>Create Target Record</button>
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
  mergePatients: PropTypes.func.isRequired,
  abortMerge: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchPatient,
    fetchPatientList,
    mergePatients,
    abortMerge
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    patientList: state.patient.patientList,
    patientMerger: state.merge.patientMerger
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Merge);
