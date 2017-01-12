import React, { Component } from 'react';

import PageHeader from '../components/Header/PageHeader';

export default class RecordSets extends Component {
  render() {
    return (
      <div className="record-sets">
        <PageHeader title="Record Sets" />
      </div>
    );
  }
}

RecordSets.displayName = 'RecordSets';
