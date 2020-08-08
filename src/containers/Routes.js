import React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import App from './App';
import Download from './Download';

export default function Routes() {
  return (
    <Router>
      <Route exact path="/" component={App} />
      <Route exact path="/download/:cid/:path" component={Download} />
      <Route exact path="/download/:cid/:iv/:key/:path/:displayType" component={Download} />
      <Route
        exact
        path="/download/:cid/:path/:displayType"
        component={Download}
      />
    </Router>
  );
}
