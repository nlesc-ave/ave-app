import * as React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { AboutPage } from './AboutPage';
import { RegionViewer } from './RegionViewer';
import { SettingsPage } from './SettingsPage';
import { Welcome } from './Welcome';

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <Switch>
            <Route path="/region/:genome_id/:chrom_id/:start_position/:end_position" component={RegionViewer}/>
            <Route path="/settings" component={SettingsPage}/>
            <Route path="/about" component={AboutPage}/>
            <Route component={Welcome}/>
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}
