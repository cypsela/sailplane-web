import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './containers/Routes';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import configureStore from './config/configure-store';
import {ThemeProvider, DefaultTheme} from "styled-components";

const {store, persistor} = configureStore();

const theme: DefaultTheme = {
    primary: '#2b6284',
    primary2: '#ecf4f9',
    primary3: '#9fc7e0',
    primary35: '#97bace',
    primary4: 'hsl(204,38%,55%)',
    primary45: 'hsl(205,49%,66%)',
    primary46: '#67a1cb',
    primary15: 'rgb(241 249 255)',
    primary5: '#3881ad',
    primary6: '#132b3a',
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
        <Routes />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
