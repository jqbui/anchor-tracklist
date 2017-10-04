import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const loggerMiddleware = createLogger();

// This store can be populated initially with the resource call on a server side render
// so that the client doesn't need to have a second call
const preloadedState = {};

let store = createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    ),
  ),
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
