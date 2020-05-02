import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const AuthContext = React.createContext({});

export const AuthProvider = (props) => {
  const googleAuthProvider = React.useRef(new firebase.auth.GoogleAuthProvider()).current;
  const [isLoaded, setIsLoaded] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsLoaded(true);
      // TODO: set hasLoggedOut to true
    });
  }, []);

  const value = {
    isLoaded,
    signIn: () => firebase.auth().signInWithPopup(googleAuthProvider),
    signOut: () => firebase.auth().signOut(),
    user,
  };

  return (
    <AuthContext.Provider value={value} {...props} />
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export default useAuth;
