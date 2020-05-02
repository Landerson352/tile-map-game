import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import PrivateRoute from './lib/components/PrivateRoute';
import Games from './components/Games';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute component={Games} path="/" />
    </Switch>
  </BrowserRouter>
);

export default Router;
