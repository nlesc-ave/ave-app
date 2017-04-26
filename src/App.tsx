import * as React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router';
import { HashRouter as Router, Switch } from 'react-router-dom';

import { RegionViewer } from './RegionViewer';
import { Welcome } from './Welcome';

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <Switch>
            <Route path="/region/:genome_id/:chrom_id/:start_position/:end_position" component={RegionViewer}/>
            <Route component={Welcome}/>
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}
