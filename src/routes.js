import React from 'react';
import { Route } from 'react-router';

import App from './containers/App';
import Dashboard from './containers/Dashboard';
import Merge from './containers/Merge';
import RecordSets from './containers/RecordSets';

export default (
  <Route component={App}>
    <Route path="/" component={Dashboard} />
    <Route path="/merge" component={Merge} />
    <Route path="/record-sets" component={RecordSets} />
  </Route>
);
