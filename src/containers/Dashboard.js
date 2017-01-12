import React, { Component } from 'react';

import PageHeader from '../components/Header/PageHeader';

export default class Dashboard extends Component {
  render() {
    return (
      <div className="dashboard">
        <PageHeader title="Dashboard" />
      </div>
    );
  }
}

Dashboard.displayName = 'Dashboard';
