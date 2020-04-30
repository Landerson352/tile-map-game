import { useSelector } from 'react-redux';
import firebase from 'firebase/app';

const useAuth = () => {
  const auth = useSelector(state => state.firebase.auth);
  const loginWithGoogle = () => {
    return firebase.login({ provider: 'google', type: 'popup' });
  };
  const logout = () => {
    return firebase.logout();
  };

  return {
    ...auth,
    loginWithGoogle,
    logout,
  };
};

export default useAuth;
