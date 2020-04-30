import React from 'react';

import './lib/firebase';
import AccountMenu from './lib/components/AccountMenu';
import Router from './Router';
import { ThemeProvider } from './lib/components/ui';

const App = () => (
  <ThemeProvider>
    <AccountMenu />
    <Router />
  </ThemeProvider>
);

export default App;
