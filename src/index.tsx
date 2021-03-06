import * as React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { Routes } from './components/Routes'
import { configureStore } from './configureStore'

import 'roboto-npm-webfont'
import './index.css'

injectTapEventPlugin()
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Routes />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
