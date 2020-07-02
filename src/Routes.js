import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import App from './App';

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
    </Router>
  );
}
