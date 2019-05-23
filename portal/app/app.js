/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import FontFaceObserver from 'fontfaceobserver';
import createHistory from 'history/createBrowserHistory';
import 'sanitize.css/sanitize.css';
// import { MuiThemeProvider as MuiThemeProviderNext, createMuiTheme } from 'material-ui-next/styles';
import { MuiThemeProvider as MuiThemeProviderNext, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles'; // v1.x
// import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';

// import 'jquery/dist/jquery.min';

// import 'bootstrap-table/dist/bootstrap-table.min';
// import 'bootstrap/dist/js/bootstrap.min';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-table/dist/bootstrap-table.css';

import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./images/logo_office_automation.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions
/* eslint-enable import/no-webpack-loader-syntax */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Import CSS reset and Global Styles
import './global-styles';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(
  () => {
    document.body.classList.add('fontLoaded');
  },
  () => {
    document.body.classList.remove('fontLoaded');
  }
);

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

// modify material-UI default settings
const muiTheme = getMuiTheme({
  appBar: {
    color: '#283593',
    height: 60,
  },
  drawer: {
    width: 300,
    backgroundColor: '#000000',
  },
  avatar: {
    backgroundColor: '#ffffff',
  },
  card: {
    fontWeight: 300,
    // fontFamily: 'Roboto',
  },
  menuItem: {
    hoverColor: '#f0f7fb',
  },
  flatButton: {
    textColor: '#ffffff',
  },
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

// render handling
const sheetsRegistry = new SheetsRegistry();
// const sheetsManager = new Map();
const generateClassName = createGenerateClassName();

// eslint-disable-next-line
const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <MuiThemeProviderNext theme={theme}>
            <LanguageProvider messages={messages}>
              <ConnectedRouter history={history}>
                {/* <Header> */}
                <App />
                {/* </Header> */}
              </ConnectedRouter>
            </LanguageProvider>
          </MuiThemeProviderNext>
        </MuiThemeProvider>
      </JssProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  // eslint-disable-next-line
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js'), import('intl/locale-data/jsonp/de.js')]))
    .then(() => render(translationMessages))
    // eslint-disable-next-line
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
