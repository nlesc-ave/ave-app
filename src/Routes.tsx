import * as React from 'react';

import { Route } from 'react-router';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import { AboutPage } from './AboutPage';
import { RegionPage } from './containers/RegionPage';
import { SettingsPage } from './containers/SettingsPage';
import { WelcomePage } from './WelcomePage';

export const Routes = () => (
  <Router>
    <Switch>
      <Route path="/region/:genome_id/:chrom_id/:start_position/:end_position" component={RegionPage}/>
      <Route path="/settings" component={SettingsPage}/>
      <Route path="/about" component={AboutPage}/>
      <Route component={WelcomePage}/>
    </Switch>
  </Router>
);
