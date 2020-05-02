import React from 'react';
import firebase from 'firebase/app';

import firebaseConfig from './firebaseConfig';
import { AuthProvider } from './lib/useAuth';
import AccountMenu from './lib/components/AccountMenu';
import Router from './Router';
import ThemeProvider from './components/ThemeProvider';

firebase.initializeApp(firebaseConfig);

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <AccountMenu />
      <Router />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
