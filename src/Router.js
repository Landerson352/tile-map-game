import React from 'react';
import { BrowserRouter, Switch, } from 'react-router-dom';

import createPrivateRoute from './lib/createPrivateRoute';
import Login from './components/Login';
import Games from './components/Games';

const PrivateRoute = createPrivateRoute(Login);

const Router = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute component={Games} path="/" />
    </Switch>
  </BrowserRouter>
);

export default Router;
