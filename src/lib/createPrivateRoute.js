import React from 'react';
import { Route } from 'react-router-dom';

import useAuth from './useAuth';

const createPrivateRoute = (Login) => {
  const PrivateRoute = (props) => {
    const { component: Component, ...restProps } = props;
    const auth = useAuth();
    const render = (routeProps) => {
      if (!auth.isLoaded) {
        return <p>Please wait...</p>;
      };
      return auth.isEmpty ? (
        <Login />
      ) : (
        <Component {...routeProps} />
      );
    };
    return (
      <Route {...restProps} render={render} />
    );
  };
  return PrivateRoute;
};

export default createPrivateRoute;
