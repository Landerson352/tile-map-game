import React from 'react';
import { Button } from '@chakra-ui/core';

import useAuth from '../useAuth';

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
