import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'roboto-npm-webfont';
import { App } from './App';
import './index.css';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
