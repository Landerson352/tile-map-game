import React from 'react';
import { Avatar, Button } from '@chakra-ui/core';

import useAuth from '../useAuth';

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
        onClick={auth.signOut}
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
