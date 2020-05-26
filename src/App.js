import React from 'react';
import firebase from 'firebase/app';
// import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd'

import firebaseConfig from './firebaseConfig';
import { AuthProvider } from './lib/useAuth';
import { AppStateProvider } from './useAppState';
import Router from './Router';
import ThemeProvider from './ThemeProvider';

firebase.initializeApp(firebaseConfig);

const App = () => (
  <AppStateProvider>
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </AuthProvider>
    </DndProvider>
  </AppStateProvider>
);

export default App;
