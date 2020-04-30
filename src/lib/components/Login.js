import React from 'react';

import { Button } from './ui';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const auth = useAuth();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={auth.signIn}
      rightIcon="arrow-forward"
    >
      Login With Google
    </Button>
  );
};

export default Login;
