import React, { Component } from 'react';

export default class App extends Component {
  render() {
    let { children } = this.props; //eslint-disable-line

    return (
      <div className="app container">
        Patient Merging Test Harness
        {children}
      </div>
    );
  }
}

App.displayName = 'App';
