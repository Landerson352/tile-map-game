import React from 'react';

import { Button } from './ui';
import useAuth from '../lib/useAuth';

const Login = () => {
  const auth = useAuth();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={auth.loginWithGoogle}
      rightIcon="arrow-forward"
    >
      Login With Google
    </Button>
  );
};

export default Login;
