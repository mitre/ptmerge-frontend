import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import routes from '../routes';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    const history = syncHistoryWithStore(browserHistory, store);
    
    return (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

Root.displayName = 'Root';
