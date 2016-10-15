import React, { Component, PropTypes } from 'react';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import routes from '../routes';
import { Router } from 'react-router';

export default class Root extends Component {
  render() {
    let { store } = this.props;

    // Create an enhanced history that syncs navigation events with the store
    let history = syncHistoryWithStore(browserHistory, store);

    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes} />
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

Root.displayName = 'Root';
