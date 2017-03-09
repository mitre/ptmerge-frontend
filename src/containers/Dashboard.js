import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';

import { getCompletedMerges, getTargetBundles } from '../actions/merge';

import PageHeader from '../components/Header/PageHeader';

export class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    this.props.getCompletedMerges();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.completedMerges !== nextProps.completedMerges) {
      this.props.getTargetBundles(nextProps.completedMerges.map((merge) => merge.id)).then(() => this.setState({ loading: false }));
    }
  }

  renderedLoading() {
    return <div className="loading">Loading...</div>;
  }

  renderedMergeList() {
    let { completedMerges } = this.props;

    return completedMerges.map((merge) =>
      <div key={merge.getId()} className="completed-merges">
        <h2 className="completed-merges-title">Completed Merges ({completedMerges.length})</h2>
        <hr />

        <dl>
          <dt>Merge ID</dt>
          <dd>{merge.getId()}</dd>
          <dt>Target Patient Name</dt>
          <dd>{merge.patient.getName()}</dd>
          <dt>Target Patient ID</dt>
          <dd>{merge.patient.getId()}</dd>
          <dt>Timestamp</dt>
          <dd>{merge._bundle.end}</dd>
          <dt>Source 1 Patient Link</dt>
          <dd><a href={merge._bundle.source1}><FontAwesome name="link" /></a></dd>
          <dt>Source 2 Patient Link</dt>
          <dd><a href={merge._bundle.source2}><FontAwesome name="link" /></a></dd>
          <hr />
          <dt>Conflicts Resolved ({merge.getTotalConflicts()})</dt>
          <dd style={{paddingLeft: '2em'}}>
            {merge.mergeConflicts.map((conflict, index) =>
              <dl key={index} style={{borderBottom: '2px solid #333'}}>
                <dt>Model Class</dt>
                <dd>{conflict.mergeConflict.objectClass}</dd>
                <dt>Model ID</dt>
                <dd>{conflict.mergeConflict.objectId}</dd>
                <dt>Fields</dt>
                <dd>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        {conflict.mergeConflict._fields.map((field, index) =>
                          <th key={index}>{field}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {conflict.mergeConflict.fields.map((field, index) =>
                          <td key={index}>{conflict.targetPatientObject.get(field)}</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </dd>
              </dl>
            )}
          </dd>
        </dl>
        <hr />
      </div>
    );
  }

  render() {
    return (
      <div className="dashboard">
        <PageHeader title="Dashboard" />

        <div>
          {this.state.loading ? this.renderedLoading() : this.renderedMergeList()}
        </div>
      </div>
    );
  }
}

Dashboard.displayName = 'Dashboard';

Dashboard.propTypes = {
  completedMerges: PropTypes.array,
  getCompletedMerges: PropTypes.func.isRequired,
  getTargetBundles: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCompletedMerges,
    getTargetBundles
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    completedMerges: state.merge.completedMerges
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
