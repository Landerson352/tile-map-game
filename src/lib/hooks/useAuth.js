import React from 'react';
import firebase from 'firebase/app';

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const signIn = () => auth.signInWithPopup(googleAuthProvider);
const signOut = () => auth.signOut();

const useAuth = () => {
    const [isLoaded, setIsLoaded] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
            setIsLoaded(true);
        });
    }, []);

    return {
        signIn,
        signOut,
        isLoaded,
        user,
    };
};

export default useAuth;
