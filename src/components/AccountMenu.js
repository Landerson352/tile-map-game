import React from 'react';

import { Avatar, Button } from './ui';
import useAuth from '../lib/useAuth';

const AccountMenu = () => {
  const auth = useAuth();

  if (!auth.isLoaded || auth.isEmpty) {
    return null;
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={auth.logout}
        rightIcon="arrow-forward"
      >
        Log out
      </Button>
      <p>Logged in as {auth.displayName}</p>
      <Avatar src={auth.photoURL} name={auth.displayName} />
    </>
  );
};

export default AccountMenu;
