import React from 'react';

import { Avatar, Button } from './ui';
import useAuth from '../hooks/useAuth';

const AccountMenu = () => {
  const auth = useAuth();

  if (!auth.isLoaded || !auth.user) {
    return null;
  }

  const { displayName, photoURL } = auth.user;

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
      <p>Logged in as {displayName}</p>
      <Avatar src={photoURL} name={displayName} />
    </>
  );
};

export default AccountMenu;
