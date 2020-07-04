import React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import App from './App';
import Download from "./Download";

const styles = {
  container: {
    // maxWidth: 900,
    // margin: '0 auto',
    // backgroundColor: '#FFF',
  },
};

export default function Routes() {
  return (
    <Router>
      <Route exact path="/" component={App} />
      <Route exact path="/download/:address/:path" component={Download} />
    </Router>
  );
}
