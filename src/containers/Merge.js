import React, { Component } from 'react';

import PageHeader from '../components/Header/PageHeader';

export default class Merge extends Component {
  render() {
    return (
      <div className="merge">
        <PageHeader title="Merge" />
      </div>
    );
  }
}

Merge.displayName = 'Merge';
