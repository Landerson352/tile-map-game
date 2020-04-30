import React from 'react';

import AccountMenu from './components/AccountMenu';
import ReactReduxFirebaseProvider from './ReactReduxFirebaseProvider';
import Router from './Router';
import { ThemeProvider } from './components/ui';

const App = () => (
  <ReactReduxFirebaseProvider>
    <ThemeProvider>
      <AccountMenu />
      <Router />
    </ThemeProvider>
  </ReactReduxFirebaseProvider>
);

export default App;
