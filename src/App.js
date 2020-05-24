import React from 'react';
import firebase from 'firebase/app';

import firebaseConfig from './firebaseConfig';
import { AuthProvider } from './lib/useAuth';
import { AppStateProvider } from './useAppState';
import Router from './Router';
import ThemeProvider from './ThemeProvider';

firebase.initializeApp(firebaseConfig);

const App = () => (
  <AppStateProvider>
    <AuthProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </AuthProvider>
  </AppStateProvider>
);

export default App;
