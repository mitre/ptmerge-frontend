import React from 'react';
import { Route } from 'react-router';

import App from './components/App';

export default (
  <Route component={App}>
    <Route path="/" component={App} />
  </Route>
);
