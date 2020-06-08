import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import PrivateRoute from './lib/components/PrivateRoute';
import Games from './components/Games';
import Game from './components/Game';
import GameNew from './components/GameNew';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute component={GameNew} path="/game-new/:gameId" exact />
      <PrivateRoute component={Game} path="/game/:gameId" exact />
      <PrivateRoute component={Games} path="/" />
    </Switch>
  </BrowserRouter>
);

export default Router;
